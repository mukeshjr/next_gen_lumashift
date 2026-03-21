-- Generated resources table for AI-generated and manually created resources
CREATE TABLE IF NOT EXISTS generated_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'template', 'checklist', 'guide', 'video')),
  category TEXT NOT NULL,
  free BOOLEAN DEFAULT true,
  download_url TEXT,
  published BOOLEAN DEFAULT false,
  generated_by_ai BOOLEAN DEFAULT false,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_generated_resources_published ON generated_resources(published);
CREATE INDEX IF NOT EXISTS idx_generated_resources_type ON generated_resources(type);
CREATE INDEX IF NOT EXISTS idx_generated_resources_category ON generated_resources(category);

-- Enable RLS
ALTER TABLE generated_resources ENABLE ROW LEVEL SECURITY;

-- Public read access for published resources
CREATE POLICY "Published resources visible to all"
  ON generated_resources FOR SELECT
  USING (published = true);

-- Authenticated users can create resources
CREATE POLICY "Auth users can create"
  ON generated_resources FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their own resources
CREATE POLICY "Authors can update"
  ON generated_resources FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

-- Authors can delete their own resources
CREATE POLICY "Authors can delete"
  ON generated_resources FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Admin policy: allow admin users full access
CREATE POLICY "Admins can manage all resources"
  ON generated_resources FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'is_admin' = 'true'
    )
  );
