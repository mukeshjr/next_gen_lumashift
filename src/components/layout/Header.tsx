'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Shield, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const PUBLIC_NAV = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/team', label: 'Team' },
  {
    label: 'Learn',
    children: [
      { href: '/blog', label: 'Blog' },
      { href: '/resources', label: 'Resources' },
    ],
  },
  {
    label: 'Tools',
    children: [
      { href: '/quiz', label: 'Career Quiz' },
      { href: '/compare-roles', label: 'Compare Roles' },
      { href: '/roadmap', label: 'Career Roadmap' },
      { href: '/skill-gap', label: 'Skill Gap Analysis' },
      { href: '/achievements', label: 'Achievements' },
    ],
  },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navLinks = user
    ? [...PUBLIC_NAV, { href: '/dashboard', label: 'Dashboard' }]
    : PUBLIC_NAV;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:bg-orange-600 transition-colors">
              <Shield size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Luma<span className="text-orange-500">Shift</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.children) {
                return (
                  <div key={link.label} className="relative">
                    <button
                      onMouseEnter={() => setOpenDropdown(link.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                      className={cn(
                        'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium',
                        'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors'
                      )}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={cn(
                          'transition-transform duration-200',
                          openDropdown === link.label && 'rotate-180'
                        )}
                      />
                    </button>
                    {openDropdown === link.label && (
                      <div
                        onMouseEnter={() => setOpenDropdown(link.label)}
                        onMouseLeave={() => setOpenDropdown(null)}
                        className="absolute top-full left-0 pt-2"
                      >
                        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-100 dark:border-gray-800 shadow-xl p-1.5 min-w-[180px]">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                pathname === child.href
                                  ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-500'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-orange-500 dark:hover:text-orange-400'
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-orange-500 dark:text-orange-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserMenu />
            <Link
              href="/contact"
              className="hidden sm:inline-flex btn-primary text-sm py-2 px-4"
            >
              Contact Us Now
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0A0A0A]">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              if (link.children) {
                return (
                  <div key={link.label}>
                    <p className="px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      {link.label}
                    </p>
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'block px-6 py-2 rounded-lg text-sm font-medium transition-colors',
                          pathname === child.href
                            ? 'text-orange-500 bg-orange-50 dark:bg-orange-500/10'
                            : 'text-gray-600 dark:text-gray-400 hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-gray-900'
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={cn(
                    'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-orange-500 bg-orange-50 dark:bg-orange-500/10'
                      : 'text-gray-600 dark:text-gray-400 hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-gray-900'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
              <Link href="/contact" className="btn-primary w-full justify-center">
                Contact Us Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
