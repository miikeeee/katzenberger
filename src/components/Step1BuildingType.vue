<script setup>
import { useCalculatorStore } from '@/stores/calculator';
import axios from 'axios'; // Importieren (stelle sicher, dass es installiert ist: npm install axios)

const store = useCalculatorStore();

const selectType = async (type) => { // Die Funktion wird 'async'
  // 1. Zuerst den Store aktualisieren, damit die UI weitergeht
  store.setBuildingType(type);

  // 2. NUR wenn Einfamilienhaus geklickt wurde:
  if (type === 'efh') {
    console.log("EFH geklickt - Versuche Webhook zu triggern...");
    try {
      // 3. Sende eine Anfrage an UNSERE Serverless Function
      // Der Pfad /api/trigger-efh-webhook wird von Vercel automatisch an die Datei gemappt
      const response = await axios.post('/api/trigger-efh-webhook', {
         // Optional: Daten, die die Serverless Function evtl. braucht
         clickSource: 'frontend'
      });
      // Logge die Antwort vom *unserem* Server (nicht vom Webhook selbst)
      console.log("Antwort von /api/trigger-efh-webhook:", response.data.message);
    } catch (error) {
      // Logge Fehler, falls unser eigener API-Endpunkt nicht erreichbar ist
      console.error("Fehler beim Aufruf von /api/trigger-efh-webhook:", error.message);
      // Wichtig: Der Fehler hier sollte den Nutzer nicht aufhalten.
    }
  }
};
</script>

<template>
  <!-- Dein Template bleibt hier unverändert -->
  <div>
    <h3 class="h5 text-center mb-4">Schritt 1: Wählen Sie den Gebäudetyp</h3>
    <div class="row g-3 justify-content-center">
      <div class="col-12 col-sm-6 col-md-4">
        <div @click="selectType('efh')" class="card h-100 text-center building-option">
          <div class="card-body d-flex flex-column align-items-center">
            <img src="/images/efh.png" alt="Einfamilienhaus" class="building-image mb-2">
            <span class="building-label mt-auto">Einfamilienhaus</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <div @click="selectType('mfh')" class="card h-100 text-center building-option">
          <div class="card-body d-flex flex-column align-items-center">
            <img src="/images/mfh.png" alt="Mehrfamilienhaus" class="building-image mb-2">
            <span class="building-label mt-auto">Mehrfamilienhaus</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
         <div @click="selectType('gewerbe')" class="card h-100 text-center building-option">
           <div class="card-body d-flex flex-column align-items-center">
              <img src="/images/gewerbe.png" alt="Gewerbe" class="building-image mb-2">
              <span class="building-label mt-auto">Gewerbe</span>
           </div>
         </div>
       </div>
    </div>
  </div>
</template>

<style scoped>
  .building-option { cursor: pointer; transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; }
  .building-option:hover { transform: translateY(-5px); box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15); }
  .building-image { max-height: 80px; width: auto; max-width: 100%; object-fit: contain; background-color: #eee; border-radius: 0.25rem; }
  .building-label { font-weight: 500; }
</style>