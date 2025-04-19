// api/upload-heizkoerper.js
import { formidable } from 'formidable';
import axios from 'axios';
import { put } from '@vercel/blob';
import * as fs from 'node:fs'; // Empfohlener Import für Node.js Core Module

export const config = {
  api: {
    bodyParser: false, // Wichtig für formidable
  },
};

export default async function handler(request, response) {
  console.log("--- API /api/upload-heizkoerper aufgerufen ---");

  if (request.method !== 'POST') {
    console.warn("WARN: Falsche Methode:", request.method);
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = formidable({ keepExtensions: true, allowEmptyFiles: false });

  let tempFilePath = null; // Variable für den Pfad der temporären Datei

  try {
    console.log("INFO: Versuche Formular zu parsen...");
    const [fields, files] = await form.parse(request);
    // Logge die Struktur, um sicherzustellen, dass der Key passt
    // console.log("INFO: Formular geparsed. Felder:", fields);
    // console.log("INFO: Formular geparsed. Dateien:", files);

    // Stelle sicher, dass der Key 'fileToUpload' korrekt ist
    const uploadedFile = files.fileToUpload ? files.fileToUpload[0] : null;

    if (!uploadedFile || uploadedFile.size === 0) {
      console.error("FEHLER: Keine gültige Datei unter 'fileToUpload' gefunden oder Datei ist leer.", files);
      return response.status(400).json({ message: 'Keine gültige Datei im Upload gefunden (erwartet "fileToUpload").' });
    }

    tempFilePath = uploadedFile.filepath; // Speichere den Pfad für das finally-Aufräumen

    const context = fields.uploadContext ? fields.uploadContext[0] : 'unknown';
    const originalFilename = uploadedFile.originalFilename || 'unknown_filename';
    const safeFilename = `${Date.now()}_${originalFilename.replace(/[^a-zA-Z0-9_.\-]/g, '_')}`;
    const blobPath = `heizkoerper_uploads/${safeFilename}`;

    console.log(`INFO: Gültige Datei empfangen für Kontext "${context}": ${originalFilename} (${uploadedFile.size} bytes)`);

    // --- Vercel Blob Upload ---
    console.log(`INFO: Versuche Datei hochzuladen nach: ${blobPath}`);
    let blobUrl = null;
    try {
      // Lese die Datei als Stream aus dem temporären Pfad
      const fileStream = fs.createReadStream(tempFilePath);

      const blobResult = await put(
          blobPath,
          fileStream, // Übergib den Stream
          {
              access: 'public',
              contentType: uploadedFile.mimetype,
              // addRandomSuffix: true, // Empfohlen, um Überschreiben zu verhindern
          }
      );
      blobUrl = blobResult.url;
      console.log(`INFO: Vercel Blob Upload erfolgreich! URL: ${blobUrl}`);
    } catch (blobError) {
       console.error("FEHLER beim Vercel Blob Upload:", blobError);
       throw new Error(`Fehler beim Hochladen zu Vercel Blob: ${blobError.message}`);
    }
    // --- Ende Vercel Blob Upload ---


    // === Webhook Trigger LOGIK EINGEFÜGT ===
    const webhookUrl = process.env.HEIZKOERPER_WEBHOOK_URL; // Deine Environment Variable
    if (!webhookUrl) {
        console.error("FEHLER: HEIZKOERPER_WEBHOOK_URL nicht auf Vercel gesetzt!");
        // Fehler zurückgeben, da der Kernprozess nicht starten kann
        return response.status(500).json({ message: 'Webhook-Konfiguration serverseitig unvollständig.' });
    }

    // Payload für den Webhook zusammenstellen
    const webhookPayload = {
        event: 'heizkoerper_upload_received',
        filename: originalFilename,          // Der ursprüngliche Dateiname
        storedFilename: safeFilename,        // Der Name im Blob Storage
        mimeType: uploadedFile.mimetype,     // Der Dateityp
        sizeBytes: uploadedFile.size,          // Die Dateigröße
        fileUrl: blobUrl, // <<< DIE WICHTIGE URL ZUR DATEI
        uploadContext: context,
        // Füge hier weitere Daten aus 'fields' hinzu, falls dein Make-Szenario sie braucht
        // z.B. someOtherData: fields.someOtherData ? fields.someOtherData[0] : null
    };

    console.log(`INFO: Trigger Heizkörper Webhook: ${webhookUrl}`);
    console.log(`INFO: Sende Payload an Webhook:`, webhookPayload); // Logge den Payload!

    try {
        // Sende den POST Request an den Webhook
        const webhookResponse = await axios.post(webhookUrl, webhookPayload, {
             headers: { 'Content-Type': 'application/json' } // Als JSON senden
        });
        console.log(`INFO: Webhook Trigger Response Status: ${webhookResponse.status}`);
    } catch (webhookError) {
        console.error("FEHLER beim Senden des Webhooks:", webhookError.message);
        // Du könntest entscheiden, ob dieser Fehler kritisch ist oder nicht.
        // Wenn der Upload geklappt hat, aber der Webhook nicht, ist das vielleicht "ok" fürs Frontend?
        // Hier entscheiden wir uns, es als Serverfehler zu werten:
        throw new Error(`Webhook konnte nicht gesendet werden: ${webhookError.message}`);
    }
    // === Ende Webhook Trigger LOGIK ===


    // Wenn alles bis hierhin geklappt hat -> Erfolgreiche Antwort ans Frontend
    console.log("INFO: Alles erfolgreich abgeschlossen.");
    return response.status(200).json({
        message: 'Datei erfolgreich hochgeladen und Verarbeitung angestoßen.',
        filename: originalFilename, // Name zurückgeben
        fileUrl: blobUrl // URL zurückgeben
    });

  } catch (error) {
    // Fängt Fehler aus form.parse, put oder dem Webhook-axios.post
    console.error("FEHLER im API Handler:", error);
    // Gib eine aussagekräftige Fehlermeldung ans Frontend
    return response.status(500).json({ message: `Serverfehler: ${error.message || 'Unbekannter Fehler bei der Verarbeitung.'}` });
  } finally {
     // WICHTIG: Temporäre Datei *immer* versuchen zu löschen
     if (tempFilePath) {
        fs.unlink(tempFilePath, (err) => {
            if (err) console.error("Fehler beim Löschen der temporären Datei:", tempFilePath, err);
            else console.log("INFO: Temporäre Datei gelöscht:", tempFilePath);
        });
     }
  }
}