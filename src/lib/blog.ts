import { createClient } from '@/lib/supabase/server';
import { blogPosts, getPublishedPosts as getStaticPublished, getPostBySlug as getStaticBySlug, getAllCategories as getStaticCategories, getAllTags as getStaticTags } from '@/data/blog-posts';
import type { BlogPost } from '@/types';

interface DbBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  read_time: string;
  published: boolean;
  cover_image: string | null;
  visual_type: string | null;
  key_takeaways: string[] | null;
  generated_by_ai: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

function dbToBlogPost(row: DbBlogPost): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    tags: row.tags ?? [],
    author: row.author,
    date: row.date,
    readTime: row.read_time,
    published: row.published,
    coverImage: row.cover_image ?? undefined,
    visualType: (row.visual_type as BlogPost['visualType']) ?? undefined,
    keyTakeaways: row.key_takeaways ?? undefined,
  };
}

/** Fetch published posts from Supabase (returns empty array on error) */
async function getDbPublishedPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('date', { ascending: false });

    if (error || !data) return [];
    return (data as DbBlogPost[]).map(dbToBlogPost);
  } catch {
    return [];
  }
}

/** Fetch a single post from Supabase by slug */
async function getDbPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return null;
    return dbToBlogPost(data as DbBlogPost);
  } catch {
    return null;
  }
}

/** Get ALL published posts (static + DB), deduplicated by slug, sorted by date desc */
export async function getAllPublishedPosts(): Promise<BlogPost[]> {
  const [staticPosts, dbPosts] = await Promise.all([
    Promise.resolve(getStaticPublished()),
    getDbPublishedPosts(),
  ]);

  // DB posts override static posts with same slug
  const slugMap = new Map<string, BlogPost>();
  for (const post of staticPosts) {
    slugMap.set(post.slug, post);
  }
  for (const post of dbPosts) {
    slugMap.set(post.slug, post);
  }

  return Array.from(slugMap.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

/** Get a single post by slug (checks DB first, then static) */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const dbPost = await getDbPostBySlug(slug);
  if (dbPost) return dbPost;
  return getStaticBySlug(slug) ?? null;
}

/** Get all unique categories from both sources */
export async function getAllCategories(): Promise<string[]> {
  const allPosts = await getAllPublishedPosts();
  return [...new Set(allPosts.map((p) => p.category))];
}

/** Get all unique tags from both sources */
export async function getAllTags(): Promise<string[]> {
  const allPosts = await getAllPublishedPosts();
  return [...new Set(allPosts.flatMap((p) => p.tags))];
}

/** Get all posts for admin (including drafts) — requires auth */
export async function getAllPostsAdmin(): Promise<(BlogPost & { id?: string; generated_by_ai?: boolean })[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return (data as DbBlogPost[]).map((row) => ({
      ...dbToBlogPost(row),
      id: row.id,
      generated_by_ai: row.generated_by_ai,
    }));
  } catch {
    return [];
  }
}
