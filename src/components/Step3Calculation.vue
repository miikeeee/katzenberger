<script setup>
import { ref, computed } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';

const store = useCalculatorStore();
const verbrauch = ref(store.formData.verbrauch ?? '');
// Überprüft, ob im Store bereits ein Ergebnis für diesen Durchlauf existiert
const calculationDone = ref(store.calculatedResult !== null);

const anzeigeErgebnis = computed(() => store.calculatedResult);

const calculate = () => {
  if (verbrauch.value === '' || isNaN(parseFloat(verbrauch.value))) {
     alert("Bitte gültigen Verbrauchsfaktor eingeben.");
     return;
  }
  store.updateFormData({ verbrauch: parseFloat(verbrauch.value) });
  store.performCalculation();
  calculationDone.value = true; // Markiere Berechnung als erfolgt
};

const goToNext = () => {
     if (!calculationDone.value) {
         alert("Bitte führen Sie zuerst die Berechnung durch (Klick auf 'Berechnen').");
         return;
     }
    store.goToStep('step-4-email');
}
</script>

<template>
  <div>
    <h3 class="h5 text-center mb-4">Schritt 3: Beispiel-Berechnung</h3>
     <form @submit.prevent="goToNext"> <!-- Weiter-Button löst Submit aus -->
        <div class="mb-3">
             <label for="verbrauch" class="form-label">Fiktiver Verbrauchsfaktor (z.B. 1-10):</label>
             <div class="input-group">
                  <input type="number" class="form-control" id="verbrauch" v-model="verbrauch" placeholder="z.B. 5" required :disabled="calculationDone">
                  <button @click="calculate" type="button" class="btn btn-info" :disabled="calculationDone">
                      {{ calculationDone ? 'Berechnet' : 'Berechnen' }}
                  </button>
             </div>
        </div>

        <!-- Ergebnis-Anzeige mit Bootstrap Alert -->
        <div v-if="anzeigeErgebnis" class="alert alert-info mt-4 text-center" role="alert">
             <span class="fw-semibold">Simulierte Heizlast: {{ anzeigeErgebnis }} kW</span>
        </div>

        <div class="d-flex justify-content-between mt-4">
          <button @click="store.goBack()" type="button" class="btn btn-secondary">Zurück</button>
          <!-- Weiter-Button ist der Submit-Button des Formulars -->
           <button type="submit" class="btn btn-primary" :class="{'disabled': !calculationDone}" :disabled="!calculationDone">
              Weiter zur E-Mail
          </button>
        </div>
     </form>
  </div>
</template>

<style scoped>
  .disabled { /* Eigene Klasse für besseres Styling von disabled Buttons */
    opacity: 0.65;
    cursor: not-allowed;
  }
</style>