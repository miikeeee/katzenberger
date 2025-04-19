<script setup>
import { useCalculatorStore } from '@/stores/calculator';
const store = useCalculatorStore();
// selectType ruft nur noch die Store Action auf
const selectType = (type) => store.setBuildingType(type);
</script>

<template>
  <div>
    <h3 class="h5 text-center mb-4">Schritt 1: Wählen Sie Ihr Anliegen</h3>
    <div class="row g-3 justify-content-center">
      {/* ... EFH, MFH, Gewerbe Optionen wie vorher ... */}
      <div class="col-12 col-sm-6 col-md-4 col-lg-3"> {/* Angepasst für 4 Elemente */}
           <div @click="selectType('efh')" class="card h-100 text-center building-option">
             <div class="card-body d-flex flex-column align-items-center">
                <img src="/images/efh.png" alt="Einfamilienhaus" class="building-image mb-2">
                <span class="building-label mt-auto">Heizlast EFH</span>
             </div>
           </div>
         </div>
          <div class="col-12 col-sm-6 col-md-4 col-lg-3">
           <div @click="selectType('mfh')" class="card h-100 text-center building-option">
             <div class="card-body d-flex flex-column align-items-center">
                <img src="/images/mfh.png" alt="Mehrfamilienhaus" class="building-image mb-2">
                <span class="building-label mt-auto">Heizlast MFH</span>
             </div>
           </div>
         </div>
          <div class="col-12 col-sm-6 col-md-4 col-lg-3">
           <div @click="selectType('gewerbe')" class="card h-100 text-center building-option">
             <div class="card-body d-flex flex-column align-items-center">
                <img src="/images/gewerbe.png" alt="Gewerbe" class="building-image mb-2">
                <span class="building-label mt-auto">Heizlast Gewerbe</span>
             </div>
           </div>
         </div>

      {/* NEU: Heizkörper Option */}
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div @click="selectType('heizkoerper')" class="card h-100 text-center building-option">
          <div class="card-body d-flex flex-column align-items-center">
             {/* Erstelle ein passendes Bild: /public/images/heizkoerper.png */}
            <img src="/images/heizkoerper.png" alt="Heizkörper Upload" class="building-image mb-2">
            <span class="building-label mt-auto">Heizkörper Info Upload</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
 /* Styling wie vorher */
 .building-option { cursor: pointer; transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; }
 .building-option:hover { transform: translateY(-5px); box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15); }
 .building-image { max-height: 70px; /* Evtl. etwas kleiner für 4 Optionen */ width: auto; max-width: 100%; object-fit: contain; background-color: #eee; border-radius: 0.25rem; }
 .building-label { font-weight: 500; font-size: 0.9rem; /* Evtl. Schrift kleiner */ }
</style>