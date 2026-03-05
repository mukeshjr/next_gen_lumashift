# LumaShift Website

Modern cybersecurity career coaching website for LumaShift. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

---

## User Accounts & Gamification Setup (Supabase)

LumaShift uses **Supabase** for passwordless authentication, user profiles, and gamification.

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Copy your **Project URL** and **anon key** from `Settings → API`

### 2. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Open `src/lib/supabase/schema.sql` from this project
3. Paste the entire file contents and click **Run**

This creates:
- `profiles` — User career profiles
- `activity_logs` — Engagement tracking
- `saved_items` — Blog + resource bookmarks
- `quiz_results` — Career quiz history
- `service_interests` — Service views/requests
- `user_badges` — Earned achievements

### 3. Configure Google OAuth

1. In Supabase: **Authentication → Providers → Google → Enable**
2. Go to [Google Cloud Console](https://console.cloud.google.com)
3. Create OAuth 2.0 credentials
4. Set Authorized redirect URI to: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
5. Copy **Client ID** and **Client Secret** back to Supabase

### 4. Configure Email Magic Links

Email magic links work automatically via Supabase Auth — no extra setup needed.

**Optional: Custom SMTP** (for branded emails)
- Supabase → `Authentication → Email Templates` — customise the login email
- Supabase → `Settings → Auth → SMTP` — add your SMTP server

### 5. Set Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Authentication Flow

**Google OAuth:**
1. User clicks "Continue with Google"
2. Redirected to Google → Google confirms identity
3. Supabase callback at `/auth/callback?code=...`
4. Session created → User redirected to `/dashboard`

**Email Magic Link:**
1. User enters email → Supabase sends a one-time link (expires 1 hour)
2. User clicks link → Supabase callback at `/auth/callback?token_hash=...`
3. Session verified → User redirected to `/dashboard`
4. Links are single-use and expire after 1 hour (Supabase default)
5. UI enforces a 60-second cooldown between resend requests

### Login-Gated Features

| Feature | Auth Required | Reason |
|---------|--------------|--------|
| Career Quiz | Yes | Save results, award points/badges |
| Save blog posts | Yes | Requires user account |
| Bookmark resources | Yes | Requires user account |
| Dashboard | Yes | Personal data |
| Profile editing | Yes | Personal data |
| Homepage | No | Public marketing |
| Services page | No | Public marketing |
| Blog previews | No | Public content |
| Career pages | No | Public content |
| Contact page | No | Public contact |

---

---

## Quick Start (Local Preview)

### Prerequisites

- **Node.js 18+** — [download](https://nodejs.org/)
- **npm** (comes with Node) or **pnpm**

### 1. Clone or copy the repo

```bash
# If you uploaded to GitHub:
git clone https://github.com/YOUR_USERNAME/lumashift.git
cd lumashift

# Or just navigate to the folder:
cd /path/to/lumashift
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and set:
```env
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CONTACT_EMAIL=lumashift@outlook.com
```

> **Note:** The site works fully without the Google Script URL — forms will log to the server console in development mode. Set the URL when you're ready to go live.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The site hot-reloads as you edit files.

### 5. Build for production (optional local test)

```bash
npm run build
npm start
```

---

## Project Structure

```
lumashift/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout (Header, Footer, Providers)
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles + Tailwind base
│   │   ├── services/           # Services page
│   │   ├── team/               # Founders page
│   │   ├── blog/               # Blog index + [slug] post pages
│   │   ├── resources/          # Resources page
│   │   ├── quiz/               # Career quiz
│   │   ├── compare-roles/      # Role comparison tool
│   │   ├── career/[role]/      # Career landing pages (6 roles)
│   │   ├── contact/            # Contact page
│   │   └── api/
│   │       ├── contact/        # Contact form API handler
│   │       └── resources/      # Resource unlock API handler
│   ├── components/
│   │   ├── layout/             # Header, Footer, ThemeToggle, Providers
│   │   ├── home/               # Hero, TestimonialSlider, CTAs
│   │   ├── services/           # ServiceCard
│   │   ├── blog/               # BlogCard
│   │   ├── quiz/               # QuizComponent (full interactive quiz)
│   │   ├── compare/            # RoleCompare (dynamic comparison table)
│   │   └── forms/              # ContactForm, ResourceUnlockForm
│   ├── data/                   # All content as TypeScript files
│   │   ├── services.ts         # 13 services across 3 tiers
│   │   ├── blog-posts.ts       # 6 sample blog posts (published flag)
│   │   ├── roles.ts            # 6 cybersecurity role profiles
│   │   ├── team.ts             # Mukesh + Lavanyah profiles
│   │   ├── resources.ts        # Free + premium resources
│   │   ├── testimonials.ts     # 6 client testimonials
│   │   └── quiz.ts             # Quiz questions + scoring logic
│   ├── lib/
│   │   └── utils.ts            # cn(), formatDate(), env vars
│   └── types/
│       └── index.ts            # All TypeScript interfaces
├── google-apps-script/
│   └── Code.gs                 # Google Apps Script for form → Sheets + email
├── public/
│   └── (add logo.png, favicon here)
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

---

## Content Editing Guide

All content lives in `src/data/`. No CMS or database required.

### Adding / Editing Services (`src/data/services.ts`)

Each service is a TypeScript object:

```typescript
{
  id: 'unique-id',           // Used in URLs: /contact?service=unique-id
  title: 'Service Name',
  tier: 'starter' | 'professional' | 'advanced',
  forWho: 'Who this is for',
  description: 'Short description',
  outcomes: ['Outcome 1', 'Outcome 2'],
  price: 'From RM 150',
  duration: '3 business days',
  popular: true,             // Shows "Most Popular" badge + orange ring
  tag: 'Custom label',       // Shown if popular is false
}
```

### Adding / Hiding Blog Posts (`src/data/blog-posts.ts`)

To **unpublish** a post without deleting it:
```typescript
published: false,  // Change true → false
```

To **add a new post**, append to the array:
```typescript
{
  slug: 'my-new-post',       // URL: /blog/my-new-post
  title: 'Post Title',
  excerpt: 'Short summary for card view',
  content: `                 // Markdown-like content
## Section Heading

Paragraph text here.

- Bullet point 1
- Bullet point 2
  `,
  category: 'Career Guide',
  tags: ['Tag1', 'Tag2'],
  author: 'Mukesh Vijaiyan',
  date: '2025-03-01',
  readTime: '5 min read',
  published: true,
}
```

### Editing Team Profiles (`src/data/team.ts`)

Update the `bio`, `expertise`, `certifications`, and `linkedIn` fields directly.

To add a **logo/photo**, place the image in `public/team/` and reference it:
```typescript
avatar: '/team/mukesh.jpg'
```

### Adding Resources (`src/data/resources.ts`)

For free resources, add a `downloadUrl` pointing to a file in `public/resources/`.

---

## Google Apps Script Setup (Form → Sheets + Email)

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) → New spreadsheet
2. Name it "LumaShift CRM" or similar
3. Copy the Sheet ID from the URL: `docs.google.com/spreadsheets/d/**SHEET_ID**/edit`

### Step 2: Create the Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Click **New Project**
3. Delete default content, paste the contents of `google-apps-script/Code.gs`
4. Set your values at the top of the file:
   ```javascript
   const CONFIG = {
     SPREADSHEET_ID: 'YOUR_SHEET_ID_HERE',
     NOTIFICATION_EMAIL: 'lumashift@outlook.com',
     ...
   };
   ```
5. Click the **floppy disk icon** to save

### Step 3: Test it locally

1. In Apps Script, run the `testSetup()` function
2. Authorise permissions when prompted
3. Check your Google Sheet — a test row should appear
4. Check lumashift@outlook.com — a test email should arrive

### Step 4: Deploy as Web App

1. Click **Deploy → New Deployment**
2. Select **Web App** as type
3. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy** → copy the Web App URL

### Step 5: Add URL to `.env.local`

```env
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

> **Important:** After any code changes to the Apps Script, you must create a **New Deployment** (not update existing) to get a fresh URL.

---

## Logo / Favicon Setup

1. Place your logo file as `public/logo.png` (transparent PNG recommended)
2. Place a 32×32 or 64×64 version as `public/favicon.ico`
3. Place a 180×180 version as `public/apple-icon.png`

The header uses a text logo by default. To switch to an image logo, edit `src/components/layout/Header.tsx`:

```tsx
// Replace the Shield icon + text with:
import Image from 'next/image';
// ...
<Image src="/logo.png" alt="LumaShift" width={120} height={40} />
```

---

## Light / Dark Mode

Implemented via `next-themes`. Toggle is in the header.

- Default: light mode
- System preference detection: enabled
- State persists in `localStorage`

---

## Hosting Comparison

| Platform | Free Tier | Paid (Est.) | Deploy Method | Best For |
|----------|-----------|-------------|----------------|----------|
| **Vercel** | Yes (generous) | ~$20/mo Pro | Git push / CLI | **Recommended** |
| **Cloudflare Pages** | Yes (unlimited bandwidth) | ~$5/mo | Git push / CLI | Best free bandwidth |
| **Netlify** | Yes | ~$19/mo Pro | Git push / CLI | Similar to Vercel |
| **AWS (Self-host)** | 12 months free tier | ~$10–50/mo | EC2/ECS + manual | Max control, more ops work |
| **Render** | Yes (sleeps after 15min) | ~$7/mo | Git push | Budget option |

### Recommendation: Cloudflare Pages (Free → Grow)

**Why Cloudflare Pages for LumaShift:**

1. **Free tier is genuinely unlimited** — no bandwidth limits, no function execution limits at the scale LumaShift will start at
2. **Global CDN by default** — fast everywhere, including Malaysia
3. **Zero cost until significant scale** — Vercel's free tier limits builds and bandwidth; Cloudflare doesn't
4. **Next.js is supported** via the `@cloudflare/next-on-pages` adapter

**Upgrade path:** If you need advanced features (Vercel Analytics, Edge Middleware, etc.), migrate to Vercel's Pro plan at ~$20/mo when revenue supports it.

---

## Deployment Instructions

### Option A: Cloudflare Pages (Recommended)

#### Prerequisites
- GitHub account
- Cloudflare account (free at [cloudflare.com](https://cloudflare.com))

#### Step 1: Push to GitHub

```bash
cd lumashift
git init
git add .
git commit -m "Initial LumaShift website"
git remote add origin https://github.com/YOUR_USERNAME/lumashift.git
git push -u origin main
```

#### Step 2: Connect to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages → Pages → Create application**
3. Select **Connect to Git** → Select your `lumashift` repo
4. Configure build:
   - **Framework preset:** Next.js
   - **Build command:** `npm run build`
   - **Build output:** `.next`
   - **Node.js version:** `18` (set in Environment Variables: `NODE_VERSION = 18`)

#### Step 3: Set Environment Variables

In Cloudflare Pages → Settings → Environment Variables, add:
```
NEXT_PUBLIC_GOOGLE_SCRIPT_URL = https://script.google.com/...
NEXT_PUBLIC_SITE_URL           = https://lumashift.com
NEXT_PUBLIC_CONTACT_EMAIL      = lumashift@outlook.com
```

#### Step 4: Add Custom Domain

1. Pages → Custom domains → Add domain: `lumashift.com`
2. Point your domain's nameservers to Cloudflare (if not already)
3. SSL is automatic

#### Step 5: Deploy

Every `git push` to `main` triggers an automatic deploy. That's it.

---

### Option B: Vercel (Alternative)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Deploy

```bash
cd lumashift
vercel
```

Follow the prompts:
- Set up and deploy: **Y**
- Scope: your Vercel account
- Link to existing project: **N**
- Project name: `lumashift`
- In which directory is your code? `./`
- Override settings: **N**

#### Step 3: Set Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:
```
NEXT_PUBLIC_GOOGLE_SCRIPT_URL = https://script.google.com/...
NEXT_PUBLIC_SITE_URL           = https://lumashift.com
NEXT_PUBLIC_CONTACT_EMAIL      = lumashift@outlook.com
```

#### Step 4: Add Custom Domain

Vercel Dashboard → Project → Settings → Domains → Add `lumashift.com`

#### Ongoing deploys

```bash
# Push to GitHub and Vercel auto-deploys, OR:
vercel --prod
```

---

## Sanity Check: Common Deployment Errors & Fixes

### Error: `Module not found: Can't resolve '@/components/...'`

**Fix:** Ensure `tsconfig.json` has the `@/*` path alias:
```json
"paths": { "@/*": ["./src/*"] }
```
And `next.config.mjs` does not override this.

---

### Error: `Error: NEXT_PUBLIC_* variable is undefined`

**Fix:** Environment variables must be set in the hosting platform's dashboard (not just `.env.local`). `.env.local` is never deployed.

---

### Error: `ReferenceError: window is not defined` during build

**Fix:** Any component using browser APIs (`window`, `document`, `localStorage`) must be a Client Component with `'use client'` at the top, or wrapped in a `useEffect`.

---

### Error: `Hydration failed` (text content mismatch)

**Fix:** The `ThemeToggle` component uses a `mounted` check to avoid this. If you add new theme-dependent components, follow the same pattern.

---

### Error: Build fails with `Type error`

**Fix:** Run locally first:
```bash
npm run type-check
```
Fix all TypeScript errors before pushing.

---

### Error: Cloudflare Pages — `Could not resolve import` or build fails

**Fix:** Cloudflare Pages requires the `@cloudflare/next-on-pages` adapter for full Next.js support. Alternatively, use **Cloudflare Pages with Static Export** by adding to `next.config.mjs`:
```javascript
const nextConfig = {
  output: 'export',
  // ...
};
```
Note: Static export disables API routes — use Cloudflare Workers or external services for form handling.

**Simplest fix:** Use Vercel, which has native Next.js support with zero configuration.

---

### Forms not submitting (Google Script 403/404)

**Fix:**
1. Ensure the Google Apps Script is deployed with **"Who has access: Anyone"** (not "Anyone with Google Account")
2. After any script changes, create a **New Deployment** — don't reuse old deployment URLs
3. Test the URL directly in a browser — it should return a JSON response

---

### Error: Blog post page returns 404

**Fix:** The `generateStaticParams()` function in `src/app/blog/[slug]/page.tsx` must return all published slugs. Ensure `published: true` is set for the post in `src/data/blog-posts.ts`.

---

## Updating Content

| What to change | File to edit |
|---------------|--------------|
| Services | `src/data/services.ts` |
| Blog posts | `src/data/blog-posts.ts` |
| Team profiles | `src/data/team.ts` |
| Testimonials | `src/data/testimonials.ts` |
| Resources | `src/data/resources.ts` |
| Role data | `src/data/roles.ts` |
| Quiz questions | `src/data/quiz.ts` |
| Nav links | `src/components/layout/Header.tsx` |
| Footer links | `src/components/layout/Footer.tsx` |
| Brand colours | `tailwind.config.ts` |
| SEO metadata | Each `page.tsx` file, `app/layout.tsx` |

---

## Development Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm start            # Serve production build locally
npm run lint         # ESLint check
npm run type-check   # TypeScript check
```

---

## Adding Google Analytics (Optional)

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Add to `src/app/layout.tsx`:

```tsx
import Script from 'next/script';

// Inside <head> or after <body>:
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

---

## Support

For questions about the codebase or deployment, email: **lumashift@outlook.com**
