-- LumaShift Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor after creating a new project.

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────────────────────────────────────────

-- Profiles: extends auth.users with career data
CREATE TABLE public.profiles (
  id              UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name            TEXT,
  email           TEXT NOT NULL,
  avatar_url      TEXT,
  location        TEXT,
  -- Career
  current_role    TEXT,
  years_experience INTEGER,
  career_stage    TEXT CHECK (career_stage IN (
    'student', 'fresh_graduate', 'entry_level', 'mid_career', 'senior', 'career_switcher'
  )),
  -- Cybersecurity interests
  target_roles          TEXT[] DEFAULT '{}',
  current_skills        TEXT[] DEFAULT '{}',
  certifications_obtained TEXT[] DEFAULT '{}',
  certifications_planned  TEXT[] DEFAULT '{}',
  -- Gamification cache
  total_points    INTEGER DEFAULT 0,
  -- Timestamps
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Activity logs: tracks all user interactions
CREATE TABLE public.activity_logs (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type    TEXT NOT NULL,  -- 'blog_read', 'resource_view', 'quiz_attempt', 'role_explored', 'roles_compared', 'service_viewed', 'service_requested'
  item_id       TEXT,           -- slug or ID
  item_title    TEXT,
  metadata      JSONB DEFAULT '{}',
  points_awarded INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Saved items: bookmarks for blog posts and resources
CREATE TABLE public.saved_items (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_type   TEXT NOT NULL CHECK (item_type IN ('blog_post', 'resource')),
  item_id     TEXT NOT NULL,
  item_title  TEXT,
  item_data   JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, item_type, item_id)
);

-- Quiz results: stores each quiz attempt
CREATE TABLE public.quiz_results (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  confidence_score      INTEGER NOT NULL,
  recommended_roles     TEXT[] DEFAULT '{}',
  recommended_services  TEXT[] DEFAULT '{}',
  strengths             TEXT[] DEFAULT '{}',
  gaps                  TEXT[] DEFAULT '{}',
  talk_to_coach         BOOLEAN DEFAULT false,
  answers               JSONB DEFAULT '{}',
  created_at            TIMESTAMPTZ DEFAULT now()
);

-- Service interests: tracks service views and requests
CREATE TABLE public.service_interests (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_id    TEXT NOT NULL,
  service_title TEXT,
  interest_type TEXT NOT NULL CHECK (interest_type IN ('viewed', 'requested', 'subscribed', 'coaching_requested')),
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- User badges: awarded achievements
CREATE TABLE public.user_badges (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id          TEXT NOT NULL,
  badge_name        TEXT NOT NULL,
  badge_description TEXT,
  badge_icon        TEXT,
  earned_at         TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, badge_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges      ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Activity logs
CREATE POLICY "activity_select" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "activity_insert" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Saved items
CREATE POLICY "saves_select" ON public.saved_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saves_insert" ON public.saved_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saves_delete" ON public.saved_items FOR DELETE USING (auth.uid() = user_id);

-- Quiz results
CREATE POLICY "quiz_select" ON public.quiz_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "quiz_insert" ON public.quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Service interests
CREATE POLICY "services_select" ON public.service_interests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "services_insert" ON public.service_interests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User badges
CREATE POLICY "badges_select" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "badges_insert" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- FUNCTIONS & TRIGGERS
-- ─────────────────────────────────────────────────────────────────────────────

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Auto-create profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      ''
    ),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX idx_activity_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_event_type ON public.activity_logs(event_type);
CREATE INDEX idx_saved_items_user_id ON public.saved_items(user_id);
CREATE INDEX idx_quiz_results_user_id ON public.quiz_results(user_id);
CREATE INDEX idx_service_interests_user_id ON public.service_interests(user_id);
CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);
