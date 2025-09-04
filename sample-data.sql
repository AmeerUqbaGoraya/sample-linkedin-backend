USE linkedin;

INSERT INTO Users (UserName, Email, PasswordHash) VALUES
('John Smith', 'john.smith@email.com', 'hash123'),
('Sarah Johnson', 'sarah.johnson@email.com', 'hash456'),
('Mike Chen', 'mike.chen@email.com', 'hash789'),
('Emma Davis', 'emma.davis@email.com', 'hash101'),
('Alex Rodriguez', 'alex.rodriguez@email.com', 'hash202');

INSERT INTO Connections (UserID, RecipientID, Status) VALUES
(1, 2, 'Accepted'),
(1, 3, 'Accepted'),
(2, 3, 'Accepted'),
(2, 4, 'Pending'),
(3, 4, 'Accepted'),
(3, 5, 'Accepted'),
(4, 5, 'Accepted'),
(1, 4, 'Accepted'),
(2, 5, 'Accepted');

INSERT INTO Posts (UserID, PostType, Content) VALUES
(1, 'Image', 'Just finished an amazing project! Here are some shots from our team celebration. #teamwork #success'),
(2, 'Text', 'Excited to announce my new role as Senior Developer at TechCorp! Looking forward to new challenges ahead.'),
(3, 'Image', 'Beautiful sunset from today''s hiking trip. Sometimes you need to disconnect to reconnect. #nature #worklifebalance'),
(4, 'Article', 'The Future of AI in Healthcare: A comprehensive analysis of how artificial intelligence is transforming patient care and medical diagnostics.'),
(5, 'Video', 'Quick tutorial on React hooks for beginners. Hope this helps fellow developers! #react #coding #tutorial');

INSERT INTO Comments (PostID, UserID, CommentText) VALUES
(1, 2, 'Congratulations! The project looks amazing. Well deserved celebration!'),
(1, 3, 'So proud of the team! Great work everyone.'),
(1, 4, 'This is inspiring! What was the biggest challenge you faced?'),
(2, 1, 'Congratulations Sarah! TechCorp is lucky to have you.'),
(2, 3, 'Well deserved! You''re going to do great things there.'),
(3, 1, 'Stunning view! Where was this taken?'),
(3, 2, 'I need to go hiking more often. This is beautiful!'),
(4, 2, 'Excellent insights on AI applications. The healthcare section was particularly interesting.'),
(4, 5, 'Great article! Have you considered the ethical implications as well?'),
(5, 1, 'Super helpful tutorial! The useState explanation was perfect.'),
(5, 2, 'Thanks for sharing! This cleared up my confusion about useEffect.');

INSERT INTO Comments (PostID, UserID, CommentText, ReplyToID) VALUES
(1, 1, 'Thanks! The biggest challenge was coordinating across different time zones, but we made it work.', 3),
(2, 2, 'Thank you John! I''m really excited about the opportunities ahead.', 4),
(3, 3, 'This was taken at Mount Wilson trail. Highly recommend it!', 6),
(4, 4, 'Absolutely! I''m planning a follow-up article on AI ethics in healthcare.', 9),
(5, 5, 'Glad it helped! I''ll be doing more React tutorials soon.', 11);

INSERT INTO PostReactions (PostID, UserID, ReactionID) VALUES
(1, 2, 1),
(1, 3, 2),
(1, 4, 1),
(1, 5, 2),
(2, 1, 2),
(2, 3, 1),
(2, 4, 2),
(2, 5, 1),
(3, 1, 4),
(3, 2, 1),
(3, 4, 4),
(3, 5, 1),
(4, 2, 5),
(4, 3, 1),
(4, 5, 5),
(5, 1, 1),
(5, 2, 1),
(5, 3, 5),
(5, 4, 1);
