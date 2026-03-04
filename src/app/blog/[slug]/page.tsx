import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Tag, ArrowRight } from 'lucide-react';
import { getPostBySlug, getPublishedPosts } from '@/data/blog-posts';
import { formatDate } from '@/lib/utils';

interface Params {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post || !post.published) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

// Very simple markdown-to-HTML renderer (avoids adding remark as a dependency)
function renderMarkdown(content: string): string {
  return content
    .replace(/\n\n/g, '</p><p>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/---/g, '<hr/>')
    .replace(/^(.+)$/gm, (line) => {
      if (line.startsWith('<h') || line.startsWith('<ul') || line.startsWith('<li') || line.startsWith('<hr')) return line;
      if (line.trim() === '') return '';
      return `<p>${line}</p>`;
    });
}

export default function BlogPostPage({ params }: Params) {
  const post = getPostBySlug(params.slug);

  if (!post || !post.published) notFound();

  const allPosts = getPublishedPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === params.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-gray-50 dark:bg-[#141414] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 mb-6"
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className="badge-orange">{post.category}</span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={12} /> {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500 font-bold text-sm">
                {post.author[0]}
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{post.author}</span>
            </div>
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <Calendar size={14} /> {formatDate(post.date)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-md">
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div
          className="prose prose-gray dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8
            prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-5
            prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-ul:my-4 prose-li:text-gray-600 dark:prose-li:text-gray-300
            prose-code:text-orange-600 dark:prose-code:text-orange-400 prose-code:bg-orange-50 dark:prose-code:bg-orange-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-hr:border-gray-200 dark:prose-hr:border-gray-800"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* Work with us CTA */}
        <div className="mt-16 bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Ready to Apply This in Your Career?
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            LumaShift helps you turn insights like these into tangible career progress. Let&apos;s talk about where you are and where you want to be.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="btn-primary">
              Contact Us Now <ArrowRight size={16} />
            </Link>
            <Link href="/quiz" className="btn-secondary">
              Take the Career Quiz
            </Link>
          </div>
        </div>

        {/* Post navigation */}
        {(prevPost || nextPost) && (
          <div className="mt-12 grid sm:grid-cols-2 gap-4">
            {prevPost && (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="card-hover group text-left p-5"
              >
                <p className="text-xs text-gray-400 mb-1">← Previous</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-orange-500 transition-colors line-clamp-2">
                  {prevPost.title}
                </p>
              </Link>
            )}
            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="card-hover group text-right p-5 sm:col-start-2"
              >
                <p className="text-xs text-gray-400 mb-1">Next →</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-orange-500 transition-colors line-clamp-2">
                  {nextPost.title}
                </p>
              </Link>
            )}
          </div>
        )}
      </article>
    </div>
  );
}
