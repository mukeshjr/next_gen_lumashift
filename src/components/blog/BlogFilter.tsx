'use client';

import { useState, useMemo } from 'react';
import { Search, Tag, X, BookOpen } from 'lucide-react';
import { BlogCard } from './BlogCard';
import { Button } from '@/components/ui/button';
import type { BlogPost } from '@/types';

interface BlogFilterProps {
  posts: BlogPost[];
  categories: string[];
  tags: string[];
}

export function BlogFilter({ posts, categories, tags }: BlogFilterProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      posts.filter((post) => {
        const matchesSearch =
          !search ||
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
          post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = !activeCategory || post.category === activeCategory;
        const matchesTag = !activeTag || post.tags.includes(activeTag);
        return matchesSearch && matchesCategory && matchesTag;
      }),
    [posts, search, activeCategory, activeTag]
  );

  const hasFilters = !!(search || activeCategory || activeTag);

  const clearFilters = () => {
    setSearch('');
    setActiveCategory(null);
    setActiveTag(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Search + filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-11"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Category:
          </span>
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              !activeCategory
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-500'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Tag size={12} /> Tags:
          </span>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all border ${
                activeTag === tag
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-transparent hover:border-orange-300 hover:text-orange-500'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <X size={14} /> Clear all filters
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'article' : 'articles'}
          {hasFilters ? ' matching your filters' : ''}
        </p>
        {hasFilters && (
          <span className="text-xs text-orange-500 font-medium">Filtered view</span>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <BookOpen size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No articles found
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Try a different search term or clear your filters.
          </p>
          <Button onClick={clearFilters} variant="brandOutline" size="brand-default">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
