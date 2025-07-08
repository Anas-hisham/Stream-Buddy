# 🎮 Stream Buddy

Stream Buddy is a powerful Electron + Vue 3 desktop application designed for stream teams managing game tournaments. It dynamically generates JSON files from user inputs across multiple customizable views, and integrates seamlessly with stream tools like OBS and vMix.


---

## Features

- **Dynamic View Builder** – Create and customize your own views with sections and input types
- **Modular Presets System** – Save, update, delete, and apply presets to switch stream layouts quickly
- **Multiple Built-in Views** – Brackets, Today’s Matches, Player Stats, Teams, Settings, and more
- **JSON Generator** – Export live data to JSON files for integration with streaming platforms
- **Image Uploads** – Easily attach team logos, flags, and other images
- **Auto Updates** – Built-in update checker and automatic updater
- **Persistent State** – Save inputs and state locally across app restarts
- **Customizable UI** – Light/Dark theme, compact/full nav, animated transitions
- **Secure Architecture** – Uses Electron context isolation and IPC safely

---

## 🛠 Tech Stack

| Layer         | Technology                 |
|---------------|----------------------------|
| Backend       | Electron + Node.js         |
| Frontend      | Vue 3 (Composition API)    |
| State Mgmt    | Pinia                      |
| Styling       | TailwindCSS                |
| Formatting    | ESLint + Prettier          |
| Packaging     | Electron Builder           |
| CI/CD         | GitHub Actions             |

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
