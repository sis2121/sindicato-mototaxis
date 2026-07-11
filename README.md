# 🛵 Sindicato de Mototaxis — Sistema de Gestión

**Plataforma web moderna para la administración de conductores afiliados y sus mototaxis en Trinidad, Beni, Bolivia.**

![Licencia](https://img.shields.io/badge/licencia-MIT-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Versión](https://img.shields.io/badge/versión-1.0.0-green)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos previos](#-requisitos-previos)
- [Instalación rápida](#-instalación-rápida)
- [Credenciales por defecto](#-credenciales-por-defecto)
- [Uso del sistema](#-uso-del-sistema)
- [Arquitectura](#-arquitectura)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Variables de entorno](#-variables-de-entorno)
- [Seguridad](#-seguridad)
- [Contribuciones](#-contribuciones)
- [Licencia](#-licencia)

---

## 🚀 Características

- 🔐 **Autenticación segura** con JWT y contraseñas hasheadas (bcrypt).
- 👥 **Gestión completa de conductores** (CRUD) con búsqueda, filtros y paginación.
- 🏍️ **Administración de mototaxis** con asignación por **código de afiliado** (no por ID interno).
- 📸 **Carga de fotografía** del conductor con previsualización instantánea y almacenamiento en servidor.
- 📊 **Dashboard interactivo** con tarjetas de resumen y gráficos (registros por mes, distribución de estados).
- 🔄 **Botones de refresco** para actualizar datos en cada módulo.
- 🌙 **Modo oscuro / claro** persistente.
- 📱 **Diseño responsive** adaptable a celulares y tablets.
- 🐳 **Despliegue con Docker** – un solo comando para levantar todos los servicios.

---

## 🧰 Tecnologías

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS + componentes shadcn/ui
- React Router 6, React Hook Form, Zod
- TanStack Query (antes React Query)
- Recharts (gráficos)
- Axios (cliente HTTP)

### Backend
- Python 3.12 + Flask 3.0
- SQLAlchemy (ORM) + Flask-Migrate (Alembic)
- Marshmallow (validación/serialización)
- Flask-JWT-Extended (autenticación)
- bcrypt (hash de contraseñas)
- Gunicorn (servidor WSGI)

### Base de Datos
- PostgreSQL 16 (contenedor Alpine)

### Infraestructura
- Docker + Docker Compose
- Volúmenes persistentes (datos y fotos)

---

## ⚙️ Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (o Docker Engine + Docker Compose) instalado.
- Git (para clonar el repositorio).

> El sistema está completamente contenido en contenedores. **No necesitas instalar Node.js ni Python** en tu máquina.

---

## 🛠️ Instalación rápida

```bash
# 1. Clona el repositorio
git clone https://github.com/sis2121/sindicato-mototaxis.git
cd sindicato-mototaxis

# 2. Crea el archivo de variables de entorno (ya viene .env.example como plantilla)
cp .env.example .env

# 3. Levanta los servicios (construye las imágenes si es necesario)
docker compose up --build
