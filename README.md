# Electron + Vue + Vite Project

This is an Electron application using Vue 3 and Vite, featuring:

- Hot reload support for both Electron main and Vue renderer processes
- Secure Electron context isolation with preload script
- ESLint and Prettier integration for consistent code style and linting
- Development and production build workflows

---

## Features

- **Vue 3** with Vite as the build tool and dev server
- Electron main process with secure context isolation and IPC communication
- Preload script exposing safe API to renderer process
- Hot-reloading during development for both Electron and Vue
- Code linting with ESLint (Vue plugin) and formatting with Prettier

---

## Getting Started

### Prerequisites

- Node.js v16+ (recommended)
- npm or yarn package manager

### Installation

1. Clone this repository or download the source code
2. Run:

   ```bash
   npm install
   ```

   Builds the Vue renderer process for production.

   ```bash
   npm run build
   ```

   Builds the app and packages it

   ```bash
   npm run build:win
   ```

   publishes the app

   ```bash
   npm run publish
   ```

## 📁 Project Folder Structure

<pre><code>```
GL Stream
 
src/
├── main/                          # Main process (Electron backend)
│   ├── config/                    # Manages global config settings
│   ├── constants/                 # Shared constants used in the main process
│   ├── handlers/                 # IPC handlers for different modules/features
│   │   ├── app/                   # App-level IPC handlers
│   │   ├── path/                  # File/folder path-related handlers
│   │   ├── settings/              # Handlers for settings view
│   │   ├── updater/               # Auto-update handlers
│   │   ├── views/                 # Handlers for views
│   │   └── index.js               # Main process entry point
│   ├── utils/                    # Utility functions for the main process
│   │── windows/                   
│   │   └──windowManager.js        # Logic for creating/managing Electron windows
│   │── Initialization/
│   │   └──init.js                 # Initialization logic (setup configs, handlers, etc.)
│   └── index.js                  # Main utility export or aggregator 
│── preload/
│   └── index.js
├── renderer/                     # Renderer process (Vue frontend)
│   └── src/
│       ├── assets/                   # Static assets
│       │   ├── icons/                # App icons (SVG, PNG, etc.)
│       │   └── fonts/                # Custom fonts (TTF, WOFF, etc.)
│       ├── components/              # Reusable Vue components
│       │   ├── brackets/             # Components specific to the Brackets view
│       │   ├── common/               # Common reusable UI components
│       │   ├── customView/           # Components specific to the Custom view
│       │   ├── layouts/              # Layout wrappers (e.g., header/sidebar layout)
│       │   ├── matches/              # Components specific to the Matches view
│       │   ├── playersStats/         # Components specific to the Players Stats view
│       │   ├── settings/             # Components specific to the Settings view
│       │   └── viewBuilder/          # Components specific to the View Builder view
│       ├── composables/              # Vue 3 composables (logic extraction)
│       ├── constants/                # Frontend constants
│       ├── routes/                   # Vue Router config
│       ├── services/                 # Service logic
│       ├── stores/                   # Global state (Pinia)
│       ├── styles/                   # Global and modular styles
│       ├── utils/                    # Utility functions
│       ├── views/                    # App Views
│       ├── App.vue                   # Root Vue component
│       └── main.js                   # Entry point for the Vue app

 ```</code></pre>
