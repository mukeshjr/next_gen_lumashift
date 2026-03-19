import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/admin/blog — List all blog posts (including drafts) for the admin
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('[Admin Blog GET] Supabase error:', error);
      return NextResponse.json(
        { error: `Failed to fetch blog posts: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ posts: data });
  } catch (err) {
    console.error('[Admin Blog GET] Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/blog — Update a blog post (toggle published, edit content, etc.)
export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Map camelCase fields to snake_case DB columns if present
    const dbUpdates: Record<string, unknown> = {};
    const fieldMap: Record<string, string> = {
      readTime: 'read_time',
      visualType: 'visual_type',
      keyTakeaways: 'key_takeaways',
      coverImage: 'cover_image',
    };

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        const dbKey = fieldMap[key] || key;
        dbUpdates[dbKey] = value;
      }
    }

    // Add updated_at timestamp
    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('blog_posts')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Admin Blog PUT] Supabase error:', error);
      return NextResponse.json(
        { error: `Failed to update blog post: ${error.message}` },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post: data });
  } catch (err) {
    console.error('[Admin Blog PUT] Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog — Delete a blog post by ID
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required (pass as ?id=...)' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Admin Blog DELETE] Supabase error:', error);
      return NextResponse.json(
        { error: `Failed to delete blog post: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err) {
    console.error('[Admin Blog DELETE] Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
