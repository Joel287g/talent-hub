# 📖 Glosario de Términos Técnicos

Este glosario define los conceptos clave, patrones y terminología utilizados en la Arquitectura de **Talent Hub**. Su objetivo es mantener un lenguaje ubicuo (Ubiquitous Language) estandarizado para todo el equipo de desarrollo.

---

## A

- **Adaptador (Adapter):** Es la implementación técnica y concreta de un Puerto. Su trabajo es interactuar con el mundo exterior.
  - _Ejemplo:_ `MongoDBUsersRepository` es un adaptador que conecta nuestro sistema con MongoDB.
- **Arquitectura Hexagonal (Puertos y Adaptadores):** Patrón de diseño de software que busca aislar el núcleo de negocio (Dominio) de las tecnologías externas (Bases de datos, HTTP, UI) mediante el uso de interfaces (Puertos).

## B

- **BaseException:** Clase base de error que hereda nativamente de `Error` en JavaScript. Mantiene la capa de Dominio 100% pura y agnóstica a NestJS o protocolos HTTP, encapsulando el `statusCode`, `code`, `cause` y `metadata`.

## C

- **Caso de Uso (Use Case / Interactor):** Clase que pertenece a la capa de Aplicación. Su única responsabilidad es orquestar un flujo específico del sistema. Recibe peticiones, delega validaciones a la Entidad y ordena al Repositorio guardar o buscar. **No contiene lógica de negocio pura.**

## D

- **DDD (Domain-Driven Design):** Enfoque de desarrollo de software que centra su arquitectura y diseño en las reglas exactas y el lenguaje del negocio en el mundo real.
- **DTO (Data Transfer Object):** Objeto "tonto" (sin comportamiento ni lógica) utilizado exclusivamente para transportar datos desde la petición HTTP (Controller) hacia el Caso de Uso. Valida formatos superficiales (ej. que un campo sea string).

## E

- **Entidad (Entity):** Objeto de la capa de Dominio que posee una **identidad única** (un ID). Encapsula el estado de un concepto de negocio y las reglas que dictan cómo puede mutar ese estado a lo largo del tiempo.
  - _Nota:_ Evitamos el "Modelo Anémico" (entidades que solo tienen getters/setters y cero lógica). Usamos un método `static create()` (Factory) para asegurar su integridad al nacer.
- **ERROR_GENERATOR:** Marcador / Snippet utilizado por la extensión de VS Code [Error codes generator](https://marketplace.visualstudio.com/items?itemName=Joel287g.error-codes-generator). Al ejecutar la extensión, este string se reemplaza automáticamente por un código único secuencial basado en la ruta del archivo (ej. `SRC_USERS_DOMAIN_001`).
- **Exception Filter (Filtro de Excepciones):** Capa de la Infraestructura en NestJS encargada de atrapar errores (ej. un error de duplicidad en Mongo o un error personalizado del dominio) antes de que lleguen al cliente, mapeándolos a una respuesta HTTP estandarizada.

## F

- **FilterException:** Interfaz definida en la capa de Infraestructura compartida que dicta el contrato de respuesta JSON estricto y uniforme para cualquier excepción capturada en la aplicación.
- **Fuga de Infraestructura (Infrastructure Leak):** Antipatrón arquitectónico que ocurre cuando detalles técnicos de librerías externas (como usar `Types.ObjectId` de Mongoose dentro de un DTO o Caso de Uso) contaminan el Dominio o la capa de Aplicación. Rompe por completo el aislamiento de la Arquitectura Hexagonal.

## I

- **Interceptor:** Componente de la capa de Infraestructura (nativo en NestJS) que envuelve el flujo de la petición HTTP. Permite ejecutar lógica antes y después de que la petición alcance el Caso de Uso (Controller). Es el lugar ideal para aislar lógica transversal (cross-cutting concerns) como telemetría, logging o mutación de respuestas, manteniendo los Casos de Uso limpios.
- **Inyección de Dependencias (DI):** Patrón de diseño en el que las clases no crean a sus propias dependencias (ej. no hacen `new Repository()`), sino que las reciben por el constructor. NestJS se encarga de inyectarlas usando un contenedor IoC (Inversion of Control).

## M

- **Magic Strings (Cadenas Mágicas):** Antipatrón que consiste en escribir cadenas de texto literales en el código (ej. `'SnifferInterceptor'`) en lugar de utilizar variables, constantes dinámicas (como `SnifferInterceptor.name`) o enums. Generan un código frágil, propenso a errores de tipeo y difícil de refactorizar.
- **Mapper (Mapeador):** Clase utilitaria de la capa de Infraestructura que traduce los datos entre dos mundos.
  - `toDomain`: Convierte un documento de MongoDB en una `Entity` pura.
  - `toPersistence`: Convierte una `Entity` pura en un formato que Mongoose entienda.

## P

- **Primitive Obsession (Obsesión por Primitivos):** Antipatrón de diseño donde se utilizan tipos primitivos (`string`, `number`) para representar conceptos de negocio complejos (ej. usar un `string` para un UID en lugar de una clase propia).
- **Puerto (Port):** Interfaz definida en la capa de Dominio que dicta un contrato estricto de lo que el sistema necesita hacer (ej. `UsersRepository`), sin importar cómo se implemente técnicamente.

## O

- **Orquestar (Orquestación):** Es la acción exclusiva de los Casos de Uso (Capa de Aplicación). Significa coordinar el flujo de información entre la entrada del usuario, las Entidades de Dominio y los Puertos (Repositorios), sin ejecutar lógica de negocio pura ni tocar infraestructura directamente. Es el "director de orquesta" del sistema.

## S

- **Symbol:** Tipo de dato primitivo en JavaScript que garantiza un valor único e irrepetible en memoria. Lo utilizamos como Token de inyección en NestJS para poder inyectar Interfaces puras sin colisiones en el contenedor de dependencias.

## T

- **Telemetría (Telemetry):** El proceso de recopilación automatizada de datos sobre el comportamiento interno del sistema en tiempo real (ej. tiempos de procesamiento HTTP, IPs, códigos de estado, cabeceras). En nuestro proyecto, está aislada y gestionada por el `SnifferModule`.
- **Thread-Safe (Seguro contra concurrencia):** Diseño de código que garantiza que el sistema funcionará correctamente cuando múltiples usuarios o hilos ejecuten el mismo proceso simultáneamente. Es crucial en Node.js al inyectar dependencias Singleton (como el `LoggerService`) para evitar que el estado o el contexto de la petición del Usuario A sobrescriba accidentalmente el del Usuario B.

## V

- **Value Object (Objeto de Valor):** Objeto inmutable de la capa de Dominio que representa una característica descriptiva. **No tiene identidad (ID)** y se distingue únicamente por su valor. Se autovalida al instanciarse.
  - _Ejemplo:_ `UidValueObject`, `Phone`. Si dos UIDs tienen el mismo texto, son exactamente el mismo objeto de valor para el negocio.

---

---

**Main menu:** [README.md](../../README.md) || **Next:** [Estándares de Arquitectura Hexagonal](./hexagonal-standards.md)
