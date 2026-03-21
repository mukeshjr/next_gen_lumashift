import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAdmin } from '@/lib/admin';

/* ─── GET: Fetch all generated resources (for admin) ─────────────────────── */

export async function GET() {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.authorized) {
      return NextResponse.json(
        { error: adminCheck.userId ? 'Admin access required' : 'Authentication required' },
        { status: adminCheck.userId ? 403 : 401 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('generated_resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Admin Resources GET] DB error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ resources: data ?? [] });
  } catch (err) {
    console.error('[Admin Resources GET] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}

/* ─── PUT: Update a generated resource ───────────────────────────────────── */

export async function PUT(req: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.authorized) {
      return NextResponse.json(
        { error: adminCheck.userId ? 'Admin access required' : 'Authentication required' },
        { status: adminCheck.userId ? 403 : 401 }
      );
    }

    const supabase = await createClient();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      );
    }

    // Only allow updating specific fields
    const allowedFields = ['title', 'description', 'content', 'type', 'category', 'free', 'published', 'download_url'];
    const sanitized: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in updates) {
        sanitized[key] = updates[key];
      }
    }

    const { data, error } = await supabase
      .from('generated_resources')
      .update(sanitized)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Admin Resources PUT] DB error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, resource: data });
  } catch (err) {
    console.error('[Admin Resources PUT] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}

/* ─── DELETE: Delete a generated resource ────────────────────────────────── */

export async function DELETE(req: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.authorized) {
      return NextResponse.json(
        { error: adminCheck.userId ? 'Admin access required' : 'Authentication required' },
        { status: adminCheck.userId ? 403 : 401 }
      );
    }

    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('generated_resources')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Admin Resources DELETE] DB error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Admin Resources DELETE] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}
