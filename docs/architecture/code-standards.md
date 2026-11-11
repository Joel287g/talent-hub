La mejor estrategia es **unificar ambos documentos** en un único fichero (`docs/architecture/code-standards.md`) para evitar redundancias y mantener una única fuente de verdad para los desarrolladores.

El primer archivo aporta el sistema avanzado de validación de barriles y rutas, mientras que el segundo contiene reglas esenciales de formateo y el uso de `BetterComments` que no deben perderse.

Aquí tienes el documento unificado y estructurado de forma secuencial:

```markdown
# 📐 Estándares de Código y Formato

Este documento define las reglas estrictas de estilo, formato, nomenclatura, organización de importaciones y convenciones de comentarios que deben seguirse en todo el código fuente del proyecto **Talent Hub**. Todas las reglas de importación documentadas aquí son auditadas automáticamente antes de cada compilación o inicio en desarrollo.

---

## 1. Convenciones de Nomenclatura

Para mantener una consistencia clara en la mutabilidad, tipado y propósito de los datos en todo el proyecto:

| Elemento | Convención | Ejemplo |
| :--- | :--- | :--- |
| **Clases, Interfaces, Types y Enums** | `PascalCase` | `DomainExceptionFilter`, `BaseErrorsInterface` |
| **Variables mutables (`let`) y propiedades** | `camelCase` | `totalErrors`, `relativeFilePath`, `currentUserCount` |
| **Constantes inmutables de ámbito global o módulo** | `SNAKE_CASE` (Mayúsculas) | `MAX_RETRIES`, `SRC_DIR`, `ALIAS_PREFIXES` |
| **Nombres de archivos físicos y carpetas** | `kebab-case` | `domain-exception.filter.ts`, `check-imports.ts` |
| **Tokens de Inyección NestJS (Symbols)** | `SNAKE_CASE` (Mayúsculas) | `USERS_REPOSITORY = Symbol('USERS_REPOSITORY')` |

---

## 2. Convenciones de Comentarios (`BetterComments`)

Para estandarizar la documentación visual y el rastreo en el editor, se utiliza obligatoriamente la extensión **BetterComments** en Visual Studio Code. Se deben emplear los siguientes prefijos en los comentarios:

- `//?` : Para notas informativas, descripción de secciones o etiquetado de bloques de imports.
- `//*` : Para destacar puntos clave, lógica importante o explicaciones de negocio.
- `//!` : Para advertencias críticas, alertas de seguridad o código temporal/bloqueante.
- `//TODO:` : Para tareas pendientes o futuras refactorizaciones.

---

## 3. Reglas de Organización e Importaciones

Para mantener un código limpio y prevenir errores de referencias circulares, todos los ficheros TypeScript deben clasificar y ordenar sus importaciones respetando las siguientes directrices.

### A. Orden de Bloques y Comentarios
Las importaciones se dividen en dos bloques delimitados por `BetterComments`:

```typescript
//? Imports de codigo
import fs from 'fs';
import path from 'path';

import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

//? Imports de usuario
import { BaseException } from '@common/domain/exceptions';
import { FilterException } from '@common/infrastructure/interfaces';

```

1. **`//? Imports de codigo`**: Contiene dependencias nativas de Node.js (ej. `fs`, `path`) separadas por un salto de línea de las librerías externas o frameworks (ej. `@nestjs/common`, `mongoose`).
2. **`//? Imports de usuario`**: Contiene exclusivamente código interno del proyecto (`src/`).

### B. Uso Estricto de Rutas y Archivos de Barril (`index.ts`)

Queda **estrictamente prohibido el uso de rutas relativas** (`./` o `../`). Se aplicará la siguiente matriz para garantizar el encapsulamiento:

| Ámbito de la Importación | Archivo Destino | Sintaxis Requerida | Sintaxis Prohibida | Razón Técnica |
| --- | --- | --- | --- | --- |
| **Consumo Inter-carpeta** *(Desde otra carpeta o módulo)* | Archivo de barril (`index.ts`) | `@common/domain/exceptions` | `@common/domain/exceptions/base-exception` | Protege el encapsulamiento. Prohíbe los *deep imports* desde el exterior. |
| **Consumo Intra-carpeta** *(Dentro de la misma carpeta)* | Fichero hermano directo | `@common/domain/exceptions/base-exception` | `@common/domain/exceptions` | Previene fallos por dependencias circulares al evitar cargar el `index.ts` local. |
| **Módulos NestJS** | Archivo `*.module.ts` | `@users/users.module` | N/A | Los módulos no utilizan barriles. Se importan directo con la ruta absoluta del fichero. |

### C. Excepciones Autorizadas

Quedan exentos de la validación estricta de barriles:

* Archivos de configuración principal (ej. `app.module`, `package.json`).
* Re-exportaciones declarativas internas en archivos de barril (`index.ts`).
* Archivos de pruebas (`*.spec.ts`).
* El script de validación (`scripts/check-imports.script.ts`).

---

## 4. Automatización y Auditoría (`scripts/check-imports.ts`)

El cumplimiento de estas reglas es auditado automáticamente antes de compilar o arrancar el servidor mediante un analizador de sintaxis estático.

### Integración en `package.json`

```json
{
  "scripts": {
    "check:imports": "npx tsx src/scripts/check-imports.script.ts",
    "start:dev": "npm run check:imports && cross-env NODE_ENV=development nest start --watch",
    "build": "npm run check:imports && nest build"
  }
}

```

Si el script detecta rutas relativas, *deep imports* hacia otras carpetas o referencias circulares locales, interrumpirá el proceso con un código `process.exit(1)` listando los archivos infractores.

---

---

**Main menu:** [README.md](../../README.md) || **Previous:** [Manejo de Excepciones y Logging](../guides/exception-handling.md)