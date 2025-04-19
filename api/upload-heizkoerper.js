// api/upload-heizkoerper.js
import { formidable } from 'formidable';
import axios from 'axios';
import { put } from '@vercel/blob'; // Sicherstellen, dass es importiert ist

export const config = { api: { bodyParser: false } };

export default async function handler(request, response) {
  console.log("--- API /api/upload-heizkoerper aufgerufen ---"); // Start Log

  if (request.method !== 'POST') {
    console.warn("WARN: Falsche Methode:", request.method);
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = formidable({ keepExtensions: true, allowEmptyFiles: false }); // Wichtige Option

  try {
    console.log("INFO: Versuche Formular zu parsen...");
    const [fields, files] = await form.parse(request);
    console.log("INFO: Formular geparsed. Felder:", fields);
    console.log("INFO: Formular geparsed. Dateien:", files); // Logge das ganze files-Objekt

    // Überprüfe, ob die erwartete Datei vorhanden ist
    const uploadedFile = files.fileToUpload ? files.fileToUpload[0] : null;

    if (!uploadedFile || uploadedFile.size === 0) {
      console.error("FEHLER: Keine gültige Datei unter 'fileToUpload' gefunden oder Datei ist leer.", files);
      return response.status(400).json({ message: 'Keine gültige Datei im Upload gefunden (erwartet "fileToUpload").' });
    }

    const context = fields.uploadContext ? fields.uploadContext[0] : 'unknown';
    const originalFilename = uploadedFile.originalFilename || 'unknown_filename'; // Fallback
    console.log(`INFO: Gültige Datei empfangen für Kontext "${context}": ${originalFilename} (${uploadedFile.size} bytes)`);

    // Sicherer Dateiname für Blob Storage (Beispiel: Zeitstempel + Originalname ohne Sonderzeichen)
    const safeFilename = `${Date.now()}_${originalFilename.replace(/[^a-zA-Z0-9_.\-]/g, '_')}`;
    const blobPath = `heizkoerper_uploads/${safeFilename}`;

    // --- Vercel Blob Upload ---
    console.log(`INFO: Versuche Datei hochzuladen nach: ${blobPath}`);
    let blobUrl = null; // Initialisieren
    try {
        const blobResult = await put(
            blobPath,
            request, // Wichtig: Den originalen Request für den Stream übergeben
            {
                access: 'public',
                // addRandomSuffix: false, // Ist oft besser, Vercel den Suffix hinzufügen zu lassen, um Kollisionen zu vermeiden
                contentType: uploadedFile.mimetype // ContentType explizit setzen
            }
        );
        blobUrl = blobResult.url; // Die URL aus dem Ergebnis holen
        console.log(`INFO: Vercel Blob Upload erfolgreich! URL: ${blobUrl}`);
    } catch (blobError) {
        console.error("FEHLER beim Vercel Blob Upload:", blobError);
        // Hier den Fehler werfen, damit er im äußeren catch landet
        throw new Error(`Fehler beim Hochladen zu Vercel Blob: ${blobError.message}`);
    }
    // --- Ende Vercel Blob Upload ---


    // --- Webhook Trigger ---
    const webhookUrl = process.env.HEIZKOERPER_WEBHOOK_URL;
    if (!webhookUrl) {
        console.error("FEHLER: HEIZKOERPER_WEBHOOK_URL nicht auf Vercel gesetzt!");
        // Wichtig: Fehler zurückgeben, da Kernfunktionalität fehlt
        return response.status(500).json({ message: 'Webhook-Konfiguration serverseitig unvollständig.' });
    }

    const webhookPayload = {
        event: 'heizkoerper_upload_received',
        filename: originalFilename, // Originalname senden
        storedFilename: safeFilename, // Sicherer Name senden
        mimeType: uploadedFile.mimetype,
        sizeBytes: uploadedFile.size,
        fileUrl: blobUrl, // Die URL vom Blob Store
        uploadContext: context,
    };

    console.log(`INFO: Trigger Heizkörper Webhook: ${webhookUrl}`);
    try {
        const webhookResponse = await axios.post(webhookUrl, webhookPayload);
        console.log(`INFO: Webhook Trigger Response Status: ${webhookResponse.status}`);
    } catch (webhookError) {
        console.error("FEHLER beim Senden des Webhooks:", webhookError.message);
        // Fehler loggen, aber trotzdem Erfolg ans Frontend senden, da Upload geklappt hat? Oder Fehler melden?
        // Hier entscheiden wir uns, einen Fehler zu melden, da der Prozess unvollständig ist.
        throw new Error(`Webhook konnte nicht gesendet werden: ${webhookError.message}`);
    }
    // --- Ende Webhook Trigger ---


    // Wenn alles bis hierhin geklappt hat -> Erfolgreiche Antwort
    console.log("INFO: Alles erfolgreich abgeschlossen.");
    return response.status(200).json({
        message: 'Datei erfolgreich hochgeladen und Webhook ausgelöst.',
        filename: originalFilename,
        fileUrl: blobUrl
    });

  } catch (error) {
    // Fängt Fehler aus form.parse, put oder axios.post (wenn throw verwendet wird)
    console.error("FEHLER im API Handler:", error);
    return response.status(500).json({ message: `Serverfehler: ${error.message || 'Unbekannter Fehler'}` });
  }
}