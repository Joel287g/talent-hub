# 🛡️ Guía de Manejo de Excepciones y Filtros Globales

Este documento detalla la arquitectura, el diseño y el funcionamiento del sistema de manejo de excepciones en **Talent Hub**. Los filtros globales actúan como la última línea de defensa en la capa de infraestructura, encargándose de capturar, formatear y devolver respuestas HTTP seguras y estandarizadas al cliente.

---

## 1. Ubicación Arquitectónica

Siguiendo los principios de la **Arquitectura Hexagonal**, el manejo de protocolos web y errores de bases de datos externas no pertenece al núcleo de negocio (Dominio). Por lo tanto, todos los filtros residen en la capa de infraestructura compartida:

```text
src/
 └── common/
     └── infrastructure/
         ├── filters/
         │   ├── general-exception.filter.ts
         │   ├── http-exception.filter.ts
         │   ├── mongoose-exception.filter.ts
         │   └── index.ts
         └── interfaces/
             └── filter-exception.interface.ts
```

### 2. Los Tres Pilares de Excepciones

El sistema implementa tres filtros registrados globalmente mediante el token APP_FILTER en el MiddlewaresModule, evaluados en orden jerárquico:

#### A. General Exceptions Filter (`@Catch()`)

- **Propósito:** Funciona como un "cajón de sastre". Atrapa cualquier error no controlado o imprevisto que ocurra en la aplicación (Errores 500).
- **Comportamiento:** Extrae de forma segura el mensaje y el nombre del error usando fallbacks por defecto, evitando que la aplicación falle al intentar responder al cliente.

#### B. HTTP Exception Filter (`@Catch(HttpException)`)

- **Propósito:** Atrapa todas las excepciones controladas del framework o lanzadas explícitamente (ej. BadRequestException, UnauthorizedException, NotFoundException).
- **Comportamiento:** Preserva el código de estado HTTP original (400, 401, 404, etc.) y extrae propiedades adicionales (como los mensajes de error del ValidationPipe de NestJS) bajo la propiedad additionalException.

#### C. Mongoose Exception Filter (`@Catch(mongo.MongoServerError)`)

- **Propósito:** Intercepta los errores nativos lanzados por el driver de MongoDB.
- **Comportamiento:** Traduce códigos crudos de base de datos a códigos de estado HTTP semánticamente correctos:
  - **11000 / 11001** (Duplicidad de claves únicas) ➔ **400 Bad Request** (o **409 Conflict**).
  - **11002** (Violación de restricciones) ➔ **400 Bad Request**.
  - **2** (No encontrado) ➔ **404 Not Found**.
  - **11007** ➔ **422 Unprocessable Entity**.

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
  "statusCode": 400,
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

---

**Main menu:** [README.md](../../README.md) || **Previous:** [Estándares de Arquitectura Hexagonal](../architecture/hexagonal-standards.md)
