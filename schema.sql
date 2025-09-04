CREATE DATABASE IF NOT EXISTS linkedin;
USE linkedin;

CREATE TABLE IF NOT EXISTS Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    UserName VARCHAR(100) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Connections (
    UserID INT,
    RecipientID INT,
    Status ENUM('Pending', 'Accepted', 'Rejected') NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (UserID, RecipientID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (RecipientID) REFERENCES Users(UserID)
);

CREATE TABLE IF NOT EXISTS Posts (
    PostID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    PostType ENUM('Text', 'Image', 'Video', 'Article') NOT NULL,
    Content TEXT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE IF NOT EXISTS Reactions (
    ReactionID INT PRIMARY KEY AUTO_INCREMENT,
    ReactionType ENUM('Like', 'Celebrate', 'Support', 'Love', 'Insightful', 'Curious') NOT NULL
);

CREATE TABLE IF NOT EXISTS PostReactions (
    PostID INT,
    UserID INT,
    ReactionID INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (PostID, UserID),
    FOREIGN KEY (PostID) REFERENCES Posts(PostID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ReactionID) REFERENCES Reactions(ReactionID)
);

CREATE TABLE IF NOT EXISTS Comments (
    CommentID INT PRIMARY KEY AUTO_INCREMENT,
    PostID INT NOT NULL,
    UserID INT NOT NULL,
    CommentText TEXT NOT NULL,
    ReplyToID INT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PostID) REFERENCES Posts(PostID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ReplyToID) REFERENCES Comments(CommentID)
);

INSERT IGNORE INTO Reactions (ReactionID, ReactionType) VALUES
(1, 'Like'),
(2, 'Celebrate'),
(3, 'Support'),
(4, 'Love'),
(5, 'Insightful'),
(6, 'Curious');
