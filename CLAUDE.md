# Talent Hub — Backend

Plataforma centralizada para conectar talento artístico (bailarines, coreógrafos, instructores) con academias, compañías y empresas mediante ofertas de empleo. Backend en **NestJS 12 + MongoDB (Mongoose 9)**, Node `>= 26.8`, construido bajo una **Arquitectura Hexagonal estricta** y principios de **DDD**.

Módulos actuales en `src/`: `auth` (JWT + Passport), `common` (transversal), `configuration`, `logger`, `sniffer` (telemetría HTTP) y `users`. Alias absolutos: `@auth`, `@common`, `@configuration`, `@logger`, `@sniffer`, `@users`.

---

## 📚 Documentación del proyecto (fuente de verdad)

Las reglas, instrucciones y direcciones del proyecto viven en `docs/`. **Todo código nuevo o corregido debe cumplirlas.** Se importan aquí completas para que estén siempre en contexto; si algo de este archivo contradice a `docs/`, manda `docs/`.

- Glosario (lenguaje ubicuo): @docs/architecture/glossary.md
- Estándares de Arquitectura Hexagonal (capas, reglas de oro, matriz de dependencias): @docs/architecture/hexagonal-standards.md
- Manejo de Excepciones y Filtros Globales: @docs/guides/exception-handling.md
- Estándares de Código y Formato (nomenclatura, BetterComments, imports y barriles): @docs/architecture/code-standards.md
- Diagrama Entidad-Relación del módulo de usuarios: @docs/architecture/entity-relationship-diagram.md
- Autenticación (JWT + Passport, `@PublicJwt`, `@GetUser`): @docs/guides/authentication.md
- Perfiles de usuario (añadir y editar perfiles, editar los datos base, cambiar el perfil activo): @docs/guides/user-profiles.md
- Visión general, stack y comandos: @README.md

### Resumen de reglas críticas (detalle completo en los docs)

- **Capas:** `infrastructure → application → domain`, nunca al revés. `domain/` no importa `@nestjs/*`, `mongoose`, `class-validator`, etc. Solo los `*.module.ts` ensamblan las tres capas.
- **Inyección por `Symbol`** para los puertos (`USERS_REPOSITORY = Symbol('USERS_REPOSITORY')`).
- **Entidades ricas** con `static create()`; nada de modelos anémicos.
- **Casos de uso** con un único `execute()`, solo orquestan y **sin `try/catch`**: los errores se lanzan desde el catálogo de errores del dominio y los filtros globales los traducen a HTTP.
- **Anticipar los errores:** todo error previsible se ataja antes de que lo lance la BD o el servidor (formato ➔ 400 en el DTO; unicidad ➔ consulta previa y 409 del catálogo). Los índices únicos son solo la última defensa.
- **Imports:** prohibidas las rutas relativas (`./`, `../`). Desde otra carpeta se importa el barril (`@common/domain/exceptions`); dentro de la misma carpeta, el fichero hermano directo (`@common/domain/exceptions/base-exception`). Los `*.module.ts` se importan directamente.
- **Bloques de imports:** `//? Imports de codigo` (nativos de Node, línea en blanco, librerías) y `//? Imports de usuario` (código de `src/`).
- **Comentarios BetterComments:** `//?` informativo, `//*` importante, `//!` advertencia, `//TODO:` pendiente.
- **Nomenclatura:** `PascalCase` en clases, interfaces, types y enums; `camelCase` en variables y propiedades; `SNAKE_CASE` en constantes y tokens `Symbol`; `kebab-case` en archivos y carpetas.
- **Sin fugas de infraestructura** (ej. `Types.ObjectId` en DTOs o casos de uso) y **sin magic strings** (usar `Clase.name`, enums o constantes).

---

## ✅ Flujo obligatorio al terminar cualquier `fix` o `feature`

Antes de dar por terminado un `fix` o `feature`, ejecuta **en este orden** y no lo cierres mientras alguno falle:

1. **Integridad arquitectónica** (scripts de `src/scripts/`):
   ```bash
   npm run check:arch        # = check:imports (rutas absolutas, barriles, ciclos) + check:hexagonal (aislamiento de capas)
   ```
   Si falla, corrige los archivos que liste. No relajes ni modifiques los scripts para que pasen.
2. **Tipos:** `npx tsc --noEmit -p tsconfig.json`
3. **Lint:** `npm run lint`. No introduzcas warnings nuevos; corrige los de los archivos que hayas tocado.
4. **Formato:** `npm run format:check`. Si falla, `npm run format`.
5. **Grafo de conocimiento:** `& .\.venv\Scripts\graphify.exe update .` (ver la sección de graphify más abajo).
6. **Revisión de documentación:** comprueba si el cambio deja algo de `docs/` (o del `README.md`) desactualizado, incompleto o sobrante:
   - **Corregir:** rutas, nombres de clases o archivos, ejemplos o flujos que hayan cambiado (ej. un archivo renombrado o eliminado que el doc todavía cita).
   - **Eliminar:** secciones que describan código que ya no existe.
   - **Agregar:** nuevos módulos, entidades o campos (actualizar el diagrama ER), nuevos patrones, errores, términos del glosario o reglas.

   Informa al usuario de las actualizaciones necesarias y aplícalas manteniendo el estilo de los docs: español, emojis en títulos y el pie de navegación `Main menu / Previous / Next`. Si añades un doc nuevo, enlázalo en el `README.md` y en este archivo.

Al cerrar, resume el resultado de cada paso (OK, falla o warnings) y los cambios de documentación hechos o propuestos.

---

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Graphify is installed locally in the project's Python venv (not on PATH). Invoke it as `.venv/Scripts/graphify.exe` (PowerShell: `& .\.venv\Scripts\graphify.exe ...`). Wherever `graphify` appears below, use that path. On Windows, set `$env:PYTHONIOENCODING='utf-8'` to avoid encoding errors in the output.

Rules:
- ALWAYS consult graphify FIRST whenever you need context about the codebase (before Grep, Glob, Read or Explore agents).
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. When the answer is under a Markdown heading, `graphify section "<heading>"` prints that section's text, so the .md need not be opened. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
