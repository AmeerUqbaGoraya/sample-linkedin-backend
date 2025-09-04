-- =====================================================
-- LinkedIn Clone Database Schema (DDL)
-- Database: linkedin
-- Generated: September 4, 2025
-- =====================================================

-- Drop database if exists and create new one
DROP DATABASE IF EXISTS linkedin;
CREATE DATABASE linkedin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE linkedin;

-- =====================================================
-- Table: Users
-- Purpose: Store user account information
-- =====================================================
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    UserName VARCHAR(100) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    UserRole ENUM('Normal', 'Admin') NOT NULL DEFAULT 'Normal',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (Email),
    INDEX idx_users_username (UserName)
);

-- =====================================================
-- Table: Posts
-- Purpose: Store user posts with different content types
-- =====================================================
CREATE TABLE Posts (
    PostID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    PostType ENUM('Text', 'Image', 'Video', 'Article', 'Mixed') NOT NULL,
    Content TEXT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    INDEX idx_posts_userid (UserID),
    INDEX idx_posts_created (CreatedAt),
    INDEX idx_posts_type (PostType)
);

-- =====================================================
-- Table: PostMedia
-- Purpose: Store media attachments for posts (images/videos)
-- =====================================================
CREATE TABLE PostMedia (
    MediaID INT AUTO_INCREMENT PRIMARY KEY,
    PostID INT NOT NULL,
    MediaType ENUM('Image', 'Video') NOT NULL,
    MediaURL VARCHAR(500) NOT NULL,
    MediaOrder INT NOT NULL DEFAULT 1,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON DELETE CASCADE,
    INDEX idx_postmedia_postid (PostID),
    INDEX idx_postmedia_order (PostID, MediaOrder),
    UNIQUE KEY unique_post_media_order (PostID, MediaOrder)
);

-- =====================================================
-- Table: Connections
-- Purpose: Store user connection relationships
-- =====================================================
CREATE TABLE Connections (
    UserID INT NOT NULL,
    RecipientID INT NOT NULL,
    Status ENUM('Pending', 'Accepted', 'Rejected') NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (UserID, RecipientID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (RecipientID) REFERENCES Users(UserID) ON DELETE CASCADE,
    INDEX idx_connections_recipient (RecipientID),
    INDEX idx_connections_status (Status),
    CHECK (UserID != RecipientID)
);

-- =====================================================
-- Table: Reactions
-- Purpose: Store available reaction types for posts
-- =====================================================
CREATE TABLE Reactions (
    ReactionID INT AUTO_INCREMENT PRIMARY KEY,
    ReactionType ENUM('Like', 'Celebrate', 'Support', 'Love', 'Insightful', 'Curious') NOT NULL UNIQUE
);

-- =====================================================
-- Table: PostReactions
-- Purpose: Store user reactions to posts
-- =====================================================
CREATE TABLE PostReactions (
    PostID INT NOT NULL,
    UserID INT NOT NULL,
    ReactionID INT DEFAULT NULL,  -- Allow NULL for flexible reaction handling
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (PostID, UserID),
    FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ReactionID) REFERENCES Reactions(ReactionID) ON DELETE CASCADE,
    INDEX idx_postreactions_reaction (ReactionID),
    INDEX idx_postreactions_user (UserID)
);

-- =====================================================
-- Table: Comments
-- Purpose: Store comments on posts with threading support
-- =====================================================
CREATE TABLE Comments (
    CommentID INT AUTO_INCREMENT PRIMARY KEY,
    PostID INT NOT NULL,
    UserID INT NOT NULL,
    CommentText TEXT NOT NULL,
    ReplyToID INT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ReplyToID) REFERENCES Comments(CommentID) ON DELETE CASCADE,
    INDEX idx_comments_post (PostID),
    INDEX idx_comments_user (UserID),
    INDEX idx_comments_reply (ReplyToID),
    INDEX idx_comments_created (CreatedAt)
);

-- =====================================================
-- Views for common queries
-- =====================================================

-- View: PostsWithMedia
-- Purpose: Get posts with their media information
CREATE VIEW PostsWithMedia AS
SELECT 
    p.PostID,
    p.UserID,
    p.PostType,
    p.Content,
    p.CreatedAt,
    u.UserName,
    u.Email,
    COUNT(pm.MediaID) as MediaCount,
    GROUP_CONCAT(
        JSON_OBJECT(
            'mediaId', pm.MediaID,
            'type', pm.MediaType,
            'url', pm.MediaURL,
            'order', pm.MediaOrder
        )
        ORDER BY pm.MediaOrder
        SEPARATOR '||MEDIA||'
    ) as MediaData
FROM Posts p
JOIN Users u ON p.UserID = u.UserID
LEFT JOIN PostMedia pm ON p.PostID = pm.PostID
GROUP BY p.PostID, p.UserID, p.PostType, p.Content, p.CreatedAt, u.UserName, u.Email;

-- View: UserConnections
-- Purpose: Get user connection information with status
CREATE VIEW UserConnections AS
SELECT 
    c.UserID,
    c.RecipientID,
    c.Status,
    c.CreatedAt,
    u1.UserName as SenderName,
    u1.Email as SenderEmail,
    u2.UserName as RecipientName,
    u2.Email as RecipientEmail
FROM Connections c
JOIN Users u1 ON c.UserID = u1.UserID
JOIN Users u2 ON c.RecipientID = u2.UserID;

-- View: PostEngagement
-- Purpose: Get post engagement metrics (reactions, comments)
CREATE VIEW PostEngagement AS
SELECT 
    p.PostID,
    p.UserID,
    p.PostType,
    p.Content,
    p.CreatedAt,
    u.UserName,
    u.Email,
    COALESCE(reaction_count.total_reactions, 0) as TotalReactions,
    COALESCE(comment_count.total_comments, 0) as TotalComments,
    COALESCE(media_count.total_media, 0) as TotalMedia
FROM Posts p
JOIN Users u ON p.UserID = u.UserID
LEFT JOIN (
    SELECT PostID, COUNT(*) as total_reactions
    FROM PostReactions
    GROUP BY PostID
) reaction_count ON p.PostID = reaction_count.PostID
LEFT JOIN (
    SELECT PostID, COUNT(*) as total_comments
    FROM Comments
    GROUP BY PostID
) comment_count ON p.PostID = comment_count.PostID
LEFT JOIN (
    SELECT PostID, COUNT(*) as total_media
    FROM PostMedia
    GROUP BY PostID
) media_count ON p.PostID = media_count.PostID;

-- =====================================================
-- Stored Procedures
-- =====================================================

-- Procedure: GetUserFeed
-- Purpose: Get personalized feed for a user based on connections
DELIMITER //
CREATE PROCEDURE GetUserFeed(IN user_id INT, IN limit_count INT DEFAULT 20)
BEGIN
    SELECT DISTINCT
        p.PostID,
        p.UserID,
        p.PostType,
        p.Content,
        p.CreatedAt,
        u.UserName,
        u.Email,
        COALESCE(reaction_count.total_reactions, 0) as TotalReactions,
        COALESCE(comment_count.total_comments, 0) as TotalComments
    FROM Posts p
    JOIN Users u ON p.UserID = u.UserID
    LEFT JOIN Connections c ON (c.UserID = user_id AND c.RecipientID = p.UserID AND c.Status = 'Accepted')
                            OR (c.RecipientID = user_id AND c.UserID = p.UserID AND c.Status = 'Accepted')
    LEFT JOIN (
        SELECT PostID, COUNT(*) as total_reactions
        FROM PostReactions
        GROUP BY PostID
    ) reaction_count ON p.PostID = reaction_count.PostID
    LEFT JOIN (
        SELECT PostID, COUNT(*) as total_comments
        FROM Comments
        GROUP BY PostID
    ) comment_count ON p.PostID = comment_count.PostID
    WHERE p.UserID = user_id OR c.UserID IS NOT NULL
    ORDER BY p.CreatedAt DESC
    LIMIT limit_count;
END //
DELIMITER ;

-- =====================================================
-- Triggers
-- =====================================================

-- Trigger: Update media count on PostMedia changes
DELIMITER //
CREATE TRIGGER tr_postmedia_after_insert
    AFTER INSERT ON PostMedia
    FOR EACH ROW
BEGIN
    -- Log media insertion for audit purposes
    INSERT INTO audit_log (action, table_name, record_id, created_at)
    VALUES ('INSERT', 'PostMedia', NEW.MediaID, NOW())
    ON DUPLICATE KEY UPDATE created_at = NOW();
END //
DELIMITER ;

-- =====================================================
-- Indexes for Performance Optimization
-- =====================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_posts_user_created ON Posts(UserID, CreatedAt DESC);
CREATE INDEX idx_postmedia_post_order ON PostMedia(PostID, MediaOrder);
CREATE INDEX idx_connections_status_created ON Connections(Status, CreatedAt);
CREATE INDEX idx_postreactions_post_reaction ON PostReactions(PostID, ReactionID);
CREATE INDEX idx_comments_post_created ON Comments(PostID, CreatedAt DESC);

-- =====================================================
-- Database Configuration
-- =====================================================

-- Set database parameters for optimal performance
SET GLOBAL innodb_buffer_pool_size = 1073741824; -- 1GB
SET GLOBAL max_connections = 200;
SET GLOBAL query_cache_size = 67108864; -- 64MB

-- =====================================================
-- Schema Information
-- =====================================================
/*
Database Schema Summary:
- Users: Store user accounts and authentication
- Posts: Store all types of posts (Text, Image, Video, Article, Mixed)
- PostMedia: Store media attachments for posts with ordering
- Connections: Store user relationship requests and status
- Reactions: Store available reaction types
- PostReactions: Store user reactions to specific posts
- Comments: Store comments with threading support

Key Features:
- Mixed content support for posts with multiple media types
- Hierarchical commenting system
- Connection status management
- Comprehensive indexing for performance
- Views for common query patterns
- Stored procedures for complex operations
- Triggers for data integrity
*/
