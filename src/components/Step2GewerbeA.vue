<script setup>
import { ref } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';

const store = useCalculatorStore();
const anzahlGewerbe = ref(store.formData.anzahlGewerbe ?? '');
const flaeche = ref(store.formData.flaeche ?? ''); // Gemeinsamer Key 'flaeche'

const goNext = () => {
  if (flaeche.value === '') {
     alert("Bitte die Gesamtfläche eingeben.");
     return;
   }
  store.updateFormData({
    anzahlGewerbe: parseInt(anzahlGewerbe.value) || null,
    'flaeche-gewerbe': parseFloat(flaeche.value) || null // Store konsolidiert
  });
  store.goToStep('step-2b-gewerbe');
};
</script>

<template>
  <div>
    <h3 class="h5 text-center mb-4">Schritt 2a (Gewerbe): Grunddaten</h3>
    <form @submit.prevent="goNext">
      <div class="mb-3">
        <label for="anzahl-gewerbe" class="form-label">Anzahl der Gewerbeeinheiten:</label>
        <input type="number" class="form-control" id="anzahl-gewerbe" v-model="anzahlGewerbe" placeholder="z.B. 3">
      </div>
      <div class="mb-3">
        <label for="flaeche-gewerbe" class="form-label">Gesamtfläche (m²):</label>
        <input type="number" class="form-control" id="flaeche-gewerbe" v-model="flaeche" placeholder="z.B. 1200" required>
      </div>
      <div class="d-flex justify-content-between mt-4">
        <button @click="store.goBack()" type="button" class="btn btn-secondary">Zurück</button>
        <button type="submit" class="btn btn-primary">Weiter</button>
      </div>
    </form>
  </div>
</template>