# MEYS - Sistema de Inventario de Activos Tecnológicos

MEYS (Management software for Electronic equipment and sYStems) es un sistema integral para la gestión de inventario, activos tecnológicos y manejo de incidentes.

Este proyecto sigue una arquitectura de monorepo dividida en Frontend y Backend.

## Estructura del Proyecto

```
AppInventory/
├── backend/    # API RESTful con Node.js, Express y MySQL/MariaDB
└── frontend/   # SPA moderna con React, TypeScript y TailwindCSS
```

## Requisitos Previos

- **Node.js**: v18 o superior
- **Base de Datos**: MySQL o MariaDB

## 🚀 Guía de Inicio Rápido

### 1. Configuración del Backend

El backend maneja la lógica de negocio y la conexión a la base de datos.

1.  Navega a la carpeta del backend:
    ```bash
    cd backend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Configura las variables de entorno:
    - Copia el archivo de ejemplo:
      ```bash
      cp .env.example .env
      ```
    - Edita `.env` con tus credenciales de base de datos local.
4.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
    > El servidor correrá por defecto en `http://localhost:3000`.

### 2. Configuración del Frontend

El frontend es la interfaz de usuario construida con React y Vite.

1.  Navega a la carpeta del frontend:
    ```bash
    cd frontend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
    > Abre tu navegador en `http://localhost:5173`.

## 🛠 Tecnologías Utilizadas

### Backend
- **Express**: Framework web rápido y minimalista.
- **Sequelize**: ORM para bases de datos SQL.
- **MySQL2**: Driver de MySQL.

### Frontend
- **React**: Biblioteca para construir interfaces de usuario.
- **TypeScript**: Superset de JavaScript con tipado estático.
- **Vite**: Herramienta de construcción frontend de próxima generación.
- **TailwindCSS**: Framework de CSS para diseño rápido.

## Contribución

1.  Haz fork del repositorio.
2.  Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
3.  Haz commit de tus cambios (`git commit -m 'Agrega nueva funcionalidad'`).
4.  Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5.  Abre un Pull Request.
