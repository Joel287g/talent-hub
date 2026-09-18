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

### 🟥 Capa de Infraestructura (`/infrastructure`)

Contiene todos los detalles técnicos y de framework. Es la única capa que conoce sobre NestJS, MongoDB, HTTP, etc.

- **`controllers/`**: Puntos de entrada HTTP (Rutas, Swagger).
- **`persistence/`**:
  - `schemas/`: Definición de la estructura de base de datos (Mongoose).
  - `mappers/`: Traductores que convierten Documentos de BD a Entidades puras y viceversa.
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
- Retorna el resultado en cascada hacia el cliente.

---

---

**Main menu:** [README.md](../../README.md) || **Previous:** [Glossario de Términos](./glossary.md) || **Next:** [Manejo de Excepciones y Logging](../guides/exception-handling.md)
