<script setup>
import { ref } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';
const store = useCalculatorStore();

const heizungsart = ref(store.formData.heizungsart ?? 'Heizkörper'); // Default
const warmwasser = ref(store.formData.warmwasser ?? 'zentral'); // Default

const goNext = () => {
    store.updateFormData({
        heizungsart: heizungsart.value,
        warmwasser: warmwasser.value
    });
    store.goToStep('step-energy-5-personen'); // Nächster Schritt S5
}
</script>

<template>
    <div>
        <h3 class="h5 text-center mb-4">Schritt 4: Wärmeverteilung & Warmwasser</h3>
        <form @submit.prevent="goNext">
            {/* Heizkörper / FBH */}
            <div class="mb-3">
                <label class="form-label d-block" title="Wie wird die Wärme in den Räumen verteilt?">Heizflächen:</label>
                 <div class="form-check">
                    <input class="form-check-input" type="radio" name="heizungsartRadio" id="heizartHK" value="Heizkörper" v-model="heizungsart">
                    <label class="form-check-label" for="heizartHK">Nur Heizkörper</label>
                </div>
                 <div class="form-check">
                    <input class="form-check-input" type="radio" name="heizungsartRadio" id="heizartFBH" value="FBH" v-model="heizungsart">
                    <label class="form-check-label" for="heizartFBH">Nur Fußbodenheizung</label>
                </div>
                 <div class="form-check">
                    <input class="form-check-input" type="radio" name="heizungsartRadio" id="heizartBeides" value="Beides" v-model="heizungsart">
                    <label class="form-check-label" for="heizartBeides">Beides (Heizkörper und Fußbodenheizung)</label>
                </div>
            </div>

            {/* Warmwasser */}
            <div class="mb-3">
                <label class="form-label d-block" title="Wird das warme Wasser für Bad/Küche zentral durch die Hauptheizung oder dezentral (z.B. Durchlauferhitzer) erzeugt?">Warmwasserbereitung:</label>
                 <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="wwRadio" id="wwZentral" value="zentral" v-model="warmwasser">
                    <label class="form-check-label" for="wwZentral">Zentral (über Heizung)</label>
                </div>
                 <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="wwRadio" id="wwDezentral" value="dezentral" v-model="warmwasser">
                    <label class="form-check-label" for="wwDezentral">Dezentral (z.B. elektrisch)</label>
                </div>
            </div>

            <div class="d-flex justify-content-between mt-4">
                 <button @click="store.goBack()" type="button" class="btn btn-secondary">Zurück</button>
                <button type="submit" class="btn btn-primary">Weiter</button>
            </div>
        </form>
    </div>
</template>