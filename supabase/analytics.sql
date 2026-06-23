-- Page views analytics table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone visiting the site to record a page view
CREATE POLICY "Allow anonymous page view inserts" ON page_views
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Only authenticated users can read stats (adjust as needed)
CREATE POLICY "Allow authenticated users to read stats" ON page_views
  FOR SELECT TO authenticated USING (true);

-- Helper function to get top paths
CREATE OR REPLACE FUNCTION get_top_paths(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(path TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT pv.path, COUNT(*)::BIGINT as count
  FROM page_views pv
  GROUP BY pv.path
  ORDER BY count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
