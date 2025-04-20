// src/stores/calculator.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCalculatorStore = defineStore('calculator', () => {
  // --- STATE ---
  const currentStepId = ref('step-1'); // Startet immer noch bei der Hauptauswahl
  const formData = ref({}); // Wir nutzen weiterhin dasselbe Objekt
  const stepHistory = ref(['step-1']); // Beginnt bei der Hauptauswahl
  const calculatedResult = ref(null); // Für den alten Flow
  const isUploading = ref(false); // Für Upload-Flow
  const uploadError = ref('');
  const uploadResponseData = ref(null);

  // --- GETTERS ---
  const componentMap = {
    // Alter Flow (Beispielhaft)
    'step-1': 'Step1BuildingType', // Hauptauswahl bleibt
    'step-2-efh': 'Step2Efh',
    'step-heizkoerper-upload': 'StepHeizkoerperUpload',
    'step-heizkoerper-success': 'StepHeizkoerperSuccess',

    // NEUER Energy-Flow
    // S1 ist 'step-1', wo 'energy' gewählt wird (angenommen)
    'step-energy-1-gebaeudeart': 'StepEnergy1Gebaeudeart', // S1 des neuen Flows
    'step-energy-2-baujahr-flaeche': 'StepEnergy2BaujahrFlaeche', // S2
    'step-energy-3-verbrauch': 'StepEnergy3Verbrauch', // S3
    'step-energy-4-verteilung': 'StepEnergy4Verteilung', // S4
    'step-energy-5-personen': 'StepEnergy5Personen', // S5
    'step-energy-6-success': 'StepEnergy6Success' // S6
  };
  const currentStepComponent = computed(() => componentMap[currentStepId.value] || null);

  // Gesamtschritte für die Fortschrittsanzeige des *Energy*-Flows
  // S1 bis S5 sind Eingabeschritte = 5 Schritte
  const energyFlowTotalSteps = 5;

  // Wir brauchen einen Weg zu wissen, in welchem Flow wir sind
  // -> leiten wir vom formData.hausTyp oder einer neuen Variable ab
  const currentFlowType = computed(() => formData.value.flowType || null); // Z.B. 'heizlast', 'heizkoerper', 'energy'

  // Fortschritt (als Beispiel, angepasst an den Energy-Flow)
  // Zählt Schritte NACH der initialen Auswahl
  const displayCurrentStep = computed(() => {
      if (currentFlowType.value === 'energy') {
          // Finde den Index des aktuellen Schritts im definierten Flow
          const energySteps = [
              'step-energy-1-gebaeudeart',
              'step-energy-2-baujahr-flaeche',
              'step-energy-3-verbrauch',
              'step-energy-4-verteilung',
              'step-energy-5-personen'
          ];
          const currentIndex = energySteps.indexOf(currentStepId.value);
          return currentIndex >= 0 ? currentIndex + 1 : 0; // +1 weil 1-basiert
      }
      // Füge Logik für andere Flows hinzu, wenn benötigt
      return 0; // Default
  });
  const displayTotalSteps = computed(() => {
       if (currentFlowType.value === 'energy') {
           return energyFlowTotalSteps;
       }
       // Füge Logik für andere Flows hinzu
       return 0; // Default
  });
  const progressPercent = computed(() => {
      const total = displayTotalSteps.value;
      const current = displayCurrentStep.value;
      return total > 0 ? Math.round((current / total) * 100) : 0;
  });


  // --- ACTIONS ---
  function goToStep(stepId) {
     if(!componentMap[stepId]) { console.error("Ungültige Step ID:", stepId); return; }
     if (stepHistory.value[stepHistory.value.length - 1] !== stepId) {
         stepHistory.value.push(stepId);
     }
     currentStepId.value = stepId;
     uploadError.value = ''; // Reset bei Navigation
     // uploadResponseData.value = null; // Reset bei Navigation
  }

  function goBack() {
      if (stepHistory.value.length > 1) {
        const removedStep = stepHistory.value.pop();
        // Wenn wir vom ersten Schritt eines Flows zurückgehen, Flow-Typ löschen?
        if (removedStep === 'step-energy-1-gebaeudeart' || removedStep === 'step-2-efh' /* ...andere Startschritte... */ ) {
            updateFormData({ flowType: null }); // Reset Flow Type
        }
        currentStepId.value = stepHistory.value[stepHistory.value.length - 1];
        uploadError.value = '';
        uploadResponseData.value = null;
      }
   }

   // Anpassung: Wir brauchen eine initiale Auswahl, die den Flow bestimmt
   function selectFlow(flowType) {
       formData.value = { flowType: flowType }; // Setze den Flow-Typ
       stepHistory.value = ['step-1']; // Start der History
       calculatedResult.value = null;
       isUploading.value = false;
       uploadError.value = '';
       uploadResponseData.value = null;

       let nextStepId = '';
       if (flowType === 'energy') nextStepId = 'step-energy-1-gebaeudeart';
       else if (flowType === 'heizkoerper') nextStepId = 'step-heizkoerper-upload';
       // ... (füge hier die Startschritte der alten Flows hinzu, falls Step1BuildingType jetzt anders genutzt wird) ...
       else { console.error("Unbekannter Flow-Typ:", flowType); return; }
       goToStep(nextStepId); // Navigiere zum ersten Schritt des gewählten Flows
   }


  function updateFormData(data) {
    formData.value = { ...formData.value, ...data };
    console.log("FormData updated:", JSON.stringify(formData.value));
  }

  // ... (andere Actions wie performCalculation, submitFinal, setUploading etc. bleiben bestehen) ...
  function completeEnergyProcess() {
        goToStep('step-energy-6-success'); // Zum neuen Erfolgsschirm
   }


  return {
    // State
    currentStepId, formData, stepHistory, calculatedResult,
    isUploading, uploadError, uploadResponseData,
    // Getters
    currentStepComponent, displayCurrentStep, displayTotalSteps, progressPercent, currentFlowType,
    // Actions
    goToStep, goBack, /*ersetze setBuildingType durch*/ selectFlow, updateFormData,
    /* performCalculation, submitFinal, */ // Alte Aktionen ggf. noch nötig
    setUploading, setUploadError, setUploadResponse, /* finalizeHeizkoerperFlow, */ // Alte Aktionen ggf. noch nötig
    completeEnergyProcess, // Neue Action
  };
});