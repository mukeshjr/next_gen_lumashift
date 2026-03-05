import type { Metadata } from 'next';
import { getPublishedPosts, getAllCategories, getAllTags } from '@/data/blog-posts';
import { BlogFilter } from '@/components/blog/BlogFilter';

export const metadata: Metadata = {
  title: 'Blog – Cybersecurity Career Insights',
  description:
    'Practical, direct cybersecurity career insights from LumaShift — covering AI security, cloud security, GRC, Malaysian market trends, and career strategy.',
};

export default function BlogPage() {
  const posts = getPublishedPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen">
      <section className="py-20 bg-gray-50 dark:bg-[#141414] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag mx-auto w-fit">Blog</span>
          <h1 className="section-title mt-4">Cybersecurity Career Insights</h1>
          <p className="section-subtitle mt-4 mx-auto">
            Practical, direct, and actionable — our takes on the cybersecurity job market,
            career paths, and what it actually takes to succeed.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">✍️ {posts.length} articles published</span>
            <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">🎯 Malaysia + Global market</span>
            <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">🔄 Updated regularly</span>
          </div>
        </div>
      </section>
      <BlogFilter posts={posts} categories={categories} tags={tags} />
    </div>
  );
}
