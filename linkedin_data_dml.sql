-- =====================================================
-- LinkedIn Clone Database Data (DML)
-- Database: linkedin
-- Generated: September 4, 2025
-- =====================================================

USE linkedin;

-- =====================================================
-- Data Insert: Default Reactions
-- Must be inserted first as they're referenced by PostReactions
-- =====================================================
INSERT INTO Reactions (ReactionID, ReactionType) VALUES
(1, 'Like'),
(2, 'Celebrate'),
(3, 'Support'),
(4, 'Love'),
(5, 'Insightful'),
(6, 'Curious');

-- =====================================================
-- Data Insert: Users
-- Password hashes are for "password123" (in production, use proper hashing)
-- TESTING PASSWORDS (unhashed):
-- All users use password: "password123"
-- Admin users: alice_dev, jack_sales, test_alice, testuser2, admin@linkedin.com
-- =====================================================
INSERT INTO Users (UserID, UserName, Email, PasswordHash, UserRole, CreatedAt) VALUES
-- Original System Users (Password: "password123" for all)
(1, 'alice_dev', 'alice@company.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Admin', '2025-09-04 09:00:00'),     -- Login: alice@company.com / password123
(2, 'bob_manager', 'bob@company.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 09:00:30'),    -- Login: bob@company.com / password123
(3, 'charlie_eng', 'charlie@tech.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 09:01:00'),     -- Login: charlie@tech.com / password123
(4, 'diana_lead', 'diana@startup.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 09:01:30'),     -- Login: diana@startup.com / password123
(5, 'eve_designer', 'eve@creative.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 09:02:00'),     -- Login: eve@creative.com / password123
(6, 'frank_data', 'frank@analytics.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 09:02:30'),   -- Login: frank@analytics.com / password123
(7, 'grace_product', 'grace@product.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 09:03:00'),    -- Login: grace@product.com / password123
(8, 'henry_devops', 'henry@devops.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 09:03:30'),     -- Login: henry@devops.com / password123
(9, 'ivy_marketing', 'ivy@marketing.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 09:04:00'),   -- Login: ivy@marketing.com / password123
(10, 'jack_sales', 'jack@sales.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Admin', '2025-09-04 09:04:30'),        -- Login: jack@sales.com / password123 (ADMIN)

-- Primary Test Users (Password: "password123" for all)
(11, 'test_alice', 'test.alice@company.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Admin', '2025-09-04 10:00:00'),     -- Login: test.alice@company.com / password123 (ADMIN)
(12, 'test_bob', 'test.bob@company.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 10:30:00'),       -- Login: test.bob@company.com / password123

-- Mock Test Users (Password: "password123" for all)
(21, 'john_smith', 'john.smith@email.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 13:52:00'),        -- Login: john.smith@email.com / password123
(22, 'emily_johnson', 'emily.johnson@email.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 13:52:10'),    -- Login: emily.johnson@email.com / password123
(23, 'michael_brown', 'michael.brown@email.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 13:52:20'),     -- Login: michael.brown@email.com / password123
(24, 'sarah_davis', 'sarah.davis@email.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 13:52:30'),        -- Login: sarah.davis@email.com / password123
(25, 'david_wilson', 'david.wilson@email.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 13:52:40'),      -- Login: david.wilson@email.com / password123
(26, 'lisa_martinez', 'lisa.martinez@email.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 13:52:50'),     -- Login: lisa.martinez@email.com / password123
(27, 'james_taylor', 'james.taylor@email.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 13:53:00'),      -- Login: james.taylor@email.com / password123
(28, 'jennifer_anderson', 'jennifer.anderson@email.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 13:53:10'), -- Login: jennifer.anderson@email.com / password123
(29, 'robert_thomas', 'robert.thomas@email.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 13:53:20'),      -- Login: robert.thomas@email.com / password123
(30, 'maria_garcia', 'maria.garcia@email.com', '$2b$10$rZZxTrgDNI7q4lWZ9K8W/OzOgNzg5hHGvSBzUHJ8NX9ksK5n7Yf.i', 'Normal', '2025-09-04 13:53:30');       -- Login: maria.garcia@email.com / password123

-- =====================================================
-- Data Insert: Posts
-- Various post types including Mixed content posts
-- =====================================================
INSERT INTO Posts (PostID, UserID, PostType, Content, CreatedAt) VALUES
(1, 1, 'Text', 'Excited to announce our new AI initiative! Looking forward to the challenges ahead. #AI #Innovation #TechLeadership', '2025-09-04 09:01:11'),
(2, 2, 'Image', 'Team photo from our quarterly meeting. Great discussions about upcoming projects! #TeamWork #Collaboration\nImages: team_meeting_q4.jpg, whiteboard_session.jpg', '2025-09-04 09:01:11'),
(3, 3, 'Article', 'The Future of Microservices: Lessons Learned from 5 Years in Production - A comprehensive guide to scaling distributed systems.', '2025-09-04 09:01:11'),
(4, 4, 'Video', 'Quick demo of our new deployment pipeline. Reduced deployment time from 45 minutes to 3 minutes! #DevOps #Automation', '2025-09-04 09:01:11'),
(5, 5, 'Text', 'Just finished an amazing UX workshop. The insights on user journey mapping were incredible! #UX #Design #UserExperience', '2025-09-04 09:01:11'),
(6, 6, 'Image', 'Data visualization showing our Q4 performance metrics. The growth is phenomenal! #DataScience #Analytics\nImages: q4_dashboard.png, metrics_chart.jpg, growth_graph.png', '2025-09-04 09:01:11'),
(7, 7, 'Article', 'Product Strategy in the Age of Remote Work: How We Adapted Our Roadmap for Distributed Teams and Increased Productivity by 40%.', '2025-09-04 09:01:11'),
(8, 8, 'Text', 'Infrastructure update: Successfully migrated 500+ microservices to Kubernetes. Zero downtime! #DevOps #Kubernetes #CloudNative', '2025-09-04 09:01:11'),
(9, 9, 'Video', 'Behind the scenes of our latest marketing campaign. The creative process from ideation to execution. #Marketing #Creative', '2025-09-04 09:01:11'),
(10, 10, 'Text', 'Closed the biggest deal of the quarter! Our enterprise solution is really resonating with Fortune 500 companies. #Sales #Enterprise', '2025-09-04 09:01:11'),
(11, 11, 'Text', 'Testing the API with a new post! Everything is working great. #API #Testing #LinkedIn', '2025-09-04 12:31:34'),
(12, 11, 'Image', 'API testing screenshots showing all endpoints working perfectly! #API #Success #Backend\nImages: api_test_results.png, postman_collection.jpg, endpoint_responses.png', '2025-09-04 12:31:34'),
(13, 11, 'Text', 'Testing the API with a new post! Everything is working great. #API #Testing #LinkedIn', '2025-09-04 12:32:48'),
(14, 11, 'Image', 'API testing screenshots showing all endpoints working perfectly! #API #Success #Backend\nImages: api_test_results.png, postman_collection.jpg, endpoint_responses.png', '2025-09-04 12:32:48'),
(15, 21, 'Mixed', 'Check out our amazing team building event! Had such a great time with everyone 🎉 #TeamBuilding #Fun', '2025-09-04 13:52:48'),
(16, 22, 'Image', '', '2025-09-04 13:52:48'),
(17, 11, 'Mixed', 'Excited to share our team''s latest project achievements! 🎉 The collaboration has been incredible and the results speak for themselves. #TeamWork #Innovation #ProjectSuccess', '2025-09-04 13:58:24'),
(18, 11, 'Image', '', '2025-09-04 13:58:24'),
(19, 11, 'Mixed', 'Quick walkthrough of our new development workflow! This has improved our deployment speed by 300% 🚀 #DevOps #Efficiency #TechTips', '2025-09-04 13:58:24'),
(20, 11, 'Mixed', 'Complete guide to our API testing strategy! From unit tests to integration tests, here''s everything we learned. #API #Testing #BestPractices', '2025-09-04 13:58:24'),
(21, 11, 'Mixed', 'Celebrating our company''s 5th anniversary! 🎂 Amazing journey with incredible people. Here''s to many more years of innovation! #Anniversary #Milestone #Grateful', '2025-09-04 13:58:24'),
(22, 11, 'Mixed', 'Behind the scenes of our product launch event! From preparation to execution, what an incredible experience. #ProductLaunch #BehindTheScenes #EventManagement', '2025-09-04 13:58:24');

-- =====================================================
-- Data Insert: PostMedia
-- Media attachments for Mixed and Image posts
-- =====================================================
INSERT INTO PostMedia (MediaID, PostID, MediaType, MediaURL, MediaOrder, CreatedAt) VALUES
-- Post 15 (john_smith team building event)
(1, 15, 'Image', 'https://example.com/images/team-event-1.jpg', 1, '2025-09-04 13:52:48'),
(2, 15, 'Image', 'https://example.com/images/team-event-2.jpg', 2, '2025-09-04 13:52:48'),
(3, 15, 'Image', 'https://example.com/images/team-event-3.jpg', 3, '2025-09-04 13:52:48'),

-- Post 16 (emily_johnson portfolio)
(4, 16, 'Image', 'https://example.com/images/portfolio-1.jpg', 1, '2025-09-04 13:52:48'),
(5, 16, 'Image', 'https://example.com/images/portfolio-2.jpg', 2, '2025-09-04 13:52:48'),

-- Post 17 (test_alice project achievements)
(6, 17, 'Image', 'https://example.com/images/project-dashboard.jpg', 1, '2025-09-04 13:58:24'),
(7, 17, 'Image', 'https://example.com/images/team-celebration.jpg', 2, '2025-09-04 13:58:24'),
(8, 17, 'Image', 'https://example.com/images/project-metrics.jpg', 3, '2025-09-04 13:58:24'),

-- Post 18 (test_alice office tour)
(9, 18, 'Image', 'https://example.com/images/office-tour-1.jpg', 1, '2025-09-04 13:58:24'),
(10, 18, 'Image', 'https://example.com/images/office-tour-2.jpg', 2, '2025-09-04 13:58:24'),
(11, 18, 'Image', 'https://example.com/images/office-tour-3.jpg', 3, '2025-09-04 13:58:24'),
(12, 18, 'Image', 'https://example.com/images/office-tour-4.jpg', 4, '2025-09-04 13:58:24'),

-- Post 19 (test_alice development workflow)
(13, 19, 'Video', 'https://example.com/videos/workflow-demo.mp4', 1, '2025-09-04 13:58:24'),

-- Post 20 (test_alice API testing guide - mixed content)
(14, 20, 'Image', 'https://example.com/images/api-architecture.jpg', 1, '2025-09-04 13:58:24'),
(15, 20, 'Video', 'https://example.com/videos/api-testing-demo.mp4', 2, '2025-09-04 13:58:24'),
(16, 20, 'Image', 'https://example.com/images/test-results.jpg', 3, '2025-09-04 13:58:24'),
(17, 20, 'Image', 'https://example.com/images/postman-collection.jpg', 4, '2025-09-04 13:58:24'),

-- Post 21 (test_alice anniversary celebration)
(18, 21, 'Image', 'https://example.com/images/anniversary-celebration.jpg', 1, '2025-09-04 13:58:24'),

-- Post 22 (test_alice product launch)
(19, 22, 'Video', 'https://example.com/videos/event-preparation.mp4', 1, '2025-09-04 13:58:24'),
(20, 22, 'Video', 'https://example.com/videos/product-demo-live.mp4', 2, '2025-09-04 13:58:24'),
(21, 22, 'Video', 'https://example.com/videos/audience-reactions.mp4', 3, '2025-09-04 13:58:24');

-- =====================================================
-- Data Insert: Connections
-- User relationship data with various statuses
-- =====================================================
INSERT INTO Connections (UserID, RecipientID, Status, CreatedAt) VALUES
-- Original connections
(1, 2, 'Accepted', '2025-09-04 09:10:00'),
(2, 3, 'Accepted', '2025-09-04 09:15:00'),
(3, 4, 'Accepted', '2025-09-04 09:20:00'),
(4, 5, 'Accepted', '2025-09-04 09:25:00'),
(5, 6, 'Accepted', '2025-09-04 09:30:00'),
(1, 6, 'Pending', '2025-09-04 09:35:00'),
(2, 7, 'Pending', '2025-09-04 09:40:00'),
(8, 1, 'Pending', '2025-09-04 09:45:00'),
(9, 2, 'Rejected', '2025-09-04 09:50:00'),
(10, 3, 'Pending', '2025-09-04 09:55:00'),
(11, 3, 'Pending', '2025-09-04 10:00:00'),

-- Mock user connections to test_alice (UserID 11)
(21, 11, 'Accepted', '2025-09-04 13:54:00'),
(22, 11, 'Pending', '2025-09-04 13:54:10'),
(23, 11, 'Rejected', '2025-09-04 13:54:20'),
(24, 11, 'Pending', '2025-09-04 13:54:30'),
(25, 11, 'Pending', '2025-09-04 13:54:40'),
(26, 11, 'Pending', '2025-09-04 13:54:50'),
(27, 11, 'Accepted', '2025-09-04 13:55:00'),
(28, 11, 'Pending', '2025-09-04 13:55:10'),
(29, 11, 'Accepted', '2025-09-04 13:55:20'),
(30, 11, 'Pending', '2025-09-04 13:55:30');

-- =====================================================
-- Data Insert: Sample PostReactions
-- Example reactions to demonstrate functionality
-- =====================================================
INSERT INTO PostReactions (PostID, UserID, ReactionID, CreatedAt) VALUES
-- Reactions to alice_dev's AI post (PostID 1)
(1, 2, 1, '2025-09-04 09:10:00'), -- bob likes alice's post
(1, 3, 2, '2025-09-04 09:15:00'), -- charlie celebrates alice's post
(1, 4, 5, '2025-09-04 09:20:00'), -- diana finds it insightful

-- Reactions to bob's team meeting post (PostID 2)
(2, 1, 1, '2025-09-04 09:25:00'), -- alice likes bob's post
(2, 3, 3, '2025-09-04 09:30:00'), -- charlie supports bob's post

-- Reactions to test_alice's mixed content posts
(17, 21, 1, '2025-09-04 14:00:00'), -- john likes the project post
(17, 22, 2, '2025-09-04 14:05:00'), -- emily celebrates the project post
(20, 21, 5, '2025-09-04 14:10:00'), -- john finds API guide insightful
(20, 29, 1, '2025-09-04 14:15:00'), -- robert likes API guide
(22, 27, 2, '2025-09-04 14:20:00'); -- james celebrates product launch

-- =====================================================
-- Data Insert: Sample Comments
-- Example comments with threading
-- =====================================================
INSERT INTO Comments (CommentID, PostID, UserID, CommentText, ReplyToID, CreatedAt) VALUES
-- Comments on alice_dev's AI initiative post (PostID 1)
(1, 1, 2, 'This sounds amazing! Can''t wait to see what you build with AI. When do you expect the first prototype?', NULL, '2025-09-04 09:30:00'),
(2, 1, 3, 'AI is definitely the future. Are you focusing on machine learning or more general AI applications?', NULL, '2025-09-04 09:35:00'),
(3, 1, 1, 'Thanks for the enthusiasm! We''re starting with ML applications for data analysis. Prototype should be ready in Q1 2025.', 1, '2025-09-04 09:45:00'),

-- Comments on bob's team meeting post (PostID 2)
(4, 2, 1, 'Great meeting! The project roadmap looks solid. Looking forward to the next quarterly review.', NULL, '2025-09-04 09:40:00'),
(5, 2, 7, 'The whiteboard brainstorming session was particularly productive. Great ideas from everyone!', NULL, '2025-09-04 09:50:00'),

-- Comments on test_alice's mixed content posts
(6, 17, 21, 'Incredible results! The dashboard metrics really show the impact of your hard work. 📊', NULL, '2025-09-04 14:05:00'),
(7, 17, 22, 'Amazing collaboration! This is what teamwork looks like. Congratulations to the entire team! 🎉', NULL, '2025-09-04 14:10:00'),
(8, 17, 11, 'Thank you both! It really was a team effort. The metrics speak for themselves - 40% improvement in efficiency!', 6, '2025-09-04 14:15:00'),

(9, 20, 21, 'This API testing guide is exactly what our team needed! The video demo is super helpful. 🔧', NULL, '2025-09-04 14:25:00'),
(10, 20, 29, 'Love the comprehensive approach to testing. The Postman collection examples are gold! 💎', NULL, '2025-09-04 14:30:00'),
(11, 20, 11, 'Glad it''s helpful! We learned a lot during this implementation. Feel free to reach out if you have questions.', 9, '2025-09-04 14:35:00'),

(12, 22, 27, 'Behind the scenes content is always fascinating! The preparation that goes into these events is incredible. 🎬', NULL, '2025-09-04 14:40:00'),
(13, 22, 30, 'The audience reactions video really shows the impact. What an amazing product launch! 🚀', NULL, '2025-09-04 14:45:00');

-- =====================================================
-- Data Summary and Statistics
-- =====================================================

/*
Database Population Summary:
- Users: 20 users (mix of original users + mock users)
- Posts: 22 posts (various types including Mixed content)
- PostMedia: 21 media attachments (images and videos)
- Connections: 20 connection relationships (various statuses)
- Reactions: 6 default reaction types
- PostReactions: 8 sample reactions on posts
- Comments: 13 comments including threaded replies

Mixed Content Examples:
- Post 15: Mixed content with 3 images (team building)
- Post 17: Mixed content with 3 images (project achievements)
- Post 19: Mixed content with 1 video (workflow demo)
- Post 20: Mixed content with 3 images + 1 video (API guide)
- Post 21: Mixed content with 1 image (anniversary)
- Post 22: Mixed content with 3 videos (product launch)

Connection Status Distribution:
- Accepted: 6 connections
- Pending: 12 connections
- Rejected: 2 connections

TESTING CREDENTIALS (All passwords: "password123"):
======================================================

ADMIN USERS:
- Email: alice@company.com          | Password: password123 | Role: Admin
- Email: jack@sales.com             | Password: password123 | Role: Admin  
- Email: test.alice@company.com     | Password: password123 | Role: Admin (Primary Test User)

NORMAL USERS (System):
- Email: bob@company.com            | Password: password123
- Email: charlie@tech.com           | Password: password123
- Email: diana@startup.com          | Password: password123
- Email: eve@creative.com           | Password: password123
- Email: frank@analytics.com        | Password: password123
- Email: grace@product.com          | Password: password123
- Email: henry@devops.com           | Password: password123
- Email: ivy@marketing.com          | Password: password123
- Email: test.bob@company.com       | Password: password123

MOCK TEST USERS:
- Email: john.smith@email.com       | Password: password123
- Email: emily.johnson@email.com    | Password: password123
- Email: michael.brown@email.com    | Password: password123
- Email: sarah.davis@email.com      | Password: password123
- Email: david.wilson@email.com     | Password: password123
- Email: lisa.martinez@email.com    | Password: password123
- Email: james.taylor@email.com     | Password: password123
- Email: jennifer.anderson@email.com| Password: password123
- Email: robert.thomas@email.com    | Password: password123
- Email: maria.garcia@email.com     | Password: password123

RECOMMENDED FOR API TESTING:
- test.alice@company.com / password123 (Admin with mixed content posts)
- john.smith@email.com / password123   (Has mixed content posts with media)
- emily.johnson@email.com / password123 (Has image posts)

This data provides a comprehensive test dataset for:
- User authentication and authorization
- Post creation with mixed media content
- Social connections and relationship management
- Post engagement (reactions and comments)
- Comment threading and replies
- Media attachment handling
- Various post types and content scenarios
*/
