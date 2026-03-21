# LumaShift Design System Overhaul — shadcn/ui (base-nova)

## Overview
Migrate from custom CSS component classes to shadcn/ui components while elevating the visual design. Keep the orange (#F97316) + cyan (#06B6D4) brand identity and cyber-themed aesthetics.

## Phase 1: Design System Foundation

### 1A: Install Core shadcn/ui Components
- [ ] Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription
- [ ] Badge (with custom brand variants)
- [ ] Sheet (mobile nav drawer)
- [ ] DropdownMenu (desktop nav dropdowns)
- [ ] Tabs, TabsList, TabsTrigger, TabsContent
- [ ] Avatar, AvatarImage, AvatarFallback
- [ ] Skeleton
- [ ] Separator
- [ ] Tooltip, TooltipTrigger, TooltipContent, TooltipProvider
- [ ] Progress

### 1B: Extend Button with Brand Variants
- [ ] Add `brand` variant (replaces `.btn-primary`) — orange bg, white text, shadow
- [ ] Add `brandOutline` variant (replaces `.btn-secondary`) — orange border, orange text
- [ ] Add `brandGhost` variant (replaces `.btn-ghost`) — subtle hover, no border
- [ ] Add size variants: `brand-sm`, `brand-lg` for common sizes

### 1C: Consolidate Dark Mode Tokens
- [ ] Decision: Use neutral palette (`#0A0A0A` / `#141414` / `#1E1E1E`) as base
- [ ] Map cyber colors to accent/decorative use only (backgrounds with cyber-grid, etc.)
- [ ] Replace all hardcoded `dark:bg-[#0A0A0A]` with `dark:bg-background`
- [ ] Replace all hardcoded `dark:bg-[#1E1E1E]` with `dark:bg-card`
- [ ] Replace all hardcoded `dark:bg-[#141414]` with `dark:bg-muted`
- [ ] Update oklch CSS variables to reflect the chosen palette

### 1D: Typography Scale
- [ ] Define named utilities: `text-display`, `text-headline`, `text-title`, `text-body-lg`, `text-caption`
- [ ] Each combines size + weight + tracking + line-height
- [ ] Replace repetitive `section-title` / `section-subtitle` with varied hierarchy

### 1E: Global CSS Cleanup
- [ ] Remove `*, *::before, *::after { transition-property }` from globals.css
- [ ] Apply transitions only to interactive elements (buttons, cards, links, inputs)
- [ ] Vary section padding: hero `py-32`, dense sections `py-16`, standard `py-20`
- [ ] Remove duplicate CTA (footer strip vs. final section)

## Phase 2: Component Migration

### 2A: Header Migration
- [ ] Desktop nav dropdowns → shadcn `DropdownMenu`
- [ ] Mobile nav → shadcn `Sheet` (slide-in from right)
- [ ] User menu → shadcn `DropdownMenu` + `Avatar`

### 2B: Homepage Card Migration
- [ ] Stats cards → shadcn `Card` with glassmorphism variant
- [ ] "Why LumaShift" cards → shadcn `Card` with left-border accent
- [ ] Career tools cards → shadcn `Card` with hover variant
- [ ] ServiceCard → shadcn `Card` with `CardHeader`, `CardContent`, `CardFooter`

### 2C: Badge Migration (7 files)
- [ ] Create badge variants: `brand`, `success`, `muted`, `info`
- [ ] Replace `.badge-orange`, `.badge-green`, `.badge-gray` across all files
- [ ] Migrate inline badge styles in dashboard

### 2D: Button Migration (20 files)
- [ ] Replace all `btn-primary` → `<Button variant="brand">`
- [ ] Replace all `btn-secondary` → `<Button variant="brandOutline">`
- [ ] Replace all `btn-ghost` → `<Button variant="brandGhost">`
- [ ] Handle Link-as-button cases (use `asChild` prop)

### 2E: Dashboard Migration
- [ ] Stats row → shadcn `Card` with consistent styling
- [ ] Profile completion → shadcn `Progress`
- [ ] User avatar → shadcn `Avatar`
- [ ] Saved items + Service interests → shadcn `Tabs`
- [ ] Loading states → shadcn `Skeleton`
- [ ] Combine "Recommended Services" + "Recommended Content" under `Tabs`

## Phase 3: Motion & Polish (Future)
- [ ] Install framer-motion or use CSS animations
- [ ] Scroll-triggered entrance animations
- [ ] Hero section animated elements
- [ ] Button/card micro-interactions
- [ ] Page transitions

## Phase 4: Verification
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] Visual regression check (light + dark mode)

## Files Affected

### Button migration (20 files):
- src/app/globals.css
- src/app/page.tsx
- src/app/auth/login/page.tsx
- src/app/auth/auth-error/page.tsx
- src/app/blog/[slug]/page.tsx
- src/app/career/[role]/page.tsx
- src/app/dashboard/page.tsx
- src/app/not-found.tsx
- src/app/profile/page.tsx
- src/app/resources/page.tsx
- src/app/team/page.tsx
- src/components/blog/BlogFilter.tsx
- src/components/compare/RoleCompare.tsx
- src/components/forms/ContactForm.tsx
- src/components/forms/ResourceUnlockForm.tsx
- src/components/layout/Header.tsx
- src/components/quiz/QuizComponent.tsx
- src/components/roadmap/RoadmapClient.tsx
- src/components/services/ServiceCard.tsx
- src/components/admin/UserManagement.tsx

### Card migration (10 files):
- src/app/globals.css
- src/app/blog/[slug]/page.tsx
- src/app/career/[role]/page.tsx
- src/app/contact/page.tsx
- src/app/dashboard/page.tsx
- src/app/profile/page.tsx
- src/app/resources/page.tsx
- src/components/blog/BlogCard.tsx
- src/components/quiz/QuizComponent.tsx
- src/components/services/ServiceCard.tsx

### Badge migration (7 files):
- src/app/blog/[slug]/page.tsx
- src/app/resources/page.tsx
- src/app/team/page.tsx
- src/components/compare/RoleCompare.tsx
- src/components/quiz/QuizComponent.tsx
- src/components/services/ServiceCard.tsx
- src/app/globals.css
