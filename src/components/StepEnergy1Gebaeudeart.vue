<script setup>
import { ref } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';
const store = useCalculatorStore();
// Lokaler State für die Auswahl
const gebaeudeArt = ref(store.formData.gebaeudeArtEnergy ?? 'EFH'); // Default EFH

const goNext = () => {
    store.updateFormData({ gebaeudeArtEnergy: gebaeudeArt.value });
    store.goToStep('step-energy-2-baujahr-flaeche'); // Nächster Schritt S2
}
</script>

<template>
    <div>
        <h3 class="h5 text-center mb-4">Schritt 1: Gebäudeart</h3>
        <form @submit.prevent="goNext">
            <div class="mb-3">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="gebaeudeArtRadio" id="gebaeudeEFH" value="EFH" v-model="gebaeudeArt" checked>
                    <label class="form-check-label" for="gebaeudeEFH" title="Ein Haus für eine Familie oder Partei.">
                        Einfamilienhaus / Zweifamilienhaus
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="gebaeudeArtRadio" id="gebaeudeMFH" value="MFH" v-model="gebaeudeArt">
                    <label class="form-check-label" for="gebaeudeMFH" title="Ein Haus mit drei oder mehr Wohneinheiten.">
                        Mehrfamilienhaus
                    </label>
                </div>
                 <div class="form-check">
                    <input class="form-check-input" type="radio" name="gebaeudeArtRadio" id="gebaeudeGewerbe" value="Gewerbe" v-model="gebaeudeArt">
                    <label class="form-check-label" for="gebaeudeGewerbe" title="Gebäude für Büros, Läden, Werkstätten etc.">
                        Gewerbeimmobilie
                    </label>
                </div>
            </div>
            <div class="d-flex justify-content-end mt-4">
                {/* Kein Zurück-Button im ersten Schritt des Flows */}
                <button type="submit" class="btn btn-primary">Weiter</button>
            </div>
        </form>
    </div>
</template>