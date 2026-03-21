-- Add role column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create index for fast role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Set Mukesh as admin (by email)
UPDATE profiles SET role = 'admin' WHERE email = 'mukesh271194@gmail.com';

-- Update blog_posts RLS: replace the admin policy to use profiles.role
DROP POLICY IF EXISTS "Admins can manage all posts" ON blog_posts;

CREATE POLICY "Admins can manage all posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Update generated_resources RLS: add admin policy
CREATE POLICY "Admins can manage all resources"
  ON generated_resources FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
