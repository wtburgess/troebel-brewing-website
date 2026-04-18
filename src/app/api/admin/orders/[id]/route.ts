import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json() as { is_processed: boolean };

    if (typeof body.is_processed !== 'boolean') {
      return NextResponse.json({ error: 'is_processed must be a boolean' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase
      .from('orders')
      .update({ is_processed: body.is_processed })
      .eq('id', id);

    if (error) {
      console.error('[admin/orders] Failed to update order:', error);
      return NextResponse.json({ error: 'Update mislukt' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[admin/orders] Unexpected error:', error);
    return NextResponse.json({ error: 'Interne fout' }, { status: 500 });
  }
}
