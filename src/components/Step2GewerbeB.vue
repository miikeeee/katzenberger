<script setup>
import { ref } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';

const store = useCalculatorStore();
const nutzung = ref(store.formData.nutzung ?? '');

const goNext = () => {
  store.updateFormData({ nutzung: nutzung.value });
  store.goToStep('step-2c-gewerbe');
};
</script>

<template>
  <div>
    <h3 class="h5 text-center mb-4">Schritt 2b (Gewerbe): Nutzung</h3>
    <form @submit.prevent="goNext">
      <div class="mb-3">
        <label for="nutzung-gewerbe" class="form-label">Hauptnutzung:</label>
        <input type="text" class="form-control" id="nutzung-gewerbe" v-model="nutzung" placeholder="z.B. Büro, Lager, Produktion">
      </div>
      <div class="d-flex justify-content-between mt-4">
        <button @click="store.goBack()" type="button" class="btn btn-secondary">Zurück</button>
        <button type="submit" class="btn btn-primary">Weiter</button>
      </div>
    </form>
  </div>
</template>