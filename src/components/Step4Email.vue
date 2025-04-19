<script setup>
import { ref } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';

const store = useCalculatorStore();
const email = ref(store.formData.email ?? '');

const submit = () => {
  const emailInput = document.getElementById('email'); // Für HTML5 Validierung
  if (!email.value || !emailInput.checkValidity()) {
    alert("Bitte geben Sie eine gültige E-Mail Adresse ein.");
    emailInput.reportValidity(); // Zeigt Browser-Validierungsnachricht an
    return;
  }
  store.updateFormData({ email: email.value });
  store.submitFinal(); // Löst den finalen Schritt aus
};
</script>

<template>
  <div>
    <h3 class="h5 text-center mb-4">Schritt 4: Ihre E-Mail</h3>
    <p class="text-center text-muted small mb-3">Geben Sie Ihre E-Mail-Adresse an, um das (simulierte) Ergebnis zu erhalten.</p>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label for="email" class="form-label">E-Mail:</label>
        <input type="email" class="form-control" id="email" v-model="email" required placeholder="ihre@email.de">
      </div>
      <div class="d-flex justify-content-between mt-4">
        <button @click="store.goBack()" type="button" class="btn btn-secondary">Zurück</button>
        <button type="submit" class="btn btn-primary">Anfrage (Simuliert) Senden</button>
      </div>
    </form>
  </div>
</template>