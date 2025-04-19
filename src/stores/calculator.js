import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCalculatorStore = defineStore('calculator', () => {
  // --- STATE ---
  const currentStepId = ref('step-1');
  const formData = ref({});
  const stepHistory = ref(['step-1']);
  const calculatedResult = ref(null);

  // --- GETTERS (Computed Properties) ---
  const currentStepComponent = computed(() => {
    switch (currentStepId.value) {
      case 'step-1': return 'Step1BuildingType';
      case 'step-2-efh': return 'Step2Efh';
      case 'step-2a-mfh': return 'Step2MfhA';
      case 'step-2b-mfh': return 'Step2MfhB';
      case 'step-2c-mfh': return 'Step2MfhC';
      case 'step-2a-gewerbe': return 'Step2GewerbeA';
      case 'step-2b-gewerbe': return 'Step2GewerbeB';
      case 'step-2c-gewerbe': return 'Step2GewerbeC';
      case 'step-3-calc': return 'Step3Calculation';
      case 'step-4-email': return 'Step4Email';
      case 'step-success': return 'StepSuccess';
      default: return null;
    }
  });

  const logicalPathLengths = { efh: 4, mfh: 6, gewerbe: 6 };
  const currentPathTotalSteps = computed(() => logicalPathLengths[formData.value.hausTyp] || 0);
  const currentLogicalStep = computed(() => stepHistory.value.length);
  // Für Anzeige (Schritt 1 nicht mitzählen)
  const displayCurrentStep = computed(() => currentLogicalStep.value > 1 ? currentLogicalStep.value - 1 : 0);
  const displayTotalSteps = computed(() => currentPathTotalSteps.value > 1 ? currentPathTotalSteps.value - 1 : 0);


  // --- ACTIONS (Methoden) ---
  function goToStep(stepId) {
    if (stepHistory.value[stepHistory.value.length - 1] !== stepId) {
        stepHistory.value.push(stepId);
    }
    currentStepId.value = stepId;
    if (stepId !== 'step-3-calc') calculatedResult.value = null;
  }

  function goBack() {
    if (stepHistory.value.length > 1) {
      stepHistory.value.pop();
      currentStepId.value = stepHistory.value[stepHistory.value.length - 1];
      if (currentStepId.value !== 'step-3-calc') calculatedResult.value = null;
    }
  }

  function setBuildingType(type) {
    formData.value = { hausTyp: type };
    stepHistory.value = ['step-1'];
    let nextStepId = '';
    if (type === 'efh') nextStepId = 'step-2-efh';
    else if (type === 'mfh') nextStepId = 'step-2a-mfh';
    else if (type === 'gewerbe') nextStepId = 'step-2a-gewerbe';
    goToStep(nextStepId);
  }

 function updateFormData(data) {
   // Konsolidiert die Fläche unter dem Key 'flaeche'
   const { 'flaeche-efh': flaecheEfh, 'flaeche-mfh': flaecheMfh, 'flaeche-gewerbe': flaecheGewerbe, ...restData } = data;
   const flaeche = flaecheEfh ?? flaecheMfh ?? flaecheGewerbe ?? formData.value.flaeche; // Nimm den Wert, der da ist

   formData.value = { ...formData.value, ...restData, flaeche }; // Speichere konsolidierte Daten
   console.log("FormData updated:", formData.value);
 }

  function performCalculation() {
    const flaeche = formData.value.flaeche || 0;
    const verbrauchFaktor = formData.value.verbrauch || 0;
    const heizlast = (flaeche * verbrauchFaktor * 0.05).toFixed(2);
    calculatedResult.value = heizlast;
    updateFormData({ berechneteHeizlast: heizlast });
    console.log("Berechnung durchgeführt:", heizlast);
    return heizlast;
  }

  function submitFinal() {
    console.log("Finale Daten zum Senden:", formData.value);
    goToStep('step-success');
  }

  return {
    currentStepId, formData, stepHistory, calculatedResult,
    currentStepComponent, currentPathTotalSteps, currentLogicalStep, displayCurrentStep, displayTotalSteps,
    goToStep, goBack, setBuildingType, updateFormData, performCalculation, submitFinal,
  };
});