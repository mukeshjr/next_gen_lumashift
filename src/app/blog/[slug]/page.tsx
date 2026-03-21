import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Tag, ArrowRight, CheckCircle, BarChart2, GitBranch, Clock3, Table2, Lightbulb } from 'lucide-react';
import { getPublishedPosts } from '@/data/blog-posts';
import { getPostBySlug } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import { SaveButton } from '@/components/blog/SaveButton';
import { BlogActivityTracker } from '@/components/blog/BlogActivityTracker';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Params {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post || !post.published) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

const VISUAL_ICONS: Record<string, React.ReactNode> = {
  'threat-landscape': <BarChart2 size={16} className="text-red-500" />,
  'career-path': <GitBranch size={16} className="text-green-500" />,
  'concept-diagram': <Lightbulb size={16} className="text-yellow-500" />,
  'timeline': <Clock3 size={16} className="text-blue-500" />,
  'comparison-table': <Table2 size={16} className="text-purple-500" />,
};

const VISUAL_LABELS: Record<string, string> = {
  'threat-landscape': 'Threat Landscape',
  'career-path': 'Career Path Guide',
  'concept-diagram': 'Concept Explainer',
  'timeline': 'Day-in-the-Life',
  'comparison-table': 'Comparison Guide',
};

// Markdown-to-HTML renderer
function renderMarkdown(content: string): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let inTable = false;
  let tableIsFirstRow = false;
  let inCodeBlock = false;
  let codeLang = '';
  let codeLines: string[] = [];

  const closeList = () => {
    if (listType) { result.push(listType === 'ul' ? '</ul>' : '</ol>'); listType = null; }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Fenced code block open/close
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        closeList();
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
        codeLines = [];
      } else {
        const langClass = codeLang ? ` class="language-${codeLang}"` : '';
        result.push(`<pre class="overflow-x-auto my-6 rounded-xl bg-gray-900 dark:bg-gray-950 p-4 text-sm"><code${langClass} class="text-gray-100">${codeLines.map(escapeHtml).join('\n')}</code></pre>`);
        inCodeBlock = false;
        codeLang = '';
        codeLines = [];
      }
      continue;
    }
    if (inCodeBlock) { codeLines.push(line); continue; }

    // Table rows
    if (line.trim().startsWith('|')) {
      if (!inTable) {
        closeList();
        result.push('<div class="overflow-x-auto my-6"><table class="w-full text-sm border-collapse">');
        inTable = true;
        tableIsFirstRow = true;
      }
      // Skip separator rows like |---|---|
      if (/^\|[\s\-:|]+\|/.test(line.trim())) continue;
      const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      const tag = tableIsFirstRow ? 'th' : 'td';
      const cellClass = tableIsFirstRow
        ? 'class="px-4 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"'
        : 'class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"';
      result.push(`<tr>${cells.map(c => `<${tag} ${cellClass}>${formatInline(c.trim())}</${tag}>`).join('')}</tr>`);
      tableIsFirstRow = false;
      continue;
    } else if (inTable) {
      result.push('</table></div>');
      inTable = false;
    }

    // Blank line — close open blocks, skip producing output
    if (line.trim() === '') {
      closeList();
      continue;
    }

    // H2
    if (line.startsWith('## ')) {
      closeList();
      result.push(`<h2>${formatInline(line.slice(3))}</h2>`);
      continue;
    }

    // H3
    if (line.startsWith('### ')) {
      closeList();
      result.push(`<h3>${formatInline(line.slice(4))}</h3>`);
      continue;
    }

    // HR
    if (line.trim() === '---') {
      closeList();
      result.push('<hr/>');
      continue;
    }

    // Unordered list item
    if (line.startsWith('- ')) {
      if (listType !== 'ul') { closeList(); result.push('<ul>'); listType = 'ul'; }
      result.push(`<li>${formatInline(line.slice(2))}</li>`);
      continue;
    }

    // Ordered list item
    if (/^\d+\. /.test(line)) {
      if (listType !== 'ol') { closeList(); result.push('<ol>'); listType = 'ol'; }
      result.push(`<li>${formatInline(line.replace(/^\d+\. /, ''))}</li>`);
      continue;
    }

    // Regular paragraph
    closeList();
    result.push(`<p>${formatInline(line)}</p>`);
  }

  if (inTable) result.push('</table></div>');
  closeList();

  return result.join('\n');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}

export default async function BlogPostPage({ params }: Params) {
  const post = await getPostBySlug(params.slug);

  if (!post || !post.published) notFound();

  const allPosts = getPublishedPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === params.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-muted border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="brand">{post.category}</Badge>
            {post.visualType && (
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full font-medium">
                {VISUAL_ICONS[post.visualType]}
                {VISUAL_LABELS[post.visualType]}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={12} /> {post.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
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
            <SaveButton slug={post.slug} title={post.title} />
          </div>
          <BlogActivityTracker slug={post.slug} title={post.title} />

          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-md">
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      {post.keyTakeaways && post.keyTakeaways.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-6">
            <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-orange-500 shrink-0" />
              Key Takeaways
            </h2>
            <ul className="space-y-2.5">
              {post.keyTakeaways.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

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
            prose-hr:border-gray-200 dark:prose-hr:border-gray-800
            prose-table:text-sm"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* Work with us CTA */}
        <div className="mt-16 bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-3">
            Ready to Apply This in Your Career?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            LumaShift helps you turn insights like these into tangible career progress. Let&apos;s talk about where you are and where you want to be.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact">
              <Button variant="brand" size="brand-default">
                Contact Us Now <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/quiz">
              <Button variant="brandOutline" size="brand-default">
                Take the Career Quiz
              </Button>
            </Link>
          </div>
        </div>

        {/* Post navigation */}
        {(prevPost || nextPost) && (
          <div className="mt-12 grid sm:grid-cols-2 gap-4">
            {prevPost && (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group text-left"
              >
              <Card className="p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <p className="text-xs text-gray-400 mb-1">← Previous</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-orange-500 transition-colors line-clamp-2">
                  {prevPost.title}
                </p>
              </Card>
              </Link>
            )}
            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group text-right sm:col-start-2"
              >
              <Card className="p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <p className="text-xs text-gray-400 mb-1">Next →</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-orange-500 transition-colors line-clamp-2">
                  {nextPost.title}
                </p>
              </Card>
              </Link>
            )}
          </div>
        )}
      </article>
    </div>
  );
}
