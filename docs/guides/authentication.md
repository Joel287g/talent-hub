# 🔐 Guía de Autenticación (JWT + Passport)

Este documento describe cómo **Talent Hub** abre la sesión del usuario (canjeando el ID token de Firebase por un JWT propio en `/auth/login` y `/auth/register`), cómo valida ese JWT en cada petición y cómo los controladores acceden al usuario autenticado.

> El `uid` es el UID de Firebase y **no participa** en la validación del JWT. El payload solo contiene el `id` interno del usuario; el resto de sus datos se leen de la base de datos en cada petición.

---

## 1. Ubicación Arquitectónica

La autenticación vive en su propio módulo (`src/auth`, alias `@auth`), con su propio catálogo de errores (`AuthErrors`) separado del de usuarios. La `JwtStrategy` verifica la integridad del usuario mediante el puerto `USERS_REPOSITORY` exportado por el `UsersModule`, así que nunca toca Mongoose directamente y `users` no conoce nada de autenticación.

```text
src/
 ├── auth/
 │   ├── domain/
 │   │   ├── enums/
 │   │   │   └── sign-in-provider.enum.ts   # SignInProviderEnum (EMAIL_PASSWORD | GOOGLE)
 │   │   ├── exceptions/
 │   │   │   ├── enums/
 │   │   │   │   └── auth-errors.enum.ts    # AuthErrorsEnum (AUTH-INVALID_TOKEN, ...)
 │   │   │   └── auth-errors.exceptions.ts  # AuthErrors
 │   │   ├── interfaces/
 │   │   │   ├── auth-session.interface.ts  # AuthSession { accessToken }
 │   │   │   ├── jwt-payload.interface.ts   # JwtPayload { id }
 │   │   │   └── verified-identity.interface.ts # VerifiedIdentity { uid, email, emailVerified, provider }
 │   │   └── ports/
 │   │       └── identity-provider.port.ts  # IDENTITY_PROVIDER + IdentityProvider.verifyToken()
 │   ├── application/
 │   │   └── services/
 │   │       ├── auth.service.ts             # AuthService.sign(user)
 │   │       ├── login.service.ts            # LoginService (ID token ➔ JWT)
 │   │       └── register.service.ts         # RegisterService (ID token + onboarding ➔ usuario + JWT)
 │   ├── infrastructure/
 │   │   ├── controllers/
 │   │   │   └── auth.controller.ts          # POST /auth/login y /auth/register
 │   │   ├── providers/
 │   │   │   └── firebase-identity.provider.ts # FirebaseIdentityProvider (adaptador de IDENTITY_PROVIDER)
 │   │   ├── strategies/
 │   │   │   └── jwt.strategy.ts             # JwtStrategy (passport-jwt)
 │   │   └── guards/
 │   │       └── jwt-auth.guard.ts           # JwtAuthGuard (APP_GUARD global)
 │   └── auth.module.ts                      # PassportModule + JwtModule + APP_GUARD
 ├── configuration/
 │   └── security/
 │       └── firebase-config.ts              # FirebaseConfigService + FIREBASE_AUTH (Admin SDK)
 ├── common/
 │   └── infrastructure/
 │       └── decorators/
 │           ├── get-user.decorator.ts       # @GetUser()
 │           └── public-jwt.decorator.ts     # @PublicJwt()
 └── users/
     └── domain/
         └── entities/
             └── user.entity.ts              # UserEntity.isActive()
```

---

## 2. Login y Registro

El cliente inicia sesión en Firebase (correo/contraseña o Google) y envía su ID token en la cabecera **`firebase-token`** (sin prefijo `Bearer`) para canjearlo por el JWT del backend. Ambas rutas son `@PublicJwt()` y responden solo `{ accessToken }`: los datos del usuario pertenecen al módulo `users` y se obtienen con `GET /users/me`.

```text
 Firebase (cliente) ──► ID token
                          │
 POST /api/auth/login     ├─ header firebase-token ──► LoginService
                          │                              IdentityProvider.verifyToken ➔ FindUserByUidUseCase
                          │                              ├─ no existe ➔ 404 USER-NOT_FOUND (el cliente va al onboarding)
                          │                              ├─ INACTIVE  ➔ 401 AUTH-INACTIVE_USER
                          │                              └─ ACTIVE    ➔ 200 { accessToken }
                          │
 POST /api/auth/register  └─ header firebase-token ──► RegisterService
    body: CreateUserDto                                  IdentityProvider.verifyToken ➔ CreateUserService(identity, body)
                                                         └─ 201 { accessToken }   (409 si ya existe)
```

- **`uid` y `email` salen del token verificado** (`UserIdentityType`), nunca del body: `CreateUserDto` ya no los incluye y el `ValidationPipe` (`whitelist: true`) descarta cualquier `uid` o `email` que llegue en el body.
- El registro **no exige** todavía el email verificado (`VerifiedIdentity.emailVerified`): la cuenta se crea `ACTIVE`.
- Sustituye al antiguo `POST /users/create`, que recibía el `uid` en el body.

| Situación                                          | Respuesta                                | Código                           |
| :------------------------------------------------- | :--------------------------------------- | :------------------------------- |
| Login de un usuario sin registrar                  | **404** `USER-NOT_FOUND`                 | `AUTH-APP-SER-LOGI-001`          |
| Login de una cuenta `INACTIVE`                     | **401** `AUTH-INACTIVE_USER`             | `AUTH-APP-SER-LOGI-002`          |
| Registro de un `uid`, email o teléfono ya existente | **409** `USER-ALREADY_EXISTS`           | `USER-APP-SER-CREA_USER-001`     |
| Body del registro inválido                         | **400** (`ValidationPipe`)               | —                                |
| ID token ausente o no válido                       | **401/403/503** (ver sección 6)          | `AUTH-INF-PRO-FIRE_IDEN-00X`     |

---

## 3. Flujo de Validación por Petición

1. El `JwtAuthGuard` (registrado globalmente con `APP_GUARD` en el `AuthModule`) intercepta la petición.
2. Si el endpoint o el controlador están marcados con `@PublicJwt()` (metadata `GuardsDecorators.IS_PUBLIC_JWT`), la petición pasa sin validar.
3. El guard ejecuta la `JwtStrategy`, **único punto** donde se verifica el token: lo extrae de la cabecera `authorization` (**sin prefijo `Bearer`**) y comprueba la firma (`HS256`, `JWT_SECRET`), la expiración y la audiencia (`JWT_AUDIENCE`). Toda la configuración (firma y verificación) sale de `JwtConfigService`. Si falla, `JwtAuthGuard.handleRequest` registra el motivo y responde **401**.
4. Si el token es válido, `validate({ id })` comprueba en base de datos que el usuario **existe** y está **`ACTIVE`** (`UserEntity.isActive()`).
5. La `UserEntity` devuelta se adjunta en `request.user` y queda disponible para `@GetUser()`.

---

## 4. Errores

| Situación                                                      | Origen                       | Respuesta                                      |
| :------------------------------------------------------------- | :--------------------------- | :--------------------------------------------- |
| Sin token, firma inválida, token mal formado, expirado, etc.   | `JwtAuthGuard.handleRequest` | **401** `AUTH-INVALID_TOKEN` + log `LoggerJwt` |
| El `id` del token ya no corresponde a ningún usuario           | `JwtStrategy.validate`       | **401** `AUTH-INVALID_SESSION`                 |
| La cuenta del usuario está `INACTIVE`                          | `JwtStrategy.validate`       | **401** `AUTH-INACTIVE_USER`                   |
| `@GetUser()` usado en una ruta pública (no hay `request.user`) | `GetUser`                    | **500** `INTERNAL_SERVER_ERROR`                |

Cada fallo de token se registra con `LoggerTypes.JWT` (sin cabeceras, para no guardar el token) y devuelve en `additionalException.code` un código único según el motivo:

| Motivo (`LoggerJwt`) | Código                      | Nivel de log |
| :------------------- | :-------------------------- | :----------- |
| `NOT_FOUND`          | `AUTH-INF-GUA-JWT_AUTH-001` | warning      |
| `EXPIRED`            | `AUTH-INF-GUA-JWT_AUTH-002` | warning      |
| `NOT_BEFORE`         | `AUTH-INF-GUA-JWT_AUTH-003` | warning      |
| `MALFORMED`          | `AUTH-INF-GUA-JWT_AUTH-004` | warning      |
| `INVALID_SIGNATURE`  | `AUTH-INF-GUA-JWT_AUTH-005` | error        |
| `JSON_WEB_TOKEN`     | `AUTH-INF-GUA-JWT_AUTH-006` | error        |
| `ANOTHER`            | `AUTH-INF-GUA-JWT_AUTH-007` | error        |

Como el `SnifferMiddleware` se ejecuta antes que los guards, las peticiones rechazadas también quedan en la colección `sniffer`. En las autenticadas se guarda además el `userId`.

> //! **Seguridad:** antes de registrar nada en `sniffer`, `logger` o la consola, `redactSensitive` (`@common/infrastructure/helpers`) sustituye por `[REDACTED]` el token (incluida la cabecera `firebase-token`), la API key, las cookies, las contraseñas y cualquier JWT que aparezca en un texto. Si se añade un campo sensible nuevo, hay que incluirlo en `SENSITIVE_KEYS`.

Todos los errores son `BaseException`, por lo que los traduce el `DomainExceptionFilter`.

---

## 5. Uso en Controladores

```typescript
//? Imports de usuario
import { GetUser, PublicJwt } from '@common/infrastructure/decorators';

@Controller('users')
export class UsersController {
  //* Ruta protegida (implementada): la JwtStrategy ya cargó el usuario, solo se mapea la respuesta
  @Get('me')
  public me(@GetUser() user: UserEntity): UserInterface {
    return UserMapper.toResponse(user);
  }

  //* Una sola propiedad
  @Get('me/id')
  public myId(@GetUser('id') id: string) {}

  //* Varias propiedades ➔ { id, email }
  @Get('me/contact')
  public myContact(@GetUser(['id', 'email']) contact: Pick<UserEntity, 'id' | 'email'>) {}
}

//* Rutas públicas: el guard no exige JWT (ej. AuthController, que usa el ID token de Firebase)
@PublicJwt()
@Controller('auth')
export class AuthController {
  @Post('login')
  public login(@Headers(FIREBASE_TOKEN_HEADER) firebaseToken: string) {}
}
```

---

## 6. Configuración de Firebase (Admin SDK)

El inicio de sesión lo hace Firebase Authentication (métodos activos: **correo/contraseña** y **Google**). El backend solo usa `firebase-admin` para **verificar** el ID token de Firebase y nunca gestiona contraseñas.

- **`FirebaseConfigService`** (`@configuration/security`): única fuente de configuración. Inicializa la app de Firebase una sola vez (reutiliza la existente con la recarga en caliente) y devuelve su `Auth`.
- **`FIREBASE_AUTH`**: token `Symbol` con la instancia de `Auth`, registrado en el `AuthModule`. Solo lo inyecta el `FirebaseIdentityProvider`, nunca los casos de uso.

### Puerto `IDENTITY_PROVIDER`

Los casos de uso no conocen Firebase: dependen del puerto `IdentityProvider` (`@auth/domain/ports`), cuyo único método `verifyToken(token)` devuelve una `VerifiedIdentity`:

```typescript
interface VerifiedIdentity {
  uid: string; //? UserEntity.uid
  email: string; //? Siempre en minúsculas
  emailVerified: boolean;
  provider: SignInProviderEnum; //? EMAIL_PASSWORD | GOOGLE
}
```

El adaptador `FirebaseIdentityProvider` (`@auth/infrastructure/providers`) llama a `verifyIdToken(token, true)`. Además de la firma, la expiración y la audiencia (`FIREBASE_PROJECT_ID`), comprueba en Firebase que la sesión no esté revocada ni la cuenta deshabilitada. Esto supone una consulta extra a Firebase, así que solo debe usarse al canjear el token (login o registro), nunca en cada petición.

Los errores de `firebase-admin` se traducen al catálogo `AuthErrors`:

| Situación                                                    | Error                                    | Código                       |
| :----------------------------------------------------------- | :--------------------------------------- | :--------------------------- |
| Token vacío (no se llama a Firebase)                         | **401** `AUTH-INVALID_IDENTITY_TOKEN`    | `AUTH-INF-PRO-FIRE_IDEN-001` |
| Token mal formado, firma inválida o de otro proyecto         | **401** `AUTH-INVALID_IDENTITY_TOKEN`    | `AUTH-INF-PRO-FIRE_IDEN-002` |
| Token expirado                                               | **401** `AUTH-INVALID_IDENTITY_TOKEN`    | `AUTH-INF-PRO-FIRE_IDEN-003` |
| Sesión revocada (`revokeRefreshTokens`)                      | **401** `AUTH-INVALID_IDENTITY_TOKEN`    | `AUTH-INF-PRO-FIRE_IDEN-004` |
| Cuenta deshabilitada en Firebase                             | **401** `AUTH-INVALID_IDENTITY_TOKEN`    | `AUTH-INF-PRO-FIRE_IDEN-005` |
| Cuenta borrada en Firebase                                   | **401** `AUTH-INVALID_IDENTITY_TOKEN`    | `AUTH-INF-PRO-FIRE_IDEN-006` |
| Método no admitido (anónimo, teléfono, token personalizado…) | **403** `AUTH-UNSUPPORTED_SIGN_IN_PROVIDER` | `AUTH-INF-PRO-FIRE_IDEN-007` |
| Token sin email                                              | **401** `AUTH-INVALID_IDENTITY_TOKEN`    | `AUTH-INF-PRO-FIRE_IDEN-008` |
| Red, permisos de la cuenta de servicio o error interno       | **503** `AUTH-IDENTITY_PROVIDER_UNAVAILABLE` | `AUTH-INF-PRO-FIRE_IDEN-009` |

> //! Para admitir un método de inicio de sesión nuevo, hay que activarlo en Firebase Console **y** añadirlo a `SignInProviderEnum` y a `SIGN_IN_PROVIDERS` del adaptador. Si no, sus tokens se rechazan con 403.

### Variables de entorno

| Variable                      | Obligatoria                      | Origen                                                        |
| :---------------------------- | :------------------------------- | :------------------------------------------------------------ |
| `FIREBASE_PROJECT_ID`         | Sí                               | `project_id` del JSON de la cuenta de servicio                |
| `FIREBASE_CLIENT_EMAIL`       | Sí, salvo con emulador           | `client_email` del JSON                                       |
| `FIREBASE_PRIVATE_KEY`        | Sí, salvo con emulador           | `private_key` del JSON, en una línea, entre comillas dobles y con `\n` |
| `FIREBASE_AUTH_EMULATOR_HOST` | No (prohibida en `production`)   | `127.0.0.1:9099` para usar el emulador local                  |

El JSON se descarga en _Firebase Console ➔ Configuración del proyecto ➔ Cuentas de servicio ➔ Generar nueva clave privada_. Solo se copian sus valores al `.env`: el JSON **nunca** se guarda en el repositorio.

> //! `FIREBASE_AUTH_EMULATOR_HOST` hace que `firebase-admin` acepte tokens sin firmar. Joi la rechaza si `NODE_ENV` es `production` o no está definido.

### Probar sin frontend

Un ID token se puede obtener directamente de la API REST de Firebase Auth:

```powershell
# Proyecto real: <WEB_API_KEY> en Configuración del proyecto ➔ General
$R = Invoke-RestMethod -Method Post `
  -Uri "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=<WEB_API_KEY>" `
  -ContentType "application/json" `
  -Body '{"email":"valeria@test.com","password":"123456","returnSecureToken":true}'

$R.idToken  # ID token de Firebase

# Canjearlo por el JWT del backend
Invoke-RestMethod -Method Post -Uri "http://localhost:<PORT>/api/auth/login" `
  -Headers @{ "firebase-token" = $R.idToken }
```

En Swagger (`/api/docs`), `/auth/login` y `/auth/register` muestran un campo para pegar la cabecera `firebase-token`. El `accessToken` que devuelven se pega en el botón **Authorize** (esquema `authorization`, sin `Bearer`), que Swagger aplica a todas las rutas para probar las protegidas (ej. `GET /users/me`).

Con el emulador (`firebase emulators:start --only auth --project demo-talent-hub`), la URL es `http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake` y no hacen falta credenciales.

---

## 7. Pendiente

- //TODO: Verificación de correo: crear las cuentas con un estado pendiente cuando `emailVerified` sea `false` y activarlas al verificar el correo en Firebase.
- //TODO: Renovación de la sesión en el cliente (nuevo ID token de Firebase ➔ `/auth/login`).

---

**Main menu:** [README.md](../../README.md) || **Previous:** [Estándares de Código y Formato](../architecture/code-standards.md)
