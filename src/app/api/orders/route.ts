import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendOrderEmail } from '@/lib/email';
import { appendToGoogleSheet } from '@/lib/sheets';

const VAT_RATE = 0.21;

interface CartItem {
  beer: { id: string; name: string; image: string };
  variant: { id: string; label: string; price: number };
  quantity: number;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  notes?: string;
}

/**
 * Generate order number: TB-YYYY-NNNN
 * Uses an order_sequences table with a year → last_seq counter.
 */
async function generateOrderNumber(supabase: ReturnType<typeof createServiceClient>): Promise<string> {
  const year = new Date().getFullYear();

  // Upsert: increment sequence for this year
  const { data, error } = await supabase.rpc('next_order_seq', { p_year: year });

  if (error || data === null) {
    // Fallback: use timestamp-based suffix
    console.error('[orders] Sequence RPC failed, using fallback:', error);
    return `TB-${year}-${Date.now().toString().slice(-4)}`;
  }

  const seq = String(data as number).padStart(4, '0');
  return `TB-${year}-${seq}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      formData: FormData;
      items: CartItem[];
      fulfillment: string;
    };

    const { formData, items, fulfillment } = body;

    // Basic validation
    if (!formData?.email || !formData?.firstName || !items?.length) {
      return NextResponse.json({ error: 'Ongeldige bestelling' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // ── Order number ──────────────────────────────────────────────
    const orderNumber = await generateOrderNumber(supabase);

    // ── Calculate totals ──────────────────────────────────────────
    const orderItems = items.map((item) => {
      const unitPrice = item.variant.price;
      const itemTotalExcl = unitPrice * item.quantity;
      const itemVat = Math.round(itemTotalExcl * VAT_RATE * 100) / 100;
      const itemTotalIncl = Math.round(itemTotalExcl * (1 + VAT_RATE) * 100) / 100;

      return {
        beer_name: item.beer.name,
        variant_label: item.variant.label,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_excl_vat: itemTotalExcl,
        vat_amount: itemVat,
        total_incl_vat: itemTotalIncl,
      };
    });

    const totalExclVat = orderItems.reduce((s, i) => s + i.total_excl_vat, 0);
    const vatAmount = Math.round(totalExclVat * VAT_RATE * 100) / 100;
    const totalInclVat = Math.round(totalExclVat * (1 + VAT_RATE) * 100) / 100;

    // ── Insert order ──────────────────────────────────────────────
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
        customer_email: formData.email,
        customer_phone: formData.phone ?? null,
        customer_type: 'particulier',
        fulfillment,
        status: 'pending',
        is_processed: false,
        total_excl_vat: totalExclVat,
        vat_amount: vatAmount,
        total_incl_vat: totalInclVat,
        notes: formData.notes ?? null,
      })
      .select('id')
      .single();

    if (orderError || !order) {
      console.error('[orders] Failed to insert order:', orderError);
      return NextResponse.json({ error: 'Opslaan mislukt' }, { status: 500 });
    }

    // ── Insert order items ────────────────────────────────────────
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems.map((i) => ({ ...i, order_id: order.id })));

    if (itemsError) {
      console.error('[orders] Failed to insert order items:', itemsError);
      // Order saved but items failed — still return success so customer isn't blocked
    }

    // ── Decrement stock ───────────────────────────────────────────
    for (const item of items) {
      const { data: variant } = await supabase
        .from('beer_variants')
        .select('stock')
        .eq('id', item.variant.id)
        .single();

      if (variant) {
        const newStock = Math.max(0, (variant.stock as number) - item.quantity);
        await supabase
          .from('beer_variants')
          .update({ stock: newStock, is_available: newStock > 0 })
          .eq('id', item.variant.id);
      }
    }

    // ── Side effects (non-blocking) ───────────────────────────────
    const emailData = {
      orderNumber,
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      customerEmail: formData.email,
      fulfillment,
      items: orderItems.map((i) => ({
        beerName: i.beer_name,
        variantLabel: i.variant_label,
        quantity: i.quantity,
        unitPrice: i.unit_price,
        totalInclVat: i.total_incl_vat,
      })),
      totalExclVat,
      vatAmount,
      totalInclVat,
    };

    const sheetData = {
      orderNumber,
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      customerType: 'particulier',
      fulfillment,
      items: orderItems.map((i) => ({
        beerName: i.beer_name,
        variantLabel: i.variant_label,
        quantity: i.quantity,
        unitPrice: i.unit_price,
        vatAmount: i.vat_amount,
        totalInclVat: i.total_incl_vat,
      })),
      notes: formData.notes,
    };

    // Fire-and-forget — don't block the response on email/sheets
    Promise.all([
      sendOrderEmail(emailData).catch((e) => console.error('[orders] Email failed:', e)),
      appendToGoogleSheet(sheetData).catch((e) => console.error('[orders] Sheet failed:', e)),
    ]);

    return NextResponse.json({ orderNumber });
  } catch (error) {
    console.error('[orders] Unexpected error:', error);
    return NextResponse.json({ error: 'Interne fout' }, { status: 500 });
  }
}
