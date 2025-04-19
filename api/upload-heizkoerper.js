// api/upload-heizkoerper.js (Ausschnitt)
import { formidable } from 'formidable';
import axios from 'axios';
import { put } from '@vercel/blob';
import * as fs from 'fs'; // Node.js File System Modul

export const config = { api: { bodyParser: false } };

export default async function handler(request, response) {
    // ... (Method Check) ...
    const form = formidable({ keepExtensions: true, allowEmptyFiles: false });

    try {
        const [fields, files] = await form.parse(request);
        const uploadedFile = files.fileToUpload ? files.fileToUpload[0] : null;

        if (!uploadedFile || uploadedFile.size === 0) { /* ... Fehler ... */ }
        
        const originalFilename = uploadedFile.originalFilename || 'unknown_filename';
        const safeFilename = `${Date.now()}_${originalFilename.replace(/[^a-zA-Z0-9_.\-]/g, '_')}`;
        const blobPath = `heizkoerper_uploads/${safeFilename}`;

        console.log(`INFO: Versuche Datei hochzuladen: ${originalFilename}`);
        let blobUrl = null;

        // --- NEUER VERSUCH: Lese die Datei als Stream ---
        const fileStream = fs.createReadStream(uploadedFile.filepath); 
        // ----------------------------------------------

        try {
            const blobResult = await put(
                blobPath,
                fileStream, // <<< ÜBERGIB DEN STREAM STATT 'request'
                {
                    access: 'public',
                    contentType: uploadedFile.mimetype
                }
            );
            blobUrl = blobResult.url;
            console.log(`INFO: Vercel Blob Upload erfolgreich! URL: ${blobUrl}`);
        } catch (blobError) {
             console.error("FEHLER beim Vercel Blob Upload:", blobError);
             throw new Error(`Fehler beim Hochladen zu Vercel Blob: ${blobError.message}`);
        } finally {
             // WICHTIG: Temporäre Datei löschen, die formidable erstellt hat
             if (uploadedFile.filepath) {
                fs.unlink(uploadedFile.filepath, (err) => {
                    if (err) console.error("Fehler beim Löschen der temp. Datei:", err);
                });
             }
        }
        // --- Ende Vercel Blob Upload ---

        // ... (Webhook Trigger wie vorher) ...

        console.log("INFO: Alles erfolgreich abgeschlossen.");
        return response.status(200).json({ /*...*/ });

    } catch (error) {
        // ... (Fehlerbehandlung wie vorher) ...
    }
}