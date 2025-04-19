<script setup>
import { ref } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';

const store = useCalculatorStore();
const fensterTyp = ref(store.formData.fensterTyp ?? '2fach'); // Default

const goNext = () => {
  store.updateFormData({ fensterTyp: fensterTyp.value });
  store.goToStep('step-3-calc'); // Nächster Schritt ist Berechnung
};
</script>

<template>
  <div>
    <h3 class="h5 text-center mb-4">Schritt 2c (MFH): Fenster</h3>
    <form @submit.prevent="goNext">
      <div class="mb-3">
        <label for="fenster-mfh" class="form-label">Fenstertyp:</label>
        <select class="form-select" id="fenster-mfh" v-model="fensterTyp">
          <option value="3fach">3fach verglast</option>
          <option value="2fach">2fach verglast</option>
          <option value="alt">Einfach / Älter</option>
          <option value="unbekannt">Unbekannt</option>
        </select>
      </div>
      <div class="d-flex justify-content-between mt-4">
        <button @click="store.goBack()" type="button" class="btn btn-secondary">Zurück</button>
        <button type="submit" class="btn btn-primary">Weiter zur Berechnung</button>
      </div>
    </form>
  </div>
</template>