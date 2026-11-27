# 👥 Guía de Perfiles de Usuario (Personal y Empresa)

Este documento describe cómo un usuario de **Talent Hub** gestiona sus perfiles: el **perfil personal** (artista) y sus **cuentas de empresa** (academias, compañías, etc.). Explica cómo añadir el perfil que no se creó en el registro, cómo editarlo y cómo cambiar el perfil activo, que es el que decide qué datos muestra el cliente.

> Todas las rutas son protegidas: requieren el JWT del backend en la cabecera `authorization` (ver [Autenticación](./authentication.md)). El usuario lo carga la `JwtStrategy` y llega al controlador con `@GetUser()`.

---

## 1. Modelo

```text
UserEntity
 ├── activeProfileType        # PERSONAL | BUSINESS ➔ qué perfil está activo
 ├── activeBusinessProfileId  # empresa activa cuando activeProfileType es BUSINESS
 ├── personalProfile          # 0..1 (PersonalProfileEntity)
 └── businessProfiles[]       # 0..N (BusinessProfileEntity, cada una con su id)
```

- Un usuario tiene **como máximo un perfil personal** y **0..N cuentas de empresa**.
- El registro (`POST /auth/register`) crea el perfil del `activeProfileType` elegido. El otro se añade después (sección 2).
- **`activeBusinessProfileId`**: al registrarse las empresas aún no tienen id (se genera al persistir), así que se guarda `null`. En ese caso, y si la empresa guardada ya no existe, `UserEntity.activeBusinessProfileId` devuelve **la primera empresa**.

---

## 2. Añadir el otro perfil después del registro

Ambas rutas usan el mismo DTO que el registro, responden **201** con el usuario completo (`UserMapper.toResponse`) y **no cambian** el perfil activo.

| Ruta                                   | Body                       | Servicio ➔ Caso de uso                                    | Entidad                           |
| :------------------------------------- | :------------------------- | :-------------------------------------------------------- | :-------------------------------- |
| `POST /api/users/me/personal-profile`  | `CreatePersonalProfileDto` | `AddPersonalProfileService` ➔ `AddPersonalProfileUseCase` | `UserEntity.addPersonalProfile()` |
| `POST /api/users/me/business-profiles` | `CreateBusinessProfileDto` | `AddBusinessProfileService` ➔ `AddBusinessProfileUseCase` | `UserEntity.addBusinessProfile()` |

- Los servicios anticipan los conflictos antes de persistir: perfil personal ya existente, alias en uso, email o teléfono de empresa en uso (también entre las empresas del propio usuario).
- El repositorio escribe solo el subdocumento (`$set` del perfil personal, `$push` de la empresa), sin reescribir el resto del usuario.

| Situación                                            | Respuesta                                      | Código                           |
| :--------------------------------------------------- | :--------------------------------------------- | :------------------------------- |
| El usuario ya tiene perfil personal                  | **409** `USER-PERSONAL_PROFILE_ALREADY_EXISTS` | `USER-APP-SER-ADD_PERS_PROF-001` |
| El alias ya está en uso                              | **409** `USER-ALIAS_ALREADY_EXISTS`            | `USER-APP-SER-ADD_PERS_PROF-002` |
| El email o el teléfono de la empresa ya están en uso | **409** `USER-BUSINESS_ALREADY_EXISTS`         | `USER-APP-SER-ADD_BUSI_PROF-001` |
| Body inválido                                        | **400** (`ValidationPipe`)                     | —                                |

---

## 3. Cambiar el perfil activo

`PATCH /api/users/me/active-profile` ➔ `SwitchActiveProfileUseCase` ➔ `UserEntity.switchActiveProfile()`. Responde **200** con el usuario completo.

```json
{ "activeProfileType": "BUSINESS", "businessProfileId": "6745f0c2a1b2c3d4e5f60789" }
```

| `activeProfileType` | `businessProfileId` | Resultado                                                              |
| :------------------ | :------------------ | :--------------------------------------------------------------------- |
| `PERSONAL`          | omitido             | Activa el perfil personal. **Conserva** la empresa activa.             |
| `PERSONAL`          | informado           | **400**: cambiar al perfil personal no cambia la empresa activa.       |
| `BUSINESS`          | informado           | Activa esa empresa, que debe ser del usuario.                          |
| `BUSINESS`          | omitido             | Activa la última empresa activa o, si no hay ninguna, la primera.      |

- **No se puede activar lo que ya está activo** (409): `PERSONAL` ➔ `PERSONAL`, o `BUSINESS` ➔ la misma empresa (también si se omite `businessProfileId` y se resuelve a la empresa activa). Cambiar de una empresa a otra sí está permitido.
- `businessProfileId` con `PERSONAL` lo rechaza el DTO con `@IsAbsentWhen()` (`@common/application/decorators`), y la entidad lo vuelve a comprobar como invariante.
- Al conservar `activeBusinessProfileId` al pasar a `PERSONAL`, volver a `BUSINESS` sin indicar empresa recupera la última que usó.
- `businessProfileId` no se valida con un formato de base de datos (`ObjectId`) en el DTO: la entidad lo busca entre las empresas del usuario y, si no está, responde 404.
- Solo hay un caso de uso, así que el controlador lo llama directamente, sin servicio intermedio.

| Situación                                        | Respuesta                                 | Código                  |
| :----------------------------------------------- | :---------------------------------------- | :---------------------- |
| Activar `PERSONAL` sin tener perfil personal     | **404** `USER-PERSONAL_PROFILE_NOT_FOUND` | `USER-DOM-ENT-USER-004` |
| Activar `BUSINESS` sin empresas o con una ajena  | **404** `USER-BUSINESS_PROFILE_NOT_FOUND` | `USER-DOM-ENT-USER-005` |
| Activar `PERSONAL` indicando una empresa         | **400** `USER-INVALID_PROFILE_SWITCH`     | `USER-DOM-ENT-USER-006` |
| `PERSONAL` ya está activo                        | **409** `USER-PROFILE_ALREADY_ACTIVE`     | `USER-DOM-ENT-USER-007` |
| Esa empresa ya está activa                       | **409** `USER-PROFILE_ALREADY_ACTIVE`     | `USER-DOM-ENT-USER-008` |
| Body inválido (incluye `businessProfileId` con `PERSONAL`) | **400** (`ValidationPipe`)      | —                       |

---

## 4. Editar el perfil personal

`PATCH /api/users/me/personal-profile` ➔ `UpdatePersonalProfileService` ➔ `UpdatePersonalProfileUseCase` ➔ `UserEntity.updatePersonalProfile()` ➔ `PersonalProfileEntity.update()`. Responde **200** con el usuario completo.

Edición **parcial** con `UpdatePersonalProfileDto` (mismas validaciones que el alta):

| Campos                                                                        | Omitido     | `null` (o texto vacío)        |
| :---------------------------------------------------------------------------- | :---------- | :---------------------------- |
| `alias`, `headline`, `biography`, `avatar`                                    | Sin cambios | **Borra** el dato             |
| `address`, `specialties`, `danceStyles`, `availableToTravel`, `ownTransportation` | Sin cambios | **400** (son obligatorios) |

```json
{ "headline": "Coreógrafa de heels", "alias": null, "danceStyles": ["HEELS", "URBAN"] }
```

- `address`, `avatar` y las listas se **reemplazan completos** (no se fusionan con los valores anteriores).
- Los campos obligatorios usan `@ValidateIf((_, value) => value !== undefined)` en lugar de `@IsOptional()`, que trataría `null` como omitido y lo dejaría sin validar.
- `PersonalProfileEntity` es inmutable: `update()` devuelve un perfil nuevo que conserva `createdAt`. El repositorio lo guarda con `savePersonalProfile()` (`$set` del subdocumento), el mismo método que el alta.
- **Alias:** se consulta antes de guardar con la misma collation que el índice único. El propio alias no cuenta como duplicado, así que el usuario puede cambiar solo sus mayúsculas (`vale` ➔ `Vale`).

| Situación                                  | Respuesta                                 | Código                            |
| :----------------------------------------- | :---------------------------------------- | :-------------------------------- |
| El usuario no tiene perfil personal        | **404** `USER-PERSONAL_PROFILE_NOT_FOUND` | `USER-APP-SER-UPDA_PERS_PROF-001` |
| El alias es de otro usuario                | **409** `USER-ALIAS_ALREADY_EXISTS`       | `USER-APP-SER-UPDA_PERS_PROF-002` |
| Body sin ningún campo                      | **400** `USER-NOTHING_TO_UPDATE`          | `USER-DOM-ENT-USER-009`           |
| Body inválido (incluye `null` en un campo obligatorio) | **400** (`ValidationPipe`)    | —                                 |

---

**Main menu:** [README.md](../../README.md) || **Previous:** [Autenticación (JWT + Passport)](./authentication.md) || **Next:** [Diagramas ER](../architecture/entity-relationship-diagram.md)
