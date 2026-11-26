# 🛡️ Guía de Manejo de Excepciones y Filtros Globales

Este documento detalla la arquitectura, el diseño y el funcionamiento del sistema de manejo de excepciones en **Talent Hub**. Los filtros globales actúan como la última línea de defensa en la capa de infraestructura, encargándose de capturar, formatear y devolver respuestas HTTP seguras y estandarizadas al cliente.

---

## 1. Ubicación Arquitectónica

Siguiendo los principios de la **Arquitectura Hexagonal**, el manejo de protocolos web y errores de bases de datos externas no pertenece al núcleo de negocio (Dominio). Por lo tanto, todos los filtros residen en la capa de infraestructura compartida:

```text
src/
 └── common/
     ├── domain/
     │   └── exceptions/
     │       ├── base-exception.ts
     │       ├── base-errors.interface.ts
     │       ├── base-errors.abstract.ts
     │       ├── common-errors.exceptions.ts
     │       └── index.ts
     └── infrastructure/
         ├── filters/
         │   ├── domain-exception.filter.ts
         │   ├── general-exception.filter.ts
         │   ├── http-exception.filter.ts
         │   ├── mongoose-exception.filter.ts
         │   └── index.ts
         └── interfaces/
             ├── filters-exceptions.interfaces.ts
             └── index.ts
```

### 2. Los Cuatro Pilares de Excepciones

El sistema implementa cuatro filtros registrados globalmente mediante el token `APP_FILTER` en el `MiddlewaresModule` (`src/common/infrastructure/middlewares.module.ts`). Cada filtro atrapa un tipo de error concreto y el `GeneralExceptionsFilter` actúa como red de seguridad para todo lo demás:

#### A. Domain Exception Filter (`@Catch(BaseException)`)

- **Propósito:** Atrapa los errores de negocio lanzados desde el Dominio o los Casos de Uso mediante los catálogos de errores (`BaseException`, ver sección 5).
- **Comportamiento:** Usa el `statusCode` definido en la propia excepción (por defecto **500**) y adjunta en `additionalException` el `code` único del error y su `metadata` (o `null`). De esta forma el Dominio permanece agnóstico a HTTP y es la Infraestructura quien traduce el error a la respuesta.

#### B. General Exceptions Filter (`@Catch()`)

- **Propósito:** Funciona como un "cajón de sastre". Atrapa cualquier error no controlado o imprevisto que ocurra en la aplicación (Errores 500).
- **Comportamiento:** Extrae de forma segura el mensaje y el nombre del error usando fallbacks por defecto, evitando que la aplicación falle al intentar responder al cliente.

#### C. HTTP Exception Filter (`@Catch(HttpException)`)

- **Propósito:** Atrapa todas las excepciones controladas del framework o lanzadas explícitamente (ej. BadRequestException, UnauthorizedException, NotFoundException).
- **Comportamiento:** Preserva el código de estado HTTP original (400, 401, 404, etc.) y extrae propiedades adicionales (como los mensajes de error del ValidationPipe de NestJS) bajo la propiedad additionalException.

#### D. Mongoose Exception Filter (`@Catch(mongo.MongoServerError)`)

- **Propósito:** Intercepta los errores nativos lanzados por el driver de MongoDB.
- **Comportamiento:** Traduce códigos crudos de base de datos a códigos de estado HTTP semánticamente correctos:
  - **11000 / 11001** (Duplicidad de claves únicas) ➔ **409 Conflict**. Solo debería ocurrir con peticiones simultáneas, porque la unicidad se comprueba antes (ver sección 6).
  - **2** (No encontrado) ➔ **404 Not Found**.
  - **11007** ➔ **422 Unprocessable Entity**.
  - Cualquier otro código ➔ **500 Internal Server Error**.

### 3. Seguridad y Entornos (Environment-based Stack)

Por motivos de seguridad, el `stack trace` y el `cause` jamás se exponen en entornos de producción, previniendo la fuga de información sobre la estructura interna del servidor.

Los filtros evalúan el entorno de ejecución (`process.env.NODE_ENV`):

- **En Producción (`production`):** La respuesta contiene únicamente la información limpia y segura para el cliente.
- **En Desarrollo (`development / otros`):** Se adjuntan automáticamente las propiedades stack y cause al objeto de respuesta para facilitar la depuración inmediata.

### 4. Contrato de Respuesta (`FilterException`)

Todas las respuestas de error del backend devuelven una estructura JSON uniforme:

- **Ejemplo 1:** Error de Duplicidad en MongoDB (`MongooseExceptionFilter`)

```json
{
  "message": "E11000 duplicate key error collection: talent-dev.users index: uid_1 dup key: { uid: \"string\" }",
  "name": "MongoServerError",
  "statusCode": 409,
  "method": "POST",
  "url": "/api/users/create",
  "timestamp": "2026-09-16T21:49:19.468Z",
  "additionalException": {
    "errorResponse": {
      "code": 11000,
      "keyValue": {
        "uid": "string"
      }
    },
    "code": 11000
  },
  "stack": "MongoServerError: E11000 duplicate key error collection..."
}
```

- **Ejemplo 2:** Error de Validación de DTO (`HttpExceptionFilter`)

```json
{
  "message": "Bad Request Exception",
  "name": "BadRequestException",
  "statusCode": 400,
  "method": "POST",
  "url": "/api/users/create",
  "timestamp": "2026-09-16T21:50:17.521Z",
  "additionalException": {
    "response": {
      "message": ["uid should not be empty"],
      "error": "Bad Request",
      "statusCode": 400
    },
    "status": 400
  },
  "stack": "BadRequestException: Bad Request Exception..."
}
```

---

### 5. Catálogo de Errores por Módulo (`BaseErrors`)
Para evitar el uso directo de excepciones de NestJS en los Casos de Uso (preveniendo la Fuga de Infraestructura), los errores se instancian extendiendo la clase abstracta `BaseErrors` (`src/common/domain/exceptions/base-errors.abstract.ts`):

- Los métodos heredados de `BaseErrors` (como `notFoundException` o `forbiddenException`) asignan automáticamente el código de estado HTTP semántico, un mensaje de `BaseErrorsEnum` y un código único por defecto (ej. `COMM-DOM-EXC-BASE_ERRO-004`). Todos aceptan un `cause` opcional.
- Cada módulo define su propio catálogo en `domain/exceptions/`, con sus mensajes en un enum dentro de `domain/exceptions/enums/`. Ejemplo del módulo de usuarios:

```text
src/users/domain/exceptions/
 ├── enums/
 │   ├── user-errors.enum.ts      # UserErrorsEnum (USER-NOT_FOUND, USER-ALREADY_EXISTS, USER-ALIAS_ALREADY_EXISTS, ...)
 │   └── index.ts
 ├── user-errors.exceptions.ts    # UserErrorsFactory extends BaseErrors
 └── index.ts                     # export { UserErrors }
```

```typescript
//? Imports de usuario
import { BaseException, BaseErrors } from '@common/domain/exceptions';

import { UserErrorsEnum } from '@users/domain/exceptions/enums';

class UserErrorsFactory extends BaseErrors {
  public notFound(code: string = 'USER-DOM-EXC-USER_ERRO-001'): BaseException<UserErrorsEnum> {
    return new BaseException<UserErrorsEnum>(UserErrorsEnum.NOT_FOUND, 404, code);
  }
}

//* Solo se exporta la instancia, nunca la clase
export const UserErrors = new UserErrorsFactory();
```

- Cada catálogo pertenece a un único contexto: los errores de autenticación (`AUTH-INVALID_TOKEN`, `AUTH-INVALID_SESSION`, `AUTH-INACTIVE_USER`) viven en `AuthErrors` (`src/auth/domain/exceptions/`), separados de los de usuario (ver [Guía de Autenticación](./authentication.md)).
- Los errores transversales que no pertenecen a ningún módulo (ej. decoradores de `common`) usan la instancia `CommonErrors` (`src/common/domain/exceptions/common-errors.exceptions.ts`), que hereda todos los métodos de `BaseErrors` (ej. `throw CommonErrors.internalServerErrorException('COMM-INF-DEC-GET_USER-001')`).
- Los códigos únicos (`USER-DOM-EXC-USER_ERRO-001`) se generan con la extensión [Error codes generator](https://marketplace.visualstudio.com/items?itemName=Joel287g.error-codes-generator) a partir del marcador `'ERROR_GENERATOR'` (ver [Glosario](../architecture/glossary.md)).
- Al lanzar un error se pasa el código único del punto exacto donde ocurre, para poder rastrearlo (ej. `throw UserErrors.notFound('USER-APP-USE-FIND_USER_BY_UID-001')`). Si se omite, se usa el código por defecto del catálogo.
- Los Casos de Uso, Servicios y Entidades lanzan estos errores directamente sin necesidad de bloques `try/catch`, y el `DomainExceptionFilter` los traduce a la respuesta HTTP.

---

### 6. Premisa: Anticipar los Errores

Todo error previsible se ataja **antes** de que lo lance la base de datos o el servidor, y se responde con un error controlado:

- **Formato de entrada** (campos ausentes, tipos, longitudes): lo rechaza el DTO con un **400**.
  - Las restricciones del DTO (longitudes, mínimos, obligatoriedad) deben coincidir con las del schema de Mongoose.
  - Los textos llevan `@Trim()` (`@common/application/decorators`), para que un valor con solo espacios no supere `@IsNotEmpty()`.
  - Los objetos anidados llevan `@IsObject()`, y además `@IsDefined()` si son obligatorios: `@ValidateNested()` por sí solo acepta `undefined` y `null`.
  - Un `@ValidateIf()` nunca debe dejar sin validar un dato que llegue informado.
  - Los textos libres llevan `@MaxLength()` con los límites de `TEXT_MAX_LENGTH` (`@common/application/constants`) y `@IsSafeText()`, que rechaza `<`, `>` y los caracteres invisibles.
  - Los textos opcionales usan `@Trim({ emptyToNull: true })`: un texto vacío equivale a no informarlo (`null`).
  - Los datos que identifican un registro se validan con un formato único para que la consulta previa detecte los duplicados (ej. `code` siempre con `+`, `number` solo dígitos, códigos ISO en mayúsculas).
- **Unicidad** (`uid`, `email`, `phone`, `alias`, contacto de empresa): se consulta mediante un Caso de Uso antes de persistir y se lanza un **409** del catálogo del módulo (ej. `UserErrors.aliasAlreadyExists()`).
- **Coherencia:** la consulta previa debe comparar exactamente los mismos campos que el índice único. Ej: el teléfono se compara siempre completo (`cca2` + `code` + `number`), porque varios países comparten prefijo.

> //! Los índices únicos y el `MongooseExceptionFilter` se mantienen como última defensa: dos peticiones simultáneas pueden superar a la vez la consulta previa. En ese caso el E11000 también se responde con un **409**.

---

---

**Main menu:** [README.md](../../README.md) || **Previous:** [Estándares de Arquitectura Hexagonal](../architecture/hexagonal-standards.md) || **Next:** [Estándares de Código y Formato](../architecture/code-standards.md) 
