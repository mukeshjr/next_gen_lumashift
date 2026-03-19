import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAllPostsAdmin } from '@/lib/blog';
import { getPublishedPosts } from '@/data/blog-posts';
import BlogAdmin from '@/components/admin/BlogAdmin';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Admin — LumaShift',
  description: 'Manage and generate AI-powered blog posts',
};

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirectTo=/admin/blog');
  }

  const [dbPosts, staticPosts] = await Promise.all([
    getAllPostsAdmin(),
    Promise.resolve(getPublishedPosts()),
  ]);

  return (
    <BlogAdmin
      initialPosts={dbPosts}
      staticPostCount={staticPosts.length}
      userId={user.id}
    />
  );
}
