
<script setup>
import { computed } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';
const store = useCalculatorStore();

// Zeige relevante Daten aus diesem Flow
const displayData = computed(() => {
    const relevantKeys = ['gebaeudeArtEnergy', 'baujahrEnergy', 'flaecheEnergy', 'energietraeger', 'brennwertHeizwert', 'energieverbrauch', 'anzahlMieter', 'heizungsart', 'warmwasser', 'anzahlPersonen'];
    const data = {};
    relevantKeys.forEach(key => {
        if (store.formData[key] !== undefined && store.formData[key] !== null && store.formData[key] !== '') {
            data[key] = store.formData[key];
        }
    })
    return data;
});

const restart = () => {
    store.selectFlow(null); // Zurück zur Hauptauswahl (oder spezifischer Startpunkt)
    // Oder store.goToStep('step-1'); store.formData = {}; etc.
}
</script>

<template>
  <div>
    <h3 class="h5 text-center text-success mb-3">✓ Vielen Dank!</h3>
    <p class="text-center">
      Ihre Angaben wurden erfolgreich übermittelt.
    </p>
    <p class="text-center text-muted small mt-2 mb-3">
      (In einer echten Anwendung würden die Daten nun gespeichert und weiterverarbeitet.)
    </p>

    <details class="mb-4">
        <summary class="text-center text-muted small" style="cursor: pointer;">Ihre Angaben anzeigen</summary>
        <pre class="bg-light p-3 rounded mt-2 small" style="max-height: 200px; overflow-y: auto;">{{ JSON.stringify(displayData, null, 2) }}</pre>
    </details>

    <div class="text-center">
        <button @click="restart" class="btn btn-outline-secondary btn-sm">Neue Berechnung starten</button>
    </div>
  </div>
</template>

<style scoped>
pre { white-space: pre-wrap; word-wrap: break-word; }
details > summary { list-style: none; }
details > summary::-webkit-details-marker { display: none; }
</style>