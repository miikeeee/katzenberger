<script setup>
import { ref, computed } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';
import axios from 'axios';

const store = useCalculatorStore();
const selectedFile = ref(null);
const fileInputKey = ref(Date.now()); // Um Input zurücksetzen zu können

// Computed Refs für Lade-/Fehlerstatus aus dem Store
const isLoading = computed(() => store.isUploading);
const errorMessage = computed(() => store.uploadError);

const handleFileUpload = (event) => {
  store.setUploadError(''); // Fehler zurücksetzen bei neuer Auswahl
  if (event.target.files && event.target.files[0]) {
    selectedFile.value = event.target.files[0];
    console.log('Datei ausgewählt:', selectedFile.value.name);
  } else {
    selectedFile.value = null;
  }
};

const uploadFile = async () => {
  if (!selectedFile.value) {
    store.setUploadError("Bitte zuerst eine Datei auswählen.");
    return;
  }

  const formDataApi = new FormData();
  // 'fileToUpload' ist der Key, den das Backend (formidable) erwartet
  formDataApi.append('fileToUpload', selectedFile.value);
  // Optional weitere Daten mitschicken
  formDataApi.append('uploadContext', 'heizkoerper');

  store.setUploading(true); // Ladeanzeige starten
  store.setUploadError('');   // Alten Fehler löschen

  try {
    // Sende an den NEUEN API Endpunkt
    const response = await axios.post('/api/upload-heizkoerper', formDataApi, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Upload API Response:', response.data);
    store.setUploadResponse(response.data); // Speichere Antwort vom Backend
    // WICHTIG: Backend hat erfolgreich geantwortet -> Gehe zum Success-Schritt
    store.finalizeHeizkoerperFlow();

  } catch (error) {
    console.error("Fehler beim Upload:", error);
    let msg = 'Ein Fehler ist beim Upload aufgetreten.';
    if (error.response && error.response.data && error.response.data.message) {
        msg = `Fehler: ${error.response.data.message}`;
    } else if (error.request) {
        msg = 'Keine Antwort vom Server erhalten. Bitte prüfen Sie Ihre Verbindung.';
    }
    store.setUploadError(msg);
  } finally {
    store.setUploading(false); // Ladeanzeige beenden
    // Input zurücksetzen, damit gleiche Datei erneut gewählt werden kann
    selectedFile.value = null;
    fileInputKey.value = Date.now();
  }
};
</script>

<template>
  <div>
    <h3 class="h5 text-center mb-4">Schritt 2: Heizkörper Daten hochladen</h3>
    <p class="text-center text-muted small mb-3">
      Bitte laden Sie eine Datei (z.B. PDF, Bild) mit Informationen zu Ihrem Heizkörper hoch.
    </p>

    <!-- Fehlermeldung -->
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="uploadFile">
      <div class="mb-3">
        <label for="heizkoerperFile" class="form-label">Datei auswählen:</label>
        <input class="form-control" type="file" id="heizkoerperFile" @change="handleFileUpload" :key="fileInputKey" accept=".pdf,.jpg,.jpeg,.png" :disabled="isLoading">
        <div v-if="selectedFile" class="form-text">Ausgewählt: {{ selectedFile.name }}</div>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-4">
        <button @click="store.goBack()" type="button" class="btn btn-secondary" :disabled="isLoading">Zurück</button>
        <button type="submit" class="btn btn-primary" :disabled="isLoading || !selectedFile">
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ isLoading ? 'Wird hochgeladen...' : 'Datei hochladen & Weiter' }}
        </button>
      </div>
    </form>
  </div>
</template>