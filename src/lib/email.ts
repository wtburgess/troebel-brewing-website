import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  fulfillment: string;
  items: Array<{
    beerName: string;
    variantLabel: string;
    quantity: number;
    unitPrice: number;
    totalInclVat: number;
  }>;
  totalExclVat: number;
  vatAmount: number;
  totalInclVat: number;
}

function formatCurrency(amount: number) {
  return `€ ${amount.toFixed(2).replace('.', ',')}`;
}

function buildItemsTable(items: OrderEmailData['items']): string {
  const rows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.beerName}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.variantLabel}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${formatCurrency(item.unitPrice)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${formatCurrency(item.totalInclVat)}</td>
    </tr>`
    )
    .join('');

  return `
  <table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:14px;">
    <thead>
      <tr style="background:#1C1C1C;color:#D4A017;">
        <th style="padding:10px 12px;text-align:left;">Bier</th>
        <th style="padding:10px 12px;text-align:left;">Variant</th>
        <th style="padding:10px 12px;text-align:center;">Aantal</th>
        <th style="padding:10px 12px;text-align:right;">Prijs/stuk</th>
        <th style="padding:10px 12px;text-align:right;">Totaal</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function buildConfirmationHtml(order: OrderEmailData): string {
  const fulfillmentText =
    order.fulfillment === 'pickup'
      ? 'Afhalen bij de brouwerij (na afspraak)'
      : 'Verzending';

  return `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><title>Bestelbevestiging ${order.orderNumber}</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border:2px solid #1C1C1C;box-shadow:6px 6px 0 #D4A017;">
    <!-- Header -->
    <div style="background:#1C1C1C;padding:32px 40px;text-align:center;">
      <h1 style="color:#D4A017;font-size:28px;margin:0;letter-spacing:2px;">TROEBEL BREWING</h1>
      <p style="color:#fff;margin:8px 0 0;font-size:14px;">Bestelbevestiging</p>
    </div>

    <!-- Body -->
    <div style="padding:32px 40px;">
      <p style="font-size:16px;color:#1C1C1C;">Dag ${order.customerName},</p>
      <p style="color:#555;">Bedankt voor je bestelling! We hebben alles goed ontvangen.</p>

      <div style="background:#f9f9f9;border:1px solid #eee;padding:16px 20px;margin:20px 0;">
        <strong style="font-size:14px;color:#1C1C1C;">Bestelnummer:</strong>
        <span style="font-size:18px;color:#D4A017;font-weight:bold;margin-left:8px;">${order.orderNumber}</span>
      </div>

      <h3 style="color:#1C1C1C;border-bottom:2px solid #D4A017;padding-bottom:8px;">Overzicht</h3>
      ${buildItemsTable(order.items)}

      <table style="width:100%;margin-top:16px;font-size:14px;">
        <tr>
          <td style="padding:4px 0;color:#555;">Subtotaal excl. btw</td>
          <td style="text-align:right;color:#555;">${formatCurrency(order.totalExclVat)}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#555;">BTW (21%)</td>
          <td style="text-align:right;color:#555;">${formatCurrency(order.vatAmount)}</td>
        </tr>
        <tr style="font-weight:bold;font-size:16px;">
          <td style="padding:8px 0;border-top:2px solid #1C1C1C;">TOTAAL incl. btw</td>
          <td style="text-align:right;border-top:2px solid #1C1C1C;color:#D4A017;">${formatCurrency(order.totalInclVat)}</td>
        </tr>
      </table>

      <div style="margin-top:24px;padding:16px;background:#f9f9f9;border-left:4px solid #D4A017;">
        <strong>Levering:</strong> ${fulfillmentText}
      </div>

      <p style="margin-top:24px;color:#555;font-size:14px;">
        We nemen binnenkort contact met je op om de afhaaltijd te bevestigen.<br>
        Vragen? Mail ons op <a href="mailto:info@troebelbrewing.be" style="color:#D4A017;">info@troebelbrewing.be</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#1C1C1C;padding:20px 40px;text-align:center;">
      <p style="color:#fff;font-size:12px;margin:0;">© ${new Date().getFullYear()} Troebel Brewing Co. — Antwerpen</p>
    </div>
  </div>
</body>
</html>`;
}

function buildBreweryAlertHtml(order: OrderEmailData): string {
  return `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><title>Nieuwe bestelling ${order.orderNumber}</title></head>
<body style="font-family:sans-serif;padding:20px;">
  <h2>🍺 Nieuwe bestelling: ${order.orderNumber}</h2>
  <p><strong>Klant:</strong> ${order.customerName} (${order.customerEmail})</p>
  <p><strong>Levering:</strong> ${order.fulfillment}</p>
  ${buildItemsTable(order.items)}
  <p><strong>Totaal incl. BTW:</strong> ${formatCurrency(order.totalInclVat)}</p>
  <hr>
  <p style="font-size:12px;color:#999;">Verwerk via <a href="https://troebel.wotis-cloud.com/admin/bestellingen">admin/bestellingen</a></p>
</body>
</html>`;
}

export async function sendOrderEmail(order: OrderEmailData): Promise<void> {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'REPLACE_ME_RESEND_KEY') {
    console.warn('[email] RESEND_API_KEY not configured — skipping email send');
    return;
  }

  await Promise.all([
    // Confirmation to customer
    resend.emails.send({
      from: 'Troebel Brewing <bestellingen@troebelbrewing.be>',
      to: order.customerEmail,
      subject: `Bestelbevestiging ${order.orderNumber} — Troebel Brewing`,
      html: buildConfirmationHtml(order),
    }),
    // Alert to brewery
    resend.emails.send({
      from: 'Troebel Brewing <bestellingen@troebelbrewing.be>',
      to: 'info@troebelbrewing.be',
      subject: `Nieuwe bestelling ${order.orderNumber} — ${order.customerName}`,
      html: buildBreweryAlertHtml(order),
    }),
  ]);
}
