import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index'
import '../shared/styles/main.css'
import 'primeicons/primeicons.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
const app = createApp(App)
const pinia = createPinia()

// Global error handler for Vue errors
app.config.errorHandler = (err, vm, info) => {
    console.error('Vue error:', err, info)
    if (window.myAPI?.logError) {
        window.myAPI.logError(`Vue Error: ${err.message}\nComponent: ${info}`)
    }
}

// Global handler for uncaught exceptions
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    if (window.myAPI?.logError) {
        window.myAPI.logError(`Uncaught Error: ${event.error.message}`)
    }
})

// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason)
    const reason = event.reason || 'Unknown error'
    const message = reason instanceof Error ? reason.message : String(reason)
    if (window.myAPI?.logError) {
        window.myAPI.logError(`Unhandled Rejection: ${message}`)
    }
})

app.use(pinia)
app.use(router)
app.mount('#app')
AOS.init()
