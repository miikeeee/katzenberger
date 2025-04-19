<script setup>
import { ref } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';

const store = useCalculatorStore();
// Initialisiere lokale Refs mit Werten aus dem Store oder leer
const anzahlWohnungen = ref(store.formData.anzahlWohnungen ?? '');
const flaeche = ref(store.formData.flaeche ?? ''); // Gemeinsamer Key 'flaeche'

const goNext = () => {
  // Basis-Validierung
  if (flaeche.value === '') {
    alert("Bitte die Gesamtfläche eingeben.");
    return;
  }
  store.updateFormData({
    anzahlWohnungen: parseInt(anzahlWohnungen.value) || null,
    'flaeche-mfh': parseFloat(flaeche.value) || null // Store konsolidiert es später unter 'flaeche'
  });
  store.goToStep('step-2b-mfh'); // Nächster MFH Schritt
};
</script>

<template>
  <div>
    <h3 class="h5 text-center mb-4">Schritt 2a (MFH): Grunddaten</h3>
    <form @submit.prevent="goNext">
      <div class="mb-3">
        <label for="anzahl-wohnungen" class="form-label">Anzahl der Wohnungen:</label>
        <input type="number" class="form-control" id="anzahl-wohnungen" v-model="anzahlWohnungen" placeholder="z.B. 6">
      </div>
      <div class="mb-3">
        <label for="flaeche-mfh" class="form-label">Gesamtfläche (m²):</label>
        <input type="number" class="form-control" id="flaeche-mfh" v-model="flaeche" placeholder="z.B. 800" required>
      </div>
      <div class="d-flex justify-content-between mt-4">
        <button @click="store.goBack()" type="button" class="btn btn-secondary">Zurück</button>
        <button type="submit" class="btn btn-primary">Weiter</button>
      </div>
    </form>
  </div>
</template>