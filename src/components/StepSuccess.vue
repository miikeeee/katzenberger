<script setup>
import { computed } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';

const store = useCalculatorStore();

// Bereinige formData für die Anzeige (entferne interne/redundante Keys)
const displayData = computed(() => {
  const data = {};
  for (const key in store.formData) {
    if (!key.startsWith('flaeche-') && key !== 'berechneteHeizlast') { // Beispiel-Filter
       if (store.formData[key] !== null && store.formData[key] !== '') {
          data[key] = store.formData[key];
       }
    }
  }
  // Füge Typ lesbar hinzu, falls nicht schon da
  if (!data.hausTyp && store.formData.hausTyp) data.hausTyp = store.formData.hausTyp;
  return data;
});

// Funktion zum Neustarten (optional)
const restart = () => {
    store.goToStep('step-1'); // Gehe zurück zum Start
    store.formData = {}; // Optional: Daten komplett löschen
    store.stepHistory = ['step-1']; // History resetten
}

</script>

<template>
  <div>
    <h3 class="h5 text-center text-success mb-3">✓ Vielen Dank!</h3>
    <p class="text-center">Ihre Anfrage wird bearbeitet.</p>
    <p class="text-center">
      Die (simulierte) Heizlastberechnung
      (<span v-if="store.calculatedResult">Ergebnis: <strong>{{ store.calculatedResult }} kW</strong></span>)
      wurde an <strong class="text-primary">{{ store.formData.email || 'Ihre E-Mail' }}</strong> gesendet.
    </p>
    <p class="text-center text-muted small mt-2 mb-3">
      (In der echten Version würden Sie hier zur Zahlung weitergeleitet und die E-Mail nach erfolgreicher Zahlung versendet).
    </p>

    <details class="mb-4">
        <summary class="text-center text-muted small" style="cursor: pointer;">Details der gesammelten Daten anzeigen</summary>
        <pre class="bg-light p-3 rounded mt-2 small" style="max-height: 200px; overflow-y: auto;">{{ JSON.stringify(displayData, null, 2) }}</pre>
    </details>

    <div class="text-center">
        <button @click="restart" class="btn btn-outline-secondary btn-sm">Neue Berechnung starten</button>
    </div>
  </div>
</template>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
details > summary {
  list-style: none; /* Entfernt Standard-Pfeil */
}
details > summary::-webkit-details-marker {
  display: none; /* Entfernt Standard-Pfeil für Webkit */
}

</style>