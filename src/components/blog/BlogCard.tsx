import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { BlogPost } from '@/types';
import { formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg overflow-hidden">
        {/* Category banner */}
        <div className="bg-orange-500/10 dark:bg-orange-500/5 border-b border-orange-100 dark:border-orange-500/10 px-4 py-3">
          <Badge variant="brand" className="text-[10px]">
            {post.category}
          </Badge>
        </div>

        <CardContent className="flex flex-col gap-4 pt-4">
          <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-orange-500 transition-colors">
            {post.title}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="muted" className="gap-1">
                <Tag size={10} />
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
        </CardContent>
      </Card>
    </Link>
  );
}
