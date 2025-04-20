<script setup>
import { ref } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';
const store = useCalculatorStore();

const anzahlPersonen = ref(store.formData.anzahlPersonen ?? 1); // Default 1

const goNext = () => {
    store.updateFormData({ anzahlPersonen: parseInt(anzahlPersonen.value) || 1 });
    // Hier könnte der letzte Schritt sein, der zu Success führt
    store.completeEnergyProcess(); // Nächster Schritt S6 (Success)
}
</script>

<template>
     <div>
        <h3 class="h5 text-center mb-4">Schritt 5: Anzahl Personen</h3>
        <form @submit.prevent="goNext">
            <div class="mb-3">
                <label for="anzahlPersonenSelect" class="form-label" title="Wie viele Personen leben dauerhaft im Gebäude? Wichtig für Warmwasserverbrauch.">Personen im Gebäude:</label>
                <select class="form-select" id="anzahlPersonenSelect" v-model="anzahlPersonen">
                    <option value="1">1 Person</option>
                    <option value="2">2 Personen</option>
                    <option value="3">3 Personen</option>
                    <option value="4">4 Personen</option>
                    <option value="5">5 Personen</option>
                    <option value="6">6+ Personen</option> {/* Optional: Mehr */}
                </select>
            </div>

            <div class="d-flex justify-content-between mt-4">
                 <button @click="store.goBack()" type="button" class="btn btn-secondary">Zurück</button>
                 {/* Dieser Button löst den submit des Formulars aus -> goNext() */}
                <button type="submit" class="btn btn-primary">Angaben abschließen</button>
            </div>
        </form>
    </div>
</template>