import 'bootstrap/dist/css/bootstrap.min.css' // Importiert die Bootstrap CSS-Stile
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // Importiert Bootstrap JavaScript (inkl. Popper für Dropdowns etc.)
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
