# 🚀 Talent Hub Backend

Backend de alto rendimiento desarrollado bajo una **Arquitectura Hexagonal estricta** y principios de Domain-Driven Design (DDD), diseñado para garantizar escalabilidad, mantenibilidad y un acoplamiento desacoplado de infraestructura.

---

## 📌 Requisitos de Entorno y Versiones

Para asegurar la máxima compatibilidad y evitar discrepancias de dependencias en el equipo o en pipelines de CI/CD, este proyecto requiere un entorno estricto mediante Corepack:

- **Node.js:** `>= 26.8.0`
- **Gestor de paquetes:** `npm @ 12.0.x`
- **Framework:** `NestJS v12.x`
- **Base de Datos:** `MongoDB` (Mongoose v9.x) 

---

## 🧰 Herramientas y Utilidades (DX & Seguridad)

El proyecto cuenta con herramientas configuradas a medida para priorizar la velocidad de desarrollo, el rendimiento y la seguridad del servidor:

- **⚡ Testing Ultra-Rápido:** [Vitest](https://vitest.dev/) para pruebas unitarias y de integración, sustituyendo a Jest para un rendimiento superior impulsado por Vite.
- **🧹 Linting y Formateo:** [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) (basado en Rust) para un análisis estático de código entre 50 y 100 veces más rápido que ESLint, combinado con **Prettier** para el estilo.
- **📖 Documentación Interactiva:** [Swagger OpenAPI](https://swagger.io/) autogenerado e integrado. (Disponible en la ruta `/api/docs` únicamente en entornos fuera de producción).
- **🛡️ Seguridad y Auditoría:**
  - **Helmet:** Para la configuración estricta de cabeceras HTTP de seguridad (Content Security Policy, mitigación de XSS).
  - **Joi:** Validación estricta y tipado fuerte de las variables de entorno (`.env`) durante el arranque.
- **📡 Telemetría Personalizada:** Sistema de interceptores asíncronos (`SnifferInterceptor`) integrado con eventos nativos HTTP (`finish`) para registrar la trazabilidad exacta de las peticiones sin bloquear la respuesta del cliente.
-   **🏗️ Auditoría Arquitectónica de Imports:** Script automatizado (`scripts/check-imports.ts`) en TypeScript que valida en tiempo de compilación la prohibición de rutas relativas, el correcto uso de archivos de barril (`index.ts`) y la prevención de referencias circulares.

---

## 📂 Estructura del Proyecto

El código fuente se organiza modularmente separando las reglas de negocio de los detalles técnicos externos:

```text
docs/                    # Documentación técnica específica del proyecto
src/
├── common/              # Elementos transversales (Dominio e Infraestructura compartida)
├── configuration/       # Configuración global del sistema
├── logger/              # Módulo centralizado de trazabilidad y consola
├── sniffer/             # Módulo de auditoría y telemetría de red HTTP
├── users/               # Módulo de usuarios (Dominio, Aplicación, Infraestructura)
```

## 📚 Documentación del Proyecto

Para profundizar en las decisiones técnicas y operativas, consulta las guías específicas:

- [Glossario de Términos](./docs/architecture/glossary.md)
- [Estándares de Arquitectura Hexagonal](./docs/architecture/hexagonal-standards.md)
- [Manejo de Excepciones y Logging](./docs/guides/exception-handling.md)
- [Estándares de Código y Formato](./docs/architecture/code-standards.md)

## ⚙️ Guía de Inicio Rápido

### 1. Clonar el repositorio y clonar dependencias

```bash
git clone https://github.com/joel287g/talent-hub.git
cd talent-hub
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.development` en la raíz del proyecto basándote en el archivo de ejemplo `.env.example` y configura tu conexión a MongoDB y el entorno (`development` o `production`).

### 3. Ejecutar la aplicación

```bash
# Comprobar la integridad arquitectónica de los imports
npm run check:imports

# Modo desarrollo con recarga en vivo (ejecuta check:imports antes del arranque)
npm run start:dev

# Ejecutar el linter y pruebas antes de subir código
npm run lint
npm run test

# Compilación y modo producción
npm run build
npm run start:prod
```
