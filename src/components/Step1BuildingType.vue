<script setup>
import { useCalculatorStore } from '@/stores/calculator';
const store = useCalculatorStore();
const selectType = (type) => store.setBuildingType(type);
</script>

<template>
  <div>
    <h3 class="h5 text-center mb-4">Schritt 1: Wählen Sie den Gebäudetyp</h3>
    <div class="row g-3 justify-content-center">
      <!-- Option EFH -->
      <div class="col-12 col-sm-6 col-md-4">
        <div @click="selectType('efh')" class="card h-100 text-center building-option">
          <div class="card-body d-flex flex-column align-items-center">
             <img src="/images/efh.png" alt="Einfamilienhaus" class="building-image mb-2">
             <span class="building-label mt-auto">Einfamilienhaus</span>
          </div>
        </div>
      </div>
      <!-- Option MFH -->
       <div class="col-12 col-sm-6 col-md-4">
        <div @click="selectType('mfh')" class="card h-100 text-center building-option">
          <div class="card-body d-flex flex-column align-items-center">
             <img src="/images/mfh.png" alt="Mehrfamilienhaus" class="building-image mb-2">
             <span class="building-label mt-auto">Mehrfamilienhaus</span>
          </div>
        </div>
      </div>
      <!-- Option Gewerbe -->
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
.building-option {
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.building-option:hover {
   transform: translateY(-5px);
   box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15); /* Bootstrap shadow-lg */
}
.building-image {
   max-height: 80px; /* Höhe begrenzen */
   width: auto;
   max-width: 100%;
   object-fit: contain;
   background-color: #eee; /* Fallback */
   border-radius: 0.25rem; /* Bootstrap rounded-sm */
}
.building-label {
   font-weight: 500; /* Bootstrap fw-medium */
}
</style>