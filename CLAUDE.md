# LumaShift — Claude Code Guide

## Project Overview

LumaShift is a cybersecurity career coaching platform for Malaysian and global professionals. It is a Next.js website with auth, a user dashboard with gamification, a blog, a resource library, a career quiz, role comparison, an AI chatbot, and a contact form.

## Tech Stack

- **Framework**: Next.js (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS v3 with `@tailwindcss/typography`, `next-themes` for dark mode
- **Backend**: Next.js API routes, Supabase (auth + database)
- **AI**: Anthropic SDK (`@anthropic-ai/sdk`) for the chatbot
- **Forms**: Contact/resource forms submit to Google Sheets via a Google Apps Script webhook
- **Utilities**: `clsx`, `tailwind-merge` (via `src/lib/utils.ts`), `lucide-react` icons

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run type-check   # TypeScript check (tsc --noEmit)
```

## Project Structure

```
src/
  app/               # Next.js App Router pages and API routes
    api/             # API routes: contact, resources, chat, saves, quiz-result, activity, profile
    auth/            # Login and OAuth callback pages
    blog/            # Blog listing and [slug] pages
    career/[role]/   # Dynamic role detail pages
    dashboard/       # Authenticated user dashboard
    profile/         # User profile page
    resources/       # Resource library
    quiz/            # Career quiz
    compare-roles/   # Role comparison tool
    services/        # Services listing
    contact/         # Contact page
    team/            # Team page
  components/
    auth/            # UserMenu
    blog/            # BlogCard, BlogFilter, BlogActivityTracker, SaveButton
    chatbot/         # ChatBot (uses Anthropic API)
    compare/         # RoleCompare
    forms/           # ContactForm, ResourceUnlockForm
    home/            # TestimonialSlider
    layout/          # Header, Footer, Providers, ThemeToggle
    quiz/            # QuizComponent
    resources/       # BookmarkButton
    services/        # ServiceCard
  contexts/
    AuthContext.tsx  # Supabase auth state
  data/              # Static data files (services, blog-posts, testimonials, roles, quiz, team, resources)
  lib/
    supabase/        # client.ts and server.ts helpers
    gamification.ts  # Points and badge logic
    profile-completion.ts
    utils.ts         # cn() utility (clsx + tailwind-merge)
  types/
    index.ts         # All shared TypeScript interfaces

google-apps-script/  # Google Apps Script code for form-to-Sheets integration
supabase/            # Supabase local config
```

## Path Aliases

`@/` maps to `src/`. Always use `@/` imports, never relative paths crossing module boundaries.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_GOOGLE_SCRIPT_URL   # Google Apps Script webhook URL for contact/resource forms
ANTHROPIC_API_KEY               # For the AI chatbot (/api/chat)
```

Without `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`, contact form submissions are logged to the console and return `{ success: true, dev: true }` — safe for local dev.

## Key Conventions

- **Server vs Client Supabase**: Use `src/lib/supabase/server.ts` in Server Components and API routes; use `src/lib/supabase/client.ts` in Client Components.
- **Auth**: Magic link / OAuth via Supabase. Auth callback at `/auth/callback`. Auth state in `AuthContext`.
- **Gamification**: Points are awarded for activity events (blog reads, quiz completions, saves). Logic lives in `src/lib/gamification.ts`.
- **Static data**: Content (services, blog posts, team, roles, testimonials, quiz questions, resources) lives in `src/data/` as TypeScript files — no CMS.
- **Styling**: Use Tailwind utility classes. Custom CSS is minimal and lives in `src/app/globals.css`. Prefer `cn()` from `src/lib/utils.ts` for conditional class merging.
- **Dark mode**: Handled by `next-themes` via the `Providers` wrapper. Use `dark:` Tailwind variants.
- **`job_role` field**: The profile field is named `job_role` (not `current_role` — `current_role` is a PostgreSQL reserved word).

## Database (Supabase)

Key tables: `profiles`, `activity_logs`, `saved_items`, `quiz_results`, `user_badges`, `service_interests`.

All DB interactions go through the API routes in `src/app/api/` — client components call the API, not Supabase directly (except for auth).

## Workflow Orchestration
### 1. Plan Node Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity
### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One tack per subagent for focused execution
### 3. Self-Improvement Loop
- After ANY correction from the user: update "tasks/lessons.md" with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project
## 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness
### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it
### 6. Autonomous Bug Fizing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how
## Task Management
1. **PLan First**: Write plan to tasks/todo.md with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to "tasks/todo.md*
6. **Capture
Lessons**: Update tasks/lessons.md after corrections
## Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimat Impact**: Changes should only touch what's necessary. Avoid introducing bugs.