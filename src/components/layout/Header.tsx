'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, Shield, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

type NavChild = { href: string; label: string };
type NavItem = { href?: string; label: string; children?: NavChild[] };

const PUBLIC_NAV: NavItem[] = [
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

const ADMIN_NAV: NavItem = {
  label: 'Admin',
  children: [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/blog', label: 'Blog Admin' },
    { href: '/admin/resources', label: 'Resources Admin' },
    { href: '/admin/users', label: 'User Management' },
  ],
};

export function Header() {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks: NavItem[] = user
    ? isAdmin
      ? [...PUBLIC_NAV, { href: '/dashboard', label: 'Dashboard' }, ADMIN_NAV]
      : [...PUBLIC_NAV, { href: '/dashboard', label: 'Dashboard' }]
    : PUBLIC_NAV;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 dark:bg-background/95 backdrop-blur-md shadow-sm border-b border-border'
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
            <span className="text-xl font-bold text-foreground tracking-tight">
              Luma<span className="text-orange-500">Shift</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.children) {
                return (
                  <DropdownMenu key={link.label}>
                    <DropdownMenuTrigger
                      className={cn(
                        'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium',
                        'text-muted-foreground hover:text-orange-500 dark:hover:text-orange-400 transition-colors outline-none'
                      )}
                    >
                      {link.label}
                      <ChevronDown size={14} className="transition-transform duration-200 data-[popup-open]:rotate-180" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" sideOffset={8} className="min-w-[180px]">
                      <DropdownMenuLabel>{link.label}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {link.children.map((child) => (
                        <DropdownMenuItem key={child.href} render={<Link href={child.href} />}>
                          <span className={cn(
                            pathname === child.href && 'text-orange-500 font-semibold'
                          )}>
                            {child.label}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                      : 'text-muted-foreground hover:text-orange-500 dark:hover:text-orange-400'
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
            <Link href="/contact">
              <Button variant="brand" size="brand-sm" className="hidden sm:inline-flex">
                Contact Us Now
              </Button>
            </Link>

            {/* Mobile menu trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" />
                }
              >
                <Menu size={20} />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[340px]">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                      <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Shield size={14} className="text-white" />
                      </div>
                      <span className="text-lg font-bold text-foreground">
                        Luma<span className="text-orange-500">Shift</span>
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4 mt-2">
                  {navLinks.map((link) => {
                    if (link.children) {
                      return (
                        <div key={link.label} className="mt-3">
                          <p className="px-3 py-1.5 text-caption text-muted-foreground">
                            {link.label}
                          </p>
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                'block px-6 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                pathname === child.href
                                  ? 'text-orange-500 bg-orange-50 dark:bg-orange-500/10'
                                  : 'text-muted-foreground hover:text-orange-500 hover:bg-muted'
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
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                          pathname === link.href
                            ? 'text-orange-500 bg-orange-50 dark:bg-orange-500/10'
                            : 'text-muted-foreground hover:text-orange-500 hover:bg-muted'
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                  <div className="pt-4 mt-3 border-t border-border">
                    <Link href="/contact" onClick={() => setMobileOpen(false)}>
                      <Button variant="brand" size="brand-default" className="w-full">
                        Contact Us Now
                      </Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
