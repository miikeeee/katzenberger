<script setup>
import { computed, defineAsyncComponent } from 'vue';
import { useCalculatorStore } from './stores/calculator';

const store = useCalculatorStore();

const loadedComponent = computed(() => { /* ... wie vorher ... */
  const componentName = store.currentStepComponent;
  if (!componentName) return null;
  return defineAsyncComponent(() => import(`./components/${componentName}.vue`));
});

// Sichtbarkeit der Progress Bar für *alle* Flows, die nicht Start/Erfolg sind
const showProgressBar = computed(() => {
    const step = store.currentStepId;
    const flow = store.currentFlowType;
    // Nicht anzeigen auf der initialen Auswahl oder auf Erfolgsseiten
    return step !== 'step-1' && !step.includes('success') && flow !== null;
});

// Daten für die Progress Bar
const currentProgress = computed(() => store.displayCurrentStep);
const totalProgress = computed(() => store.displayTotalSteps);
const progressPercent = computed(() => store.progressPercent);

</script>

<template>
  <div class="container mt-4 mt-md-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8">
        <div id="heizlast-rechner-bootstrap-card" class="card shadow-sm">
          <div class="card-body p-4 p-md-5">
            <h2 class="card-title text-center h4 mb-4">Heizlastrechner (Prototyp)</h2>

            <!-- Fortschrittsanzeige / Progress Bar -->
            <div class="mb-4" style="height: 1.5rem;"> <!-- Feste Höhe für Layout -->
                 <div v-if="showProgressBar" class="progress" style="height: 10px;">
                    <div class="progress-bar"
                         role="progressbar"
                         :style="{ width: progressPercent + '%' }"
                         :aria-valuenow="currentProgress"
                         aria-valuemin="0"
                         :aria-valuemax="totalProgress">
                         {{ progressPercent }}%
                    </div>
                 </div>
                 <div v-if="showProgressBar" class="text-center text-muted small mt-1">
                      Schritt {{ currentProgress }} von {{ totalProgress }}
                 </div>
            </div>


            <!-- Container für die Schritte -->
            <div class="position-relative" style="min-height: 350px;">
              <Transition name="fade" mode="out-in">
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
/* Fade Transition wie vorher */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
body { background-color: #f8f9fa; }
/* Style für Text in Progress Bar */
.progress-bar {
    font-size: 0.7rem;
    line-height: 10px; /* Höhe der Bar */
    color: white;
    text-shadow: 1px 1px 1px rgba(0,0,0,0.4);
}
</style>