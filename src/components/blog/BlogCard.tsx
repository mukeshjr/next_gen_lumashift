import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { BlogPost } from '@/types';
import { formatDate } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block card-hover">
      {/* Category banner */}
      <div className="bg-orange-500/10 dark:bg-orange-500/5 border-b border-orange-100 dark:border-orange-500/10 px-6 py-3">
        <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">
          {post.category}
        </span>
      </div>

      <div className="p-6 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
          {post.title}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-md"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.readTime}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-orange-500 group-hover:gap-2 transition-all">
            Read <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
