<script setup>
import { computed } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';

const store = useCalculatorStore();

// Zeige Daten an, die die Upload-API evtl. zurückgegeben hat
const responseData = computed(() => store.uploadResponseData);

const restart = () => {
  store.setBuildingType(null); // Reset Type (führt zu Step 1)
  // Alternativ direkter Sprung: store.goToStep('step-1'); store.formData={}; ...
}
</script>

<template>
  <div>
    <h3 class="h5 text-center text-success mb-3">✓ Upload Erfolgreich!</h3>
    <p class="text-center">
      Ihre Datei wurde erfolgreich hochgeladen und der Prozess wurde angestoßen.
    </p>
    <p v-if="responseData" class="text-center text-muted small mt-2 mb-3">
       Server-Antwort: {{ responseData.message || JSON.stringify(responseData) }}
    </p>
     <p v-else class="text-center text-muted small mt-2 mb-3">
       Die Verarbeitung läuft im Hintergrund.
    </p>

    <div class="text-center mt-4">
        <button @click="restart" class="btn btn-outline-secondary btn-sm">Neue Anfrage starten</button>
    </div>
  </div>
</template>