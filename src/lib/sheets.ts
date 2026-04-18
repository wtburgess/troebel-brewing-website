/**
 * Appends order data to a Google Sheet via an Apps Script web app.
 *
 * Setup:
 * 1. Create a Google Sheet with columns:
 *    Datum | Factuurnr | Klantnaam | Klanttype | Product | Variant | Hoeveelheid
 *    | Prijs excl. BTW | BTW bedrag | Prijs incl. BTW | Fulfillment | Betaald | Notities
 *
 * 2. In Google Apps Script, deploy a doPost(e) web app:
 *
 *    function doPost(e) {
 *      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *      var rows = JSON.parse(e.postData.contents);
 *      rows.forEach(function(row) {
 *        sheet.appendRow(row);
 *      });
 *      return ContentService.createTextOutput('OK');
 *    }
 *
 * 3. Deploy as web app: Execute as "Me", Access "Anyone".
 * 4. Copy the web app URL into GOOGLE_SHEET_WEBHOOK_URL in .env.local.
 */

export interface SheetOrderData {
  orderNumber: string;
  customerName: string;
  customerType: string;
  fulfillment: string;
  items: Array<{
    beerName: string;
    variantLabel: string;
    quantity: number;
    unitPrice: number;
    vatAmount: number;
    totalInclVat: number;
  }>;
  notes?: string;
}

export async function appendToGoogleSheet(order: SheetOrderData): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

  if (!webhookUrl || webhookUrl === 'REPLACE_ME_APPS_SCRIPT_URL') {
    console.warn('[sheets] GOOGLE_SHEET_WEBHOOK_URL not configured — skipping sheet append');
    return;
  }

  const now = new Date().toLocaleString('nl-BE', { timeZone: 'Europe/Brussels' });

  // One row per order item
  const rows = order.items.map((item) => [
    now,
    order.orderNumber,
    order.customerName,
    order.customerType,
    item.beerName,
    item.variantLabel,
    item.quantity,
    item.unitPrice.toFixed(2),
    item.vatAmount.toFixed(2),
    item.totalInclVat.toFixed(2),
    order.fulfillment,
    'nee',           // Betaald — update manually
    order.notes ?? '',
  ]);

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    console.error('[sheets] Failed to append to Google Sheet:', response.status, await response.text());
  }
}
