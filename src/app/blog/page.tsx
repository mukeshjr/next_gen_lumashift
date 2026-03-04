'use client';

import { useState } from 'react';
import { Search, Tag, X } from 'lucide-react';
import { BlogCard } from '@/components/blog/BlogCard';
import { getPublishedPosts, getAllCategories, getAllTags } from '@/data/blog-posts';

const publishedPosts = getPublishedPosts();
const categories = getAllCategories();
const tags = getAllTags();

export default function BlogPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = publishedPosts.filter((post) => {
    const matchesSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || post.category === activeCategory;
    const matchesTag = !activeTag || post.tags.includes(activeTag);
    return matchesSearch && matchesCategory && matchesTag;
  });

  const clearFilters = () => {
    setSearch('');
    setActiveCategory(null);
    setActiveTag(null);
  };

  const hasFilters = search || activeCategory || activeTag;

  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gray-50 dark:bg-[#141414] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag mx-auto w-fit">Blog</span>
          <h1 className="section-title mt-4">Cybersecurity Career Insights</h1>
          <p className="section-subtitle mt-4 mx-auto">
            Practical, direct, and actionable — our takes on the cybersecurity job market,
            career paths, and what it actually takes to succeed.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search + filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
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
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category:</span>
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
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Tag size={12} /> Tags:
            </span>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  activeTag === tag
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-orange-500'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={14} /> Clear all filters
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-400 mb-6">
          {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
          {hasFilters ? ' matching your filters' : ''}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No articles found</p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try a different search term or clear your filters.
            </p>
            <button onClick={clearFilters} className="btn-secondary">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
