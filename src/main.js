// src/main.js

// ===== BOOTSTRAP INTEGRATION =====
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// ================================

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue' // Die Hauptkomponente

// Optional: Eigene globale CSS, falls vorhanden (kann auch leer sein oder gelöscht werden)
// import './assets/main.css' 

const app = createApp(App)

app.use(createPinia()) // Pinia Store aktivieren

app.mount('#app') // App an das HTML binden