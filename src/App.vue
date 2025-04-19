<script setup>
import { computed, defineAsyncComponent } from 'vue';
import { useCalculatorStore } from './stores/calculator'; // Pfad zum Store prüfen

const store = useCalculatorStore();

// Lädt die benötigte Schritt-Komponente dynamisch
const loadedComponent = computed(() => {
  const componentName = store.currentStepComponent;
  if (!componentName) return null;
  // Sicherstellen, dass der Pfad korrekt ist
  return defineAsyncComponent(() => import(`./components/${componentName}.vue`)); 
});

// Logik für die Fortschrittsanzeige
const showProgressBar = computed(() => store.currentStepId !== 'step-1' && store.currentStepId !== 'step-success' && store.currentPathTotalSteps > 0);

</script>

<template>
  <!-- Bootstrap Container für zentriertes Layout -->
  <div class="container mt-4 mt-md-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8">
        <!-- Die äußere Karte für den Rechner -->
        <div id="heizlast-rechner-bootstrap-card" class="card shadow-sm">
          <div class="card-body p-4 p-md-5">
            <!-- Hauptüberschrift -->
            <h2 class="card-title text-center h4 mb-4">Heizlastrechner (Bootstrap Prototyp)</h2>

            <!-- Fortschrittsanzeige (mit fester Höhe gegen Springen) -->
            <div class="text-center text-muted small mb-4" style="height: 1.2rem;"> 
              <span v-if="showProgressBar">
                Fortschritt: {{ store.displayCurrentStep }} / {{ store.displayTotalSteps }}
              </span>
              <!-- Optional: Bootstrap Progress Bar -->
              <!-- 
              <div v-if="showProgressBar" class="progress mt-1" style="height: 5px;">
                 <div class="progress-bar" role="progressbar" :style="{ width: (store.displayCurrentStep / store.displayTotalSteps * 100) + '%' }" :aria-valuenow="store.displayCurrentStep" aria-valuemin="0" :aria-valuemax="store.displayTotalSteps"></div>
              </div> 
              -->
            </div>


            <!-- Container für die dynamischen Schritte mit Animation -->
            <div class="position-relative" style="min-height: 300px;"> 
              <Transition name="fade" mode="out-in">
                <!-- Hier wird die aktuelle Schritt-Komponente geladen -->
                <component :is="loadedComponent" :key="store.currentStepId" />
              </Transition>
            </div>
          </div> 
        </div> 
      </div> 
    </div> 
  </div> 
</template>

<style>
/* Globale Stile oder Basis-Stile hier, falls nötig */

/* Fade Transition für den Komponentenwechsel */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Optional: Sicherstellen, dass der Body einen Hintergrund hat */
body {
  background-color: #f8f9fa; /* Bootstrap bg-light */
}
</style>