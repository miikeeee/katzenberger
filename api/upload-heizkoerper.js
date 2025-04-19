// api/upload-heizkoerper.js
import { formidable } from 'formidable';
import axios from 'axios';
import { put } from '@vercel/blob';

// WICHTIG: Body Parser deaktivieren für File Uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = formidable({ keepExtensions: true }); // keepExtensions ist nützlich

  try {
    const [fields, files] = await form.parse(request);

    const context = fields.uploadContext ? fields.uploadContext[0] : 'unknown'; // Kontext auslesen
    const uploadedFile = files.fileToUpload ? files.fileToUpload[0] : null; // Key 'fileToUpload' aus FormData

    if (!uploadedFile) {
      return response.status(400).json({ message: 'Keine Datei im Upload gefunden (erwartet "fileToUpload").' });
    }

    console.log(`INFO: Datei empfangen für Kontext "${context}": ${uploadedFile.originalFilename} (${uploadedFile.size} bytes)`);

    // HIER: Zukünftig Datei in Cloud speichern (Vercel Blob, S3 etc.)
    // const fileUrl = await saveToCloud(uploadedFile.filepath, uploadedFile.originalFilename);
    // console.log(`INFO: Datei gespeichert unter ${fileUrl}`);

    // Webhook triggern
    const webhookUrl = process.env.HEIZKOERPER_WEBHOOK_URL; // Eigene Env Variable!
    if (!webhookUrl) {
        console.error("FEHLER: HEIZKOERPER_WEBHOOK_URL nicht auf Vercel gesetzt!");
        // Fehler zurückgeben, da der Kernprozess nicht starten kann
        return response.status(500).json({ message: 'Webhook-Konfiguration serverseitig unvollständig.' });
    }

    // Daten an den Webhook senden (NICHT die Datei selbst!)
    const webhookPayload = {
        event: 'heizkoerper_upload_received',
        filename: uploadedFile.originalFilename,
        mimeType: uploadedFile.mimetype,
        sizeBytes: uploadedFile.size,
        // fileUrl: fileUrl, // URL aus Cloud-Speicher mitsenden
        uploadContext: context,
        // weitere Daten aus 'fields' hier hinzufügen, falls nötig
    };

    console.log(`INFO: Trigger Heizkörper Webhook: ${webhookUrl}`);
    // Warten auf die Antwort vom Webhook-Trigger selbst (nicht auf Make.com!)
    const webhookResponse = await axios.post(webhookUrl, webhookPayload);
    console.log(`INFO: Webhook Trigger Response Status: ${webhookResponse.status}`);

    // Erfolgreiche Antwort an das Frontend senden, da der Trigger angenommen wurde
    // Hier KÖNNTE man Daten aus der webhookResponse zurücksenden, falls Make.com was liefert
    return response.status(200).json({
        message: 'Datei erfolgreich empfangen und Verarbeitung angestoßen.',
        filename: uploadedFile.originalFilename
    });

  } catch (error) {
    console.error("FEHLER bei Datei-Upload / Webhook:", error);
    return response.status(500).json({ message: 'Serverfehler bei der Dateiverarbeitung.' });
  }
}