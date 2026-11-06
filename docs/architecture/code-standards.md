# 📐 Estándares de Código y Formato

Este documento define las reglas estrictas de estilo, formato, organización de importaciones y convenciones de comentarios que deben seguirse en todo el código fuente del proyecto **Talent Hub**.

---

## 1. Reglas de Organización de Imports

Para mantener un código limpio, legible y predecible, todos los ficheros TypeScript deben ordenar sus importaciones de forma estricta respetando la siguiente estructura y bloques:

### A. Orden de Bloques y Comentarios
1. **Imports de código interno/especial** (si aplica) deben precederse obligatoriamente con el comentario de código: `//? Imports de codigo`.
2. Debajo se colocan los **imports de dependencias externas y de Node.js**, precedidos o separados correctamente.
   - Primero se sitúan los **imports nativos de Node.js** (ej. `path`, `fs`).
   - Se dejan **dos saltos de línea** (`\n\n`).
   - A continuación se sitúan los **imports de frameworks y librerías externas** (ej. NestJS, Mongoose).
3. Seguido de un salto de línea, se colocan todos los **imports del proyecto**.

### B. Uso Estricto de Rutas Absolutas
- Es una regla **estricta y obligatoria** utilizar siempre rutas absolutas configuradas en el [tsconfig.json](../../tsconfig.json) (por ejemplo, usando los alias definidos como `@common/...`, `@users/...`, etc.) para todos los imports internos del proyecto.
- Queda prohibido el uso de rutas relativas largas con puntos (`../../`) para archivos internos del proyecto.

### C. Ejemplo de Bloques de Imports

```ts
//? Imports de codigo
import { Request } from 'express';

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

//? Imports de usuario
import { FilterException } from '@common/infrastructure/interfaces';
```

---

## 2. Convenciones de Nomenclatura de Variables y Constantes

Para mantener una consistencia clara en la mutabilidad y el propósito de los datos:

- Las constantes deben declararse obligatoriamente en **MAYÚSCULAS** y formato **SNAKE_CASE** (ej. MAX_RETRIES, DEFAULT_TIMEOUT).
- Las variables declaradas con let deben ir obligatoriamente en **minúsculas** y formato **camelCase** (ej. currentUserCount, isActive).

---

## 3. Convenciones de Comentarios (`BetterComments`)

Para estandarizar la documentación visual y el rastreo en el editor, se utiliza obligatoriamente la extensión **BetterComments** (de Aaron Bond) en Visual Studio Code, empleando los siguientes prefijos en los comentarios de código:

- `//?` : Para notas informativas, descripción de secciones o etiquetado de bloques de imports.
- `//*` : Para destacar puntos clave, lógica importante o explicaciones de negocio.
- `//!` : Para advertencias críticas, alertas de seguridad (como la omisión de `stack` en producción) o código temporal/bloqueante.
- `//TODO:` : Para tareas pendientes o futuras refactorizaciones.
- `//?` : (Otras variantes soportadas por la extensión según la paleta de colores configurada).

---

---

**Main menu:** [README.md](../../README.md) || **Previous:** [Manejo de Excepciones y Logging](../guides/exception-handling.md)