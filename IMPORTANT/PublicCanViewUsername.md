-- Create a policy for public username access
CREATE POLICY "Public can view usernames" ON profiles
FOR SELECT
USING (true);