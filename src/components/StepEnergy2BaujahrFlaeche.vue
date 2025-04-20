<script setup>
import { ref } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';
const store = useCalculatorStore();
const baujahr = ref(store.formData.baujahrEnergy ?? '');
const flaeche = ref(store.formData.flaecheEnergy ?? '');

const goNext = () => {
    if (!baujahr.value || !flaeche.value) {
        alert("Bitte beide Felder ausfüllen."); return;
    }
    store.updateFormData({
        baujahrEnergy: parseInt(baujahr.value) || null,
        flaecheEnergy: parseFloat(flaeche.value) || null
    });
    store.goToStep('step-energy-3-verbrauch'); // Nächster Schritt S3
}
</script>

<template>
    <div>
        <h3 class="h5 text-center mb-4">Schritt 2: Baujahr & Fläche</h3>
        <form @submit.prevent="goNext">
            <div class="mb-3">
                <label for="baujahrEnergy" class="form-label" title="Ungefähres Jahr, in dem das Gebäude errichtet wurde.">Baujahr:</label>
                <input type="number" class="form-control" id="baujahrEnergy" v-model="baujahr" placeholder="z.B. 1985" required min="1800" max="2025">
            </div>
            <div class="mb-3">
                <label for="flaecheEnergy" class="form-label" title="Gesamte beheizte Wohn- oder Nutzfläche in Quadratmetern.">Beheizte Fläche (m²):</label>
                <input type="number" class="form-control" id="flaecheEnergy" v-model="flaeche" placeholder="z.B. 150" required min="10">
            </div>
            <div class="d-flex justify-content-between mt-4">
                 <button @click="store.goBack()" type="button" class="btn btn-secondary">Zurück</button>
                <button type="submit" class="btn btn-primary">Weiter</button>
            </div>
        </form>
    </div>
</template>