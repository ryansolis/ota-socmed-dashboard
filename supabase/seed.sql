-- Seed script for sample data
-- User A: admin@ota-socmed.com (4d159150-140e-4634-8e80-46bb984193f0)
-- User B: solis.rayanthony@gmail.com (a26ac931-b859-4acb-b079-5ee83f511d37)

-- ============================================
-- SAMPLE DATA FOR USER A
-- ============================================

-- User A Posts (Instagram and TikTok)
-- admin@ota-socmed.com (4d159150-140e-4634-8e80-46bb984193f0)
INSERT INTO posts (
  user_id, platform, caption, thumbnail_url, media_type, posted_at,
  likes, comments, shares, saves, reach, impressions, engagement_rate, permalink
) VALUES
-- Instagram posts for User A
('4d159150-140e-4634-8e80-46bb984193f0', 'instagram', 'Excited to share our latest product launch! What do you think? #startup #launch', 'https://picsum.photos/seed/post1/400/400', 'image', NOW() - INTERVAL '15 days', 1243, 89, 45, 156, 15420, 18650, 8.2, 'https://instagram.com/p/example1'),
('4d159150-140e-4634-8e80-46bb984193f0', 'instagram', 'Monday motivation! How are you starting your week?', 'https://picsum.photos/seed/post3/400/400', 'carousel', NOW() - INTERVAL '13 days', 876, 56, 23, 89, 9800, 11200, 6.8, 'https://instagram.com/p/example3'),
('4d159150-140e-4634-8e80-46bb984193f0', 'instagram', 'Just shipped a new feature! Check it out 🚀', 'https://picsum.photos/seed/post4/400/400', 'image', NOW() - INTERVAL '10 days', 2156, 142, 78, 234, 22100, 26400, 9.5, 'https://instagram.com/p/example4'),
('4d159150-140e-4634-8e80-46bb984193f0', 'instagram', 'Behind the scenes of our team working late', 'https://picsum.photos/seed/post5/400/400', 'image', NOW() - INTERVAL '8 days', 945, 67, 34, 123, 10500, 11800, 8.1, 'https://instagram.com/p/example5'),
('4d159150-140e-4634-8e80-46bb984193f0', 'instagram', 'Customer success story! Read about how we helped...', 'https://picsum.photos/seed/post6/400/400', 'carousel', NOW() - INTERVAL '5 days', 1876, 124, 67, 189, 19500, 22100, 9.2, 'https://instagram.com/p/example6'),
('4d159150-140e-4634-8e80-46bb984193f0', 'instagram', 'Team lunch today! Great food and even better company 🍕', 'https://picsum.photos/seed/post7/400/400', 'image', NOW() - INTERVAL '3 days', 654, 43, 21, 78, 7200, 8300, 8.5, 'https://instagram.com/p/example7'),
-- TikTok posts for User A
('4d159150-140e-4634-8e80-46bb984193f0', 'tiktok', 'POV: You just launched your startup', 'https://picsum.photos/seed/post8/400/400', 'video', NOW() - INTERVAL '14 days', 5621, 234, 189, 423, 45000, 52000, 12.5, 'https://tiktok.com/@example/video/123'),
('4d159150-140e-4634-8e80-46bb984193f0', 'tiktok', 'Day in the life of a startup founder', 'https://picsum.photos/seed/post9/400/400', 'video', NOW() - INTERVAL '12 days', 8934, 456, 312, 678, 72000, 85000, 13.2, 'https://tiktok.com/@example/video/124'),
('4d159150-140e-4634-8e80-46bb984193f0', 'tiktok', 'React tips that saved me hours of debugging', 'https://picsum.photos/seed/post10/400/400', 'video', NOW() - INTERVAL '7 days', 12456, 678, 445, 890, 98000, 115000, 14.1, 'https://tiktok.com/@example/video/125'),
('4d159150-140e-4634-8e80-46bb984193f0', 'tiktok', 'Quick hack: How to use Supabase RLS', 'https://picsum.photos/seed/post11/400/400', 'video', NOW() - INTERVAL '4 days', 7623, 389, 267, 567, 68000, 79000, 13.8, 'https://tiktok.com/@example/video/126'),
('4d159150-140e-4634-8e80-46bb984193f0', 'tiktok', 'This one weird trick improved our engagement by 300%', 'https://picsum.photos/seed/post12/400/400', 'video', NOW() - INTERVAL '2 days', 9876, 512, 389, 723, 89000, 102000, 14.5, 'https://tiktok.com/@example/video/127');

-- User A Daily Metrics (last 30 days)
-- admin@ota-socmed.com (4d159150-140e-4634-8e80-46bb984193f0)
INSERT INTO daily_metrics (user_id, date, engagement, reach)
SELECT 
  '4d159150-140e-4634-8e80-46bb984193f0'::uuid,
  generate_series(NOW()::date - INTERVAL '29 days', NOW()::date, '1 day'::interval)::date AS date,
  (random() * 2000 + 300)::integer AS engagement,
  (random() * 15000 + 5000)::integer AS reach
ON CONFLICT (user_id, date) DO NOTHING;

-- ============================================
-- SAMPLE DATA FOR USER B
-- ============================================

-- User B Posts (Instagram and TikTok)
-- solis.rayanthony@gmail.com (a26ac931-b859-4acb-b079-5ee83f511d37)
INSERT INTO posts (
  user_id, platform, caption, thumbnail_url, media_type, posted_at,
  likes, comments, shares, saves, reach, impressions, engagement_rate, permalink
) VALUES
-- Instagram posts for User B
('a26ac931-b859-4acb-b079-5ee83f511d37', 'instagram', 'Sunset vibes from my latest adventure 🌅', 'https://picsum.photos/seed/post13/400/400', 'image', NOW() - INTERVAL '16 days', 2341, 156, 89, 267, 26800, 31200, 8.8, 'https://instagram.com/p/example13'),
('a26ac931-b859-4acb-b079-5ee83f511d37', 'instagram', 'New recipe I tried today - turned out amazing!', 'https://picsum.photos/seed/post14/400/400', 'carousel', NOW() - INTERVAL '14 days', 1456, 98, 45, 178, 16800, 19200, 8.4, 'https://instagram.com/p/example14'),
('a26ac931-b859-4acb-b079-5ee83f511d37', 'instagram', 'Weekend hike in the mountains', 'https://picsum.photos/seed/post15/400/400', 'image', NOW() - INTERVAL '11 days', 3124, 201, 112, 345, 34100, 39800, 9.1, 'https://instagram.com/p/example15'),
('a26ac931-b859-4acb-b079-5ee83f511d37', 'instagram', 'Coffee shop productivity mode ☕', 'https://picsum.photos/seed/post16/400/400', 'image', NOW() - INTERVAL '9 days', 876, 54, 28, 98, 9200, 10500, 8.7, 'https://instagram.com/p/example16'),
('a26ac931-b859-4acb-b079-5ee83f511d37', 'instagram', 'My workspace setup - thoughts?', 'https://picsum.photos/seed/post17/400/400', 'carousel', NOW() - INTERVAL '6 days', 2134, 134, 78, 234, 22400, 25800, 9.3, 'https://instagram.com/p/example17'),
('a26ac931-b859-4acb-b079-5ee83f511d37', 'instagram', 'Throwback to last summer', 'https://picsum.photos/seed/post18/400/400', 'image', NOW() - INTERVAL '1 day', 543, 32, 18, 67, 5800, 6700, 8.2, 'https://instagram.com/p/example18'),
-- TikTok posts for User B
('a26ac931-b859-4acb-b079-5ee83f511d37', 'tiktok', 'Rate my setup 1-10', 'https://picsum.photos/seed/post19/400/400', 'video', NOW() - INTERVAL '15 days', 6789, 345, 234, 512, 54000, 63000, 13.5, 'https://tiktok.com/@example/video/128'),
('a26ac931-b859-4acb-b079-5ee83f511d37', 'tiktok', 'This coding tip changed everything', 'https://picsum.photos/seed/post20/400/400', 'video', NOW() - INTERVAL '13 days', 10234, 567, 389, 723, 89000, 104000, 14.2, 'https://tiktok.com/@example/video/129'),
('a26ac931-b859-4acb-b079-5ee83f511d37', 'tiktok', 'Day 30 of my coding challenge', 'https://picsum.photos/seed/post21/400/400', 'video', NOW() - INTERVAL '8 days', 15678, 812, 567, 1023, 124000, 145000, 15.1, 'https://tiktok.com/@example/video/130'),
('a26ac931-b859-4acb-b079-5ee83f511d37', 'tiktok', 'React vs Vue - my honest take', 'https://picsum.photos/seed/post22/400/400', 'video', NOW() - INTERVAL '6 days', 8123, 423, 298, 634, 76000, 88000, 13.9, 'https://tiktok.com/@example/video/131'),
('a26ac931-b859-4acb-b079-5ee83f511d37', 'tiktok', 'Building a dashboard in 24 hours', 'https://picsum.photos/seed/post23/400/400', 'video', NOW() - INTERVAL '3 days', 11234, 612, 423, 845, 101000, 118000, 14.6, 'https://tiktok.com/@example/video/132');

-- User B Daily Metrics (last 30 days)
-- solis.rayanthony@gmail.com (a26ac931-b859-4acb-b079-5ee83f511d37)
INSERT INTO daily_metrics (user_id, date, engagement, reach)
SELECT 
  'a26ac931-b859-4acb-b079-5ee83f511d37'::uuid,
  generate_series(NOW()::date - INTERVAL '29 days', NOW()::date, '1 day'::interval)::date AS date,
  (random() * 2500 + 400)::integer AS engagement,
  (random() * 18000 + 6000)::integer AS reach
ON CONFLICT (user_id, date) DO NOTHING;
