<script setup>
import { ref } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';

const store = useCalculatorStore();
const waermeversorgung = ref(store.formData.waermeversorgung ?? '');

const goNext = () => {
  store.updateFormData({ waermeversorgung: waermeversorgung.value });
  store.goToStep('step-3-calc'); // Nächster Schritt ist Berechnung
};
</script>

<template>
  <div>
    <h3 class="h5 text-center mb-4">Schritt 2c (Gewerbe): Heizsystem</h3>
    <form @submit.prevent="goNext">
      <div class="mb-3">
        <label for="waermeversorgung-gewerbe" class="form-label">Art der Wärmeversorgung:</label>
        <input type="text" class="form-control" id="waermeversorgung-gewerbe" v-model="waermeversorgung" placeholder="z.B. Gas, Fernwärme, Wärmepumpe">
      </div>
      <div class="d-flex justify-content-between mt-4">
        <button @click="store.goBack()" type="button" class="btn btn-secondary">Zurück</button>
        <button type="submit" class="btn btn-primary">Weiter zur Berechnung</button>
      </div>
    </form>
  </div>
</template>