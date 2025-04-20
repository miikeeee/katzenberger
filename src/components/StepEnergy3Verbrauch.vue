<script setup>
import { ref, computed } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';
const store = useCalculatorStore();

const energietraeger = ref(store.formData.energietraeger ?? 'Gas');
const brennwertHeizwert = ref(store.formData.brennwertHeizwert ?? 'Brennwert');
const verbrauchBekannt = ref(store.formData.energieverbrauch !== undefined && store.formData.energieverbrauch !== null); // Merkt sich, ob Wert bekannt war
const energieverbrauch = ref(store.formData.energieverbrauch ?? '');
const anzahlMieter = ref(store.formData.anzahlMieter ?? '');

// Computed Property, um zu entscheiden, ob Mieterfeld angezeigt wird
const showMieterInput = computed(() => !verbrauchBekannt.value);

// Wenn Auswahl geändert wird, Energieverbrauch ggf. zurücksetzen
const toggleVerbrauchBekannt = () => {
    if (!verbrauchBekannt.value) {
        energieverbrauch.value = ''; // Lösche Verbrauch, wenn unbekannt gewählt
    } else {
         anzahlMieter.value = ''; // Lösche Mieter, wenn Verbrauch bekannt gewählt
    }
}

const goNext = () => {
    if (verbrauchBekannt.value && energieverbrauch.value === '') {
         alert("Bitte den Energieverbrauch eingeben."); return;
    }
     if (!verbrauchBekannt.value && anzahlMieter.value === '') {
         alert("Bitte die Anzahl der Mieter eingeben."); return;
    }

    store.updateFormData({
        energietraeger: energietraeger.value,
        brennwertHeizwert: brennwertHeizwert.value,
        energieverbrauch: verbrauchBekannt.value ? (parseFloat(energieverbrauch.value) || null) : null,
        anzahlMieter: !verbrauchBekannt.value ? (parseInt(anzahlMieter.value) || null) : null
    });
    store.goToStep('step-energy-4-verteilung'); // Nächster Schritt S4
}
</script>

<template>
    <div>
        <h3 class="h5 text-center mb-4">Schritt 3: Heizung & Verbrauch</h3>
        <form @submit.prevent="goNext">
            {/* Energieträger */}
            <div class="mb-3">
                <label class="form-label d-block" title="Womit wird derzeit hauptsächlich geheizt?">Energieträger / Derzeitige Heizung:</label>
                 <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="energietraegerRadio" id="heizungOel" value="Öl" v-model="energietraeger">
                    <label class="form-check-label" for="heizungOel">Öl</label>
                </div>
                 <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="energietraegerRadio" id="heizungGas" value="Gas" v-model="energietraeger">
                    <label class="form-check-label" for="heizungGas">Gas</label>
                </div>
                 {/* Weitere Optionen hier hinzufügen (Pellets, WP, etc.) */}
            </div>

             {/* Brennwert/Heizwert */}
            <div class="mb-3">
                 <label class="form-label d-block" title="Nutzt Ihre Heizung auch die Wärme im Abgas (Brennwert) oder nur die direkte Verbrennungswärme (Heizwert)? Moderne Heizungen sind meist Brennwertgeräte.">Technik (Öl/Gas):</label>
                 <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="wertRadio" id="wertBrennwert" value="Brennwert" v-model="brennwertHeizwert">
                    <label class="form-check-label" for="wertBrennwert">Brennwert</label>
                </div>
                 <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="wertRadio" id="wertHeizwert" value="Heizwert" v-model="brennwertHeizwert">
                    <label class="form-check-label" for="wertHeizwert">Heizwert</label>
                </div>
            </div>

            {/* Energieverbrauch */}
             <div class="mb-3">
                 <label class="form-label d-block" title="Kennen Sie Ihren jährlichen Energieverbrauch in Kilowattstunden (kWh)? Finden Sie auf Ihrer Heizkostenabrechnung.">Energieverbrauch:</label>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" :value="true" id="verbrauchJa" v-model="verbrauchBekannt" @change="toggleVerbrauchBekannt">
                    <label class="form-check-label" for="verbrauchJa">Ja, bekannt:</label>
                  </div>
                   <input v-if="verbrauchBekannt" type="number" class="form-control mt-1" id="energieverbrauchKWh" v-model="energieverbrauch" placeholder="Jährlicher Verbrauch in kWh" min="0" :required="verbrauchBekannt">

                   <div class="form-check mt-2">
                    <input class="form-check-input" type="radio" :value="false" id="verbrauchNein" v-model="verbrauchBekannt" @change="toggleVerbrauchBekannt">
                    <label class="form-check-label" for="verbrauchNein">Nein, unbekannt (Schätzung anhand Mieteranzahl):</label>
                  </div>
                  <input v-if="showMieterInput" type="number" class="form-control mt-1" id="anzahlMieter" v-model="anzahlMieter" placeholder="Anzahl Mieter/Bewohner" min="1" :required="showMieterInput">
            </div>


            <div class="d-flex justify-content-between mt-4">
                 <button @click="store.goBack()" type="button" class="btn btn-secondary">Zurück</button>
                <button type="submit" class="btn btn-primary">Weiter</button>
            </div>
        </form>
    </div>
</template>