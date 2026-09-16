# LookBy-React

Esta es una aplicación web multipágina (MPA) desarrollada con Vite, React y Tailwind CSS v4.

## 📁 Estructura del Proyecto

El proyecto ha sido estructurado para mantener una clara separación de responsabilidades, manteniendo el HTML, CSS y JS modularizados para facilitar su escalabilidad y mantenimiento.

Todos los archivos fuente se encuentran dentro del directorio `src/`, siguiendo una arquitectura tradicional de aplicación multipágina:

- `index.html`: La página principal de inicio (landing page).
- `src/pages/`: Contiene el resto de las vistas en HTML (ej. `login.html`, `registro.html`, `cliente.html`, `superadmin.html`, etc.).
- `src/css/`: Hojas de estilo globales y archivos CSS modulares (`layout.css`, `components.css`, `theme.css`, `pages.css`).
- `src/js/`: Lógica del lado del cliente modularizada por página (ej. `pages/cliente.js`, `pages/auth.js`) y utilidades compartidas (`utils.js`, `theme.js`, `db.js`).

## 🛠️ Tecnologías

- **Vite:** Herramienta de construcción y servidor de desarrollo, configurado para enrutamiento de múltiples páginas.
- **React:** Utilizado de manera selectiva para componentes específicos de la interfaz.
- **Tailwind CSS v4:** Framework CSS basado en utilidades para el desarrollo rápido de interfaces.
- **TypeScript:** Configuraciones de tipado estricto.

## 🚀 Comenzando

### Requisitos Previos

- Node.js
- pnpm o npm

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/DeibyCF-dev/LookBy-React.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd LookBy-React
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

### Servidor de Desarrollo

Ejecuta el siguiente comando para iniciar el servidor de desarrollo de Vite:

```bash
npm run dev
```

Vite está preconfigurado para compilar múltiples puntos de entrada para todas las páginas en `src/pages/`.

### Construcción para Producción

Para generar los archivos listos para producción:

```bash
npm run build
```

Esto empaquetará el HTML, CSS y JS en la carpeta `dist/`, minificando los archivos y optimizando los recursos.

## ⚙️ Configuración

El archivo `vite.config.ts` maneja los puntos de entrada multipágina de forma nativa a través de Rollup. Todas las páginas HTML definidas en el objeto `rollupOptions.input` se procesan automáticamente, y cualquier archivo CSS o JS referenciado dentro de esos documentos HTML será empaquetado correctamente.
