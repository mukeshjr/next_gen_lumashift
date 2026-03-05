import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const item_type = searchParams.get('item_type');
  const item_id = searchParams.get('item_id');

  let query = supabase
    .from('saved_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (item_type) query = query.eq('item_type', item_type);
  if (item_id) query = query.eq('item_id', item_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ saves: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { item_type, item_id, item_title, item_data } = body;

  if (!item_type || !item_id) {
    return NextResponse.json({ error: 'item_type and item_id required' }, { status: 400 });
  }

  const { error } = await supabase.from('saved_items').insert({
    user_id: user.id,
    item_type,
    item_id,
    item_title: item_title ?? '',
    item_data: item_data ?? {},
  });

  if (error) {
    // Duplicate — already saved
    if (error.code === '23505') {
      return NextResponse.json({ success: true, alreadySaved: true });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Award points for saving a resource
  if (item_type === 'resource') {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/api/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: req.headers.get('cookie') ?? '' },
      body: JSON.stringify({ event_type: 'resource_saved', item_id, item_title }),
    }).catch(() => {});
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const item_type = searchParams.get('item_type');
  const item_id = searchParams.get('item_id');

  if (!item_type || !item_id) {
    return NextResponse.json({ error: 'item_type and item_id required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('saved_items')
    .delete()
    .eq('user_id', user.id)
    .eq('item_type', item_type)
    .eq('item_id', item_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
