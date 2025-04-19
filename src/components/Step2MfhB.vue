<script setup>
import { ref } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';

const store = useCalculatorStore();
const dachDaemmung = ref(store.formData.dachDaemmung ?? 'ja'); // Default 'ja'

const goNext = () => {
  store.updateFormData({ dachDaemmung: dachDaemmung.value });
  store.goToStep('step-2c-mfh');
};
</script>

<template>
  <div>
    <h3 class="h5 text-center mb-4">Schritt 2b (MFH): Dämmung</h3>
    <form @submit.prevent="goNext">
      <div class="mb-3">
        <label for="daemmung-mfh" class="form-label">Dach gedämmt?</label>
        <select class="form-select" id="daemmung-mfh" v-model="dachDaemmung">
          <option value="ja">Ja</option>
          <option value="nein">Nein</option>
          <option value="unbekannt">Unbekannt</option>
        </select>
      </div>
      <div class="d-flex justify-content-between mt-4">
        <button @click="store.goBack()" type="button" class="btn btn-secondary">Zurück</button>
        <button type="submit" class="btn btn-primary">Weiter</button>
      </div>
    </form>
  </div>
</template>