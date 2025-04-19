// Datei: api/trigger-efh-webhook.js
import axios from 'axios'; // Zum Senden von Anfragen

export default async function handler(request, response) {
  // Nur POST Anfragen vom Frontend erlauben
  if (request.method !== 'POST') {
    return response.status(405).send('Method Not Allowed');
  }

  // 1. Hole die geheime Webhook-URL aus den Vercel Einstellungen
  const efhWebhookUrl = process.env.EFH_WEBHOOK_URL;

  // 2. Prüfe, ob die URL überhaupt gesetzt ist
  if (!efhWebhookUrl) {
    console.error("FEHLER: EFH_WEBHOOK_URL ist auf Vercel nicht gesetzt!");
    // Wichtig: Sage dem Frontend trotzdem, dass die Anfrage okay ist (202 Accepted),
    // damit die App nicht hängen bleibt. Der Fehler ist nur serverseitig.
    return response.status(202).json({ message: 'Anfrage erhalten, aber Webhook serverseitig nicht konfiguriert.' });
  }

  try {
    // 3. Sende die eigentliche Anfrage an deinen Webhook (z.B. Make.com)
    console.log(`INFO: Löse Webhook aus für EFH an: ${efhWebhookUrl}`);
    // Du kannst optional noch Daten mitschicken, falls Make.com sie braucht:
    const payload = { event: 'efh_selected', time: new Date() };
    await axios.post(efhWebhookUrl, payload); // Schicke die Anfrage ab

    // 4. Sage dem Frontend, dass die Anfrage angenommen wurde (nicht, ob der Webhook selbst erfolgreich war)
    return response.status(202).json({ message: 'EFH Webhook Trigger Anfrage angenommen.' });

  } catch (error) {
    console.error(`FEHLER beim Auslösen des EFH Webhooks (${efhWebhookUrl}):`, error.message);
    // Auch hier: Sage dem Frontend, dass alles okay ist (202), logge aber den Fehler serverseitig.
    return response.status(202).json({ message: 'Anfrage erhalten, aber Fehler beim Senden des Webhooks.' });
  }
}