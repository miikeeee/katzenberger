// src/stores/calculator.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCalculatorStore = defineStore('calculator', () => {
  // --- STATE ---
  const currentStepId = ref('step-1');
  const formData = ref({});
  const stepHistory = ref(['step-1']);
  const calculatedResult = ref(null);
  // NEU: Upload Status
  const isUploading = ref(false);
  const uploadError = ref('');
  const uploadResponseData = ref(null); // Um Daten von der Upload-API zu speichern

  // --- GETTERS ---
  const componentMap = {
    'step-1': 'Step1BuildingType',
    'step-2-efh': 'Step2Efh',
    'step-2a-mfh': 'Step2MfhA',
    'step-2b-mfh': 'Step2MfhB',
    'step-2c-mfh': 'Step2MfhC',
    'step-2a-gewerbe': 'Step2GewerbeA',
    'step-2b-gewerbe': 'Step2GewerbeB',
    'step-2c-gewerbe': 'Step2GewerbeC',
    'step-3-calc': 'Step3Calculation',
    'step-4-email': 'Step4Email',
    'step-success': 'StepSuccess',
    // NEU: Schritte für Heizkörper
    'step-heizkoerper-upload': 'StepHeizkoerperUpload', // Neuer Upload-Schritt
    'step-heizkoerper-success': 'StepHeizkoerperSuccess' // Eigene Erfolgsseite
  };
  const currentStepComponent = computed(() => componentMap[currentStepId.value] || null);

  const logicalPathLengths = { efh: 4, mfh: 6, gewerbe: 6, heizkoerper: 3 }; // Länge für Heizkörper anpassen (Upload -> Success)
  const currentPathTotalSteps = computed(() => logicalPathLengths[formData.value.hausTyp] || 0);
  const currentLogicalStep = computed(() => stepHistory.value.length);
  const displayCurrentStep = computed(() => currentLogicalStep.value > 1 ? currentLogicalStep.value - 1 : 0);
  const displayTotalSteps = computed(() => currentPathTotalSteps.value > 1 ? currentPathTotalSteps.value - 1 : 0);

  // --- ACTIONS ---
  function goToStep(stepId) {
    if(!componentMap[stepId]) { console.error("Ungültige Step ID:", stepId); return; }
    if (stepHistory.value[stepHistory.value.length - 1] !== stepId) {
        stepHistory.value.push(stepId);
    }
    currentStepId.value = stepId;
    // Reset Status für nächste Schritte (außer Calc)
    if (stepId !== 'step-3-calc') calculatedResult.value = null;
    uploadError.value = ''; // Fehler bei Navigation zurücksetzen
    uploadResponseData.value = null;
  }

  function goBack() {
    if (stepHistory.value.length > 1) {
      stepHistory.value.pop();
      const prevStepId = stepHistory.value[stepHistory.value.length - 1];
      currentStepId.value = prevStepId;
      if (currentStepId.value !== 'step-3-calc') calculatedResult.value = null;
      uploadError.value = '';
      uploadResponseData.value = null;
    }
  }

  function setBuildingType(type) {
    // Reset für neuen Flow (außer Typ)
    formData.value = { hausTyp: type };
    stepHistory.value = ['step-1'];
    calculatedResult.value = null;
    isUploading.value = false;
    uploadError.value = '';
    uploadResponseData.value = null;

    let nextStepId = '';
    if (type === 'efh') nextStepId = 'step-2-efh';
    else if (type === 'mfh') nextStepId = 'step-2a-mfh';
    else if (type === 'gewerbe') nextStepId = 'step-2a-gewerbe';
    else if (type === 'heizkoerper') nextStepId = 'step-heizkoerper-upload'; // Zum neuen Schritt
    else { console.error("Unbekannter Gebäudetyp:", type); return; }
    goToStep(nextStepId);
  }

  function updateFormData(data) { /* ... wie vorher ... */
    const { 'flaeche-efh': flaecheEfh, 'flaeche-mfh': flaecheMfh, 'flaeche-gewerbe': flaecheGewerbe, ...restData } = data;
    let flaeche = formData.value.flaeche;
    if (flaecheEfh !== undefined) flaeche = flaecheEfh;
    else if (flaecheMfh !== undefined) flaeche = flaecheMfh;
    else if (flaecheGewerbe !== undefined) flaeche = flaecheGewerbe;
    formData.value = { ...formData.value, ...restData, flaeche };
  }

  function performCalculation() { /* ... wie vorher ... */
    const flaeche = parseFloat(formData.value.flaeche) || 0;
    const verbrauchFaktor = parseFloat(formData.value.verbrauch) || 0;
    const heizlast = (flaeche * verbrauchFaktor * 0.05).toFixed(2);
    calculatedResult.value = heizlast;
    updateFormData({ berechneteHeizlast: heizlast });
    return heizlast;
  }

  function submitFinal() { /* ... wie vorher (für Standard-Erfolg) ... */
    // Dieser wird für den Heizkörper-Flow nicht direkt genutzt
    goToStep('step-success');
  }

  // NEU: Aktionen für Upload-Status
  function setUploading(status) {
      isUploading.value = status;
  }
  function setUploadError(message) {
      uploadError.value = message;
  }
   function setUploadResponse(data) {
      uploadResponseData.value = data;
  }
   // NEU: Aktion nach erfolgreichem Upload (wird von Komponente aufgerufen)
  function finalizeHeizkoerperFlow() {
      goToStep('step-heizkoerper-success');
  }


  return {
    // State
    currentStepId, formData, stepHistory, calculatedResult,
    isUploading, uploadError, uploadResponseData,
    // Getters
    currentStepComponent, currentPathTotalSteps, currentLogicalStep, displayCurrentStep, displayTotalSteps,
    // Actions
    goToStep, goBack, setBuildingType, updateFormData, performCalculation, submitFinal,
    setUploading, setUploadError, setUploadResponse, finalizeHeizkoerperFlow, // Neue Actions exportieren
  };
});