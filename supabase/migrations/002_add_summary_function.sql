-- Database helper function for user summary
-- This function aggregates engagement metrics server-side for better performance

CREATE OR REPLACE FUNCTION get_user_summary(p_user_id UUID)
RETURNS TABLE (
  total_engagement BIGINT,
  total_posts BIGINT,
  average_engagement_rate NUMERIC,
  total_likes BIGINT,
  total_comments BIGINT,
  total_shares BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(p.likes + p.comments + p.shares), 0)::BIGINT as total_engagement,
    COUNT(p.id)::BIGINT as total_posts,
    COALESCE(
      AVG(CASE WHEN p.engagement_rate IS NOT NULL THEN p.engagement_rate END),
      0
    )::NUMERIC(5,2) as average_engagement_rate,
    COALESCE(SUM(p.likes), 0)::BIGINT as total_likes,
    COALESCE(SUM(p.comments), 0)::BIGINT as total_comments,
    COALESCE(SUM(p.shares), 0)::BIGINT as total_shares
  FROM posts p
  WHERE p.user_id = p_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_summary(UUID) TO authenticated;

-- Add comment
COMMENT ON FUNCTION get_user_summary(UUID) IS 'Aggregates user engagement metrics for performance optimization';
