import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'out/preload', // Output to preload folder
      rollupOptions: {
        output: {
          entryFileNames: 'index.js', // Force .js extension
          format: 'cjs' // Use CommonJS format instead of ES modules
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      tailwindcss(),
      viteStaticCopy({
        targets: [
          {
            src: 'public/icons/icon.ico',
            dest: 'assets/icons'
          }
        ]
      })
    ]
  }
})
