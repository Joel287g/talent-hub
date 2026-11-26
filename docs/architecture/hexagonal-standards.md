# 🏛️ Estándares de Arquitectura Hexagonal

Este documento define las reglas arquitectónicas y convenciones de diseño para el desarrollo de módulos en el backend. Toda nueva funcionalidad debe adherirse estrictamente a estos principios para garantizar la escalabilidad, el desacoplamiento y la mantenibilidad del sistema.

## 1. Filosofía Principal

Implementamos una **Arquitectura Hexagonal estricta** (Puertos y Adaptadores) apoyada en principios de Domain-Driven Design (DDD).
El objetivo principal es que nuestra Lógica de Negocio (Dominio) sea completamente agnóstica a cualquier detalle técnico externo (Frameworks, Bases de Datos, Protocolos HTTP).

## 2. Estructura de Capas por Módulo

Cada módulo (ej. `users`, `academies`) debe respetar la siguiente jerarquía de carpetas:

### 🟩 Capa de Dominio (`/domain`)

Es el núcleo de la aplicación. **NO puede importar nada de `application` ni de `infrastructure`.**

- **`entities/`**: Modelos ricos que encapsulan el estado y las reglas de negocio.
- **`repositories/`**: Interfaces (Puertos) que dictan cómo interactuar con los datos.
- **`enums/`**: Enumeraciones estrictamente ligadas a conceptos de negocio (ej. `UserStatus`).
- **`value-objects/`**: (Opcional) Clases inmutables que autovalidan tipos primitivos (ej. `UidValueObject`).

### 🟦 Capa de Aplicación (`/application`)

Contiene los casos de uso del sistema. Define "qué" hace la aplicación, orquestando el Dominio y la Infraestructura.

- **`use-cases/`**: Clases con un único método (`execute`). No contienen lógica de negocio pura, solo orquestan.
- **`dtos/`**: Objetos de transferencia de datos para la entrada a los casos de uso.
  - Solo para datos que llegan por HTTP: sus decoradores (`class-validator`) únicamente se ejecutan en el `ValidationPipe` del Controller.
  - Los datos que construye el propio código (ej. la telemetría del `SnifferMiddleware` o los registros de `LoggerService`) no usan DTOs, sino los tipos `Create*Type` de la entidad (ej. `CreateSnifferType`, `CreateLoggerType`). Los valida TypeScript al compilar y el schema de Mongoose al guardar.

### 🟥 Capa de Infraestructura (`/infrastructure`)

Contiene todos los detalles técnicos y de framework. Es la única capa que conoce sobre NestJS, MongoDB, HTTP, etc.

- **`controllers/`**: Puntos de entrada HTTP (Rutas, Swagger).
- **`persistence/`**:
  - `schemas/`: Definición de la estructura de base de datos (Mongoose).
  - `mappers/`: Traductores que convierten Documentos de BD a Entidades puras y viceversa (`toDomain` / `toPersistence`), y Entidades en respuestas HTTP (`toResponse`).
  - `mongo-*.repository.ts`: Adaptadores concretos que implementan los puertos del dominio.

## 3. Reglas de Oro del Proyecto

### Regla 1: Inyección de Dependencias por Símbolos

Debido a que las Interfaces de TypeScript desaparecen en tiempo de ejecución, todos los repositorios deben inyectarse utilizando el patrón `Symbol`.

```typescript
// ✅ CORRECTO: En el dominio
export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');
export interface UsersRepository { ... }

// ✅ CORRECTO: En el caso de uso
constructor(@Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository) {}
```

### Regla 2: Entidades Ricas (Factory Pattern)

Las Entidades no deben ser "anémicas" (simples contenedores de datos). El estado interno debe estar protegido y la creación debe realizarse mediante un método de fábrica estático (static create).

```typescript
// ✅ CORRECTO: Creación controlada
export class UserEntity {
  private readonly _id: string | null;

  public static create(payload: CreateUserDto): UserEntity {
    // Validaciones y asignación de valores por defecto aquí
    return new UserEntity({ ...payload });
  }
}
```

### Regla 3: Casos de Uso Limpios (Sin Try/Catch)

Los Casos de Uso NO deben capturar errores de base de datos ni manejar excepciones HTTP. Deben orquestar la entidad y el repositorio. Los errores técnicos se delegan a los Exception Filters globales de Infraestructura.

```typescript
// ✅ CORRECTO: Caso de uso limpio
async execute(payload: CreateUserDto): Promise<UserEntity> {
  const ENTITY = UserEntity.create(payload);
  return await this.usersRepository.create(ENTITY);
}
```

### Regla 4: El Módulo common también tiene capas

Cualquier código transversal o compartido `(src/common)` debe respetar la separación hexagonal:

- **common/domain/**: Interfaces o enums de negocio puro `(ej. phone.interface.ts)`.
- **common/infrastructure/**: Enums de base de datos `(collections-name.enum.ts)`, decoradores HTTP, Exception Filters, y utilidades técnicas. Prohibido mezclar conceptos técnicos con lógica de negocio en la misma carpeta.

## 4. Flujo de Petición (Request Lifecycle)

- El cliente envía un HTTP Request.
- El Controller (Infraestructura) recibe la petición, la valida con el DTO (Aplicación).
- El Controller llama al Use Case (Aplicación).
- El Use Case invoca a la Entity (Dominio) mediante su método create().
- El Use Case envía la Entidad al Repository Interface (Puerto de Dominio).
- El Mongo Repository (Adaptador de Infraestructura) intercepta la llamada.
- El Adaptador usa el Mapper para convertir la Entity en un Schema de Mongo y guarda en BD.
- El Adaptador convierte el documento guardado de nuevo en Entity (`toDomain`) y la retorna en cascada hasta el Controller.
- El Controller transforma la Entity con `Mapper.toResponse()` y responde al cliente. Nunca devuelve la Entity directamente, porque se serializaría con sus propiedades privadas (`_id`, `_name`, ...).

---

### Regla 5: Estándar Estricto de Importaciones y Archivos de Barril

Para garantizar la integridad del empaquetado y prevenir fallos por dependencias circulares en tiempo de ejecución:

- **Rutas Absolutas Obligatorias:** Queda prohibido el uso de rutas relativas (`./` o `../`) en todo el módulo. Todos los imports deben utilizar los alias de `tsconfig.json` (`@common`, `@users`, etc.).
- **Consumo Inter-carpeta:** Se debe consumir obligatoriamente el archivo de barril (`index.ts`) mediante su alias absoluto (ej. `@common/domain/exceptions`). Los _deep imports_ directos a subficheros están prohibidos desde fuera de la carpeta.
- **Consumo Intra-carpeta:** Está prohibido consumir el `index.ts` de la propia carpeta para evitar referencias circulares. Se debe importar el fichero hermano objetivo directamente con su ruta absoluta completa (ej. `@common/domain/exceptions/base-exception`).
- **Módulos NestJS:** Los archivos `*.module.ts` no utilizan barriles, por lo que su importación directa mediante alias absoluto es válida.

---

### Regla 6: Regla de Dependencia Unidireccional y Blindaje de Capas

El flujo de dependencias entre capas es estrictamente unidireccional y siempre apunta **de afuera hacia adentro**:

$$\text{infrastructure} \longrightarrow \text{application} \longrightarrow \text{domain}$$

Ninguna capa interior puede conocer, importar ni acoplarse a una capa exterior ni a detalles técnicos de frameworks. Para garantizarlo, se aplica la siguiente matriz de seguridad arquitectónica:

| Capa Origen                            | Dependencias Internas Permitidas                                                       | Dependencias Internas Prohibidas                                                                                     | Librerías Externas Prohibidas                                                                                        |
| :------------------------------------- | :------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| **`domain/`** _(Núcleo)_               | Solo elementos de `domain/` (del propio módulo o `@common/domain`).                    | `application/`, `infrastructure/`, archivos `*.module.ts`.                                                           | `@nestjs/*`, `mongoose`, `express`, `fastify`, `class-validator`, `class-transformer`, `rxjs`, `joi`, `nestjs-i18n`. |
| **`application/`** _(Orquestación)_    | `domain/` y `application/` (del propio módulo o `@common`).                            | `infrastructure/` (schemas, mappers, repositorios concretos, guards, filters), archivos `*.module.ts`.               | `@nestjs/mongoose`, `@nestjs/platform-*`, `mongoose`, `express`, `fastify`.                                          |
| **`infrastructure/`** _(Adaptadores)_  | `infrastructure/`, `application/` y `domain/` (propios y de `@common`).                | Capa `infrastructure/` privada de otro módulo de negocio (ej. `@users/infrastructure` desde `@jobs/infrastructure`). | —                                                                                                                    |
| **`*.module.ts`** _(Composition Root)_ | `domain/`, `application/` e `infrastructure/` para ensamblar `Symbol` con adaptadores. | —                                                                                                                    | —                                                                                                                    |

- **Auditoría Automatizada (`src/scripts/check-hexagonal.script.ts`):** El cumplimiento de esta matriz se verifica estáticamente mediante `npm run check:hexagonal` (integrado en `npm run check:arch`), que debe ejecutarse manualmente al terminar cualquier `fix` o `feature` y antes de subir código. Ante cualquier fuga entre capas o importación de librerías prohibidas, el proceso aborta con `process.exit(1)`.

---

**Main menu:** [README.md](../../README.md) || **Previous:** [Glossario de Términos](./glossary.md) || **Next:** [Manejo de Excepciones y Logging](../guides/exception-handling.md)
