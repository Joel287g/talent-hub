# 🔐 Guía de Autenticación (JWT + Passport)

Este documento describe cómo **Talent Hub** valida la sesión del usuario en cada petición mediante un JSON Web Token (JWT) firmado por el propio backend, y cómo los controladores acceden al usuario autenticado.

> El `uid` es el UID de Firebase y **no participa** en la validación del JWT. El payload solo contiene el `id` interno del usuario; el resto de sus datos se leen de la base de datos en cada petición.

---

## 1. Ubicación Arquitectónica

La autenticación vive en su propio módulo (`src/auth`, alias `@auth`), con su propio catálogo de errores (`AuthErrors`) separado del de usuarios. La `JwtStrategy` verifica la integridad del usuario mediante el puerto `USERS_REPOSITORY` exportado por el `UsersModule`, así que nunca toca Mongoose directamente y `users` no conoce nada de autenticación.

```text
src/
 ├── auth/
 │   ├── domain/
 │   │   ├── exceptions/
 │   │   │   ├── enums/
 │   │   │   │   └── auth-errors.enum.ts    # AuthErrorsEnum (AUTH-INVALID_TOKEN, ...)
 │   │   │   └── auth-errors.exceptions.ts  # AuthErrors
 │   │   └── interfaces/
 │   │       └── jwt-payload.interface.ts   # JwtPayload { id }
 │   ├── application/
 │   │   └── services/
 │   │       └── jwt.service.ts              # AuthService.sign(user)
 │   ├── infrastructure/
 │   │   ├── strategies/
 │   │   │   └── jwt.strategy.ts             # JwtStrategy (passport-jwt)
 │   │   └── guards/
 │   │       └── jwt-auth.guard.ts           # JwtAuthGuard (APP_GUARD global)
 │   └── auth.module.ts                      # PassportModule + JwtModule + APP_GUARD
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

## 2. Flujo de Validación por Petición

1. El `JwtAuthGuard` (registrado globalmente con `APP_GUARD` en el `AuthModule`) intercepta la petición.
2. Si el endpoint o el controlador están marcados con `@PublicJwt()` (metadata `GuardsDecorators.IS_PUBLIC_JWT`), la petición pasa sin validar.
3. El guard ejecuta la `JwtStrategy`, **único punto** donde se verifica el token: lo extrae de la cabecera `authorization` (**sin prefijo `Bearer`**) y comprueba la firma (`HS256`, `JWT_SECRET`), la expiración y la audiencia (`JWT_AUDIENCE`). Toda la configuración (firma y verificación) sale de `JwtConfigService`. Si falla, `JwtAuthGuard.handleRequest` registra el motivo y responde **401**.
4. Si el token es válido, `validate({ id })` comprueba en base de datos que el usuario **existe** y está **`ACTIVE`** (`UserEntity.isActive()`).
5. La `UserEntity` devuelta se adjunta en `request.user` y queda disponible para `@GetUser()`.

---

## 3. Errores

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

Todos los errores son `BaseException`, por lo que los traduce el `DomainExceptionFilter`.

---

## 4. Uso en Controladores

```typescript
//? Imports de usuario
import { GetUser, PublicJwt } from '@common/infrastructure/decorators';

@Controller('users')
export class UsersController {
  //* Ruta protegida: devuelve la entidad completa del usuario autenticado
  @Get('me')
  public me(@GetUser() user: UserEntity) {}

  //* Una sola propiedad
  @Get('me/id')
  public myId(@GetUser('id') id: string) {}

  //* Varias propiedades ➔ { id, email }
  @Get('me/contact')
  public myContact(@GetUser(['id', 'email']) contact: Pick<UserEntity, 'id' | 'email'>) {}

  //* Ruta pública: el guard no exige token (ej. onboarding)
  @PublicJwt()
  @Post('create')
  public create() {}
}
```

---

## 5. Pendiente

- //TODO: Endpoint de **login** que firme el token con `AuthService.sign(user)` (exportado por el `AuthModule`) y su renovación.

---

**Main menu:** [README.md](../../README.md) || **Previous:** [Estándares de Código y Formato](../architecture/code-standards.md)
