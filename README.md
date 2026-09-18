# 🚀 Talent Hub Backend

Backend de alto rendimiento desarrollado bajo una **Arquitectura Hexagonal estricta** y principios de Domain-Driven Design (DDD), diseñado para garantizar escalabilidad, mantenibilidad y un acoplamiento desacoplado de infraestructura.

---

## 🛠️ Stack Tecnológico

- **Framework Principal:** [NestJS](https://nestjs.com/) (TypeScript)
- **Base de Datos:** MongoDB & Mongoose
- **Gestión de Errores:** Filtros globales de infraestructura y manejo seguro de entornos.

---

## 📂 Estructura del Proyecto

El código fuente se organiza modularmente separando las reglas de negocio de los detalles técnicos externos:

```text
src/
├── common/              # Elementos transversales (Dominio e Infraestructura compartida)
├── logger/              # Módulo centralizado de trazabilidad y auditoría
├── users/               # Módulo de usuarios (Dominio, Aplicación, Infraestructura)
└── docs/                # Documentación técnica específica del proyecto
```

## 📚 Documentación del Proyecto

Para profundizar en las decisiones técnicas y operativas, consulta las guías específicas:

- [Glossario de Términos](./docs/architecture/glossary.md)
- [Estándares de Arquitectura Hexagonal](./docs/architecture/hexagonal-standards.md)
- [Manejo de Excepciones y Logging](./docs/guides/exception-handling.md)

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
# Modo desarrollo con recarga en vivo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```
