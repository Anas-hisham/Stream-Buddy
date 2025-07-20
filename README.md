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

## Tech Stack

| Layer          | Technology               |
|----------------|--------------------------|
| **Backend**    | Electron + Node.js       |
| **Frontend**   | Vue 3 (Composition API)  |
| **State Mgmt** | Pinia                    |
| **Styling**    | Tailwind CSS             |
| **Formatting** | ESLint + Prettier        |
| **Packaging**  | Electron Builder         |
| **CI/CD**      | GitHub Actions           |

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

## Project Folder Structure

<pre><code>```

GL Stream/
├── src/
│   ├── main/                      # Electron main process
│   │   ├── bootstrap/             # App setup logic
│   │   ├── config/                # Configuration management
│   │   ├── constants/             # Shared constants
│   │   ├── ipc/                   # IPC handlers
│   │   │   ├── app/               # App-level handlers
│   │   │   ├── path/              # File system operations
│   │   │   ├── settings/          # Settings management
│   │   │   ├── updater/           # Auto-update logic
│   │   │   ├── views/             # Window/view management
│   │   │   └── index.js           # IPC exports
│   │   ├── utils/                 # Utility functions
│   │   ├── windows/               # Window management
│   │   └── index.js               # Main process entry
│   │
│   ├── preload/                   # Preload scripts
│   │   └── index.js
│   │
│   └── renderer/                  # Vue frontend
│       ├── app/                   # Core app structure
│       │   ├── main.js            # Vue entry point
│       │   ├── App.vue            # Root component
│       │   └── router/            # Routing configuration
│       │
│       ├── assets/                # Static assets
│       │   ├── fonts/
│       │   └── icons/
│       │
│       ├── features/              # Feature modules
│       │   ├── brackets/
│       │   │   ├── components/
│       │   │   └── Brackets.vue
│       │   │
│       │   ├── custom-view/
│       │   │   ├── components/
│       │   │   ├── services/
│       │   │   ├── CustomView.vue
│       │   │   └── customViewStore.js
│       │   │
│       │   ├── players-stats/
│       │   │   ├── components/
│       │   │   └── PlayersStats.vue
│       │   │
│       │   ├── settings/
│       │   │   ├── components/
│       │   │   └── Settings.vue
│       │   │
│       │   └── view-builder/
│       │       ├── components/
│       │       ├── ViewBuilder.vue
│       │       └── viewBuilderStore.js
│       │
│       ├── pages/                 # Pages
│       │
│       ├── shared/                # Shared resources
│       │   ├── components/        # Global components
│       │   ├── composables/       # Composable functions
│       │   ├── constants/         # Shared constants
│       │   ├── layouts/           # Layout components
│       │   ├── stores/            # Global state stores
│       │   ├── styles/            # Global styles
│       │   └── utils/             # Shared utilities
│       │
│       └── index.html             # Main HTML entry

 ```</code></pre>
