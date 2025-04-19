<script setup>
import { ref } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';

const store = useCalculatorStore();
const baujahr = ref(store.formData.baujahr ?? '');
const flaeche = ref(store.formData.flaeche ?? '');

const goNext = () => {
  if (!flaeche.value) {
      alert("Bitte Fläche eingeben.");
      return;
  }
  store.updateFormData({
    baujahr: parseInt(baujahr.value) || null,
    'flaeche-efh': parseFloat(flaeche.value) || null
  });
  store.goToStep('step-3-calc');
};
</script>

<template>
  <div>
    <h3 class="h5 text-center mb-4">Schritt 2 (EFH): Details</h3>
    <form @submit.prevent="goNext"> <!-- Verhindert echtes Formular-Senden -->
        <div class="mb-3">
          <label for="baujahr-efh" class="form-label">Baujahr:</label>
          <input type="number" class="form-control" id="baujahr-efh" v-model="baujahr" placeholder="z.B. 1995">
        </div>
        <div class="mb-3">
          <label for="flaeche-efh" class="form-label">Wohnfläche (m²):</label>
          <input type="number" class="form-control" id="flaeche-efh" v-model="flaeche" placeholder="z.B. 150" required>
        </div>
        <div class="d-flex justify-content-between mt-4">
          <button @click="store.goBack()" type="button" class="btn btn-secondary">Zurück</button>
          <button type="submit" class="btn btn-primary">Weiter zur Berechnung</button>
        </div>
    </form>
  </div>
</template>
