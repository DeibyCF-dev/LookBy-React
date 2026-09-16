# LookBy-React

This is a Vite-powered multi-page web application using React and Tailwind CSS v4.

## 📁 Project Structure

The project has been structured to maintain a clean separation of concerns, keeping HTML, CSS, and JS modularized for scalability and maintainability. 

All source files are located inside the `src/` directory, following a traditional multi-page application (MPA) layout:

- `index.html`: The main landing page.
- `src/pages/`: Contains all other HTML views (e.g., `login.html`, `registro.html`, `cliente.html`, `superadmin.html`, etc.).
- `src/css/`: Global stylesheets and modular CSS files (`layout.css`, `components.css`, `theme.css`, `pages.css`).
- `src/js/`: Client-side logic modularized per page (`pages/cliente.js`, `pages/auth.js`, etc.) and shared utilities (`utils.js`, `theme.js`, `db.js`).

## 🛠️ Tech Stack

- **Vite:** Build tool and development server, configured for multi-page routing.
- **React:** Used selectively for specific UI components.
- **Tailwind CSS v4:** Utility-first CSS framework for rapid UI development.
- **TypeScript:** Type-checking configurations for modern JavaScript support.

## 🚀 Getting Started

### Prerequisites

- Node.js
- pnpm or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DeibyCF-dev/LookBy-React.git
   ```
2. Navigate to the project directory:
   ```bash
   cd LookBy-React
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Run the following command to start the Vite development server:

```bash
npm run dev
```

Vite is pre-configured to build multiple entry points for all the pages in `src/pages/`.

### Build for Production

To generate the production-ready assets:

```bash
npm run build
```

This will bundle the HTML, CSS, and JS into the `dist/` folder, minifying files and optimizing assets.

## ⚙️ Configuration

The `vite.config.ts` handles the multi-page entry points natively via Rollup. All HTML pages defined in the `rollupOptions.input` object are automatically processed, and any referenced CSS or JS files within those HTML documents will be bundled.
