"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTables = createTables;
const db_1 = __importDefault(require("./db"));
function createTables() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db_1.default.execute(`
            CREATE TABLE IF NOT EXISTS Users (
                UserID INT PRIMARY KEY AUTO_INCREMENT,
                UserName VARCHAR(100) NOT NULL,
                Email VARCHAR(255) UNIQUE NOT NULL,
                PasswordHash VARCHAR(255) NOT NULL,
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
            yield db_1.default.execute(`
            CREATE TABLE IF NOT EXISTS Connections (
                UserID INT,
                RecipientID INT,
                Status ENUM('Pending', 'Accepted', 'Rejected') NOT NULL,
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (UserID, RecipientID),
                FOREIGN KEY (UserID) REFERENCES Users(UserID),
                FOREIGN KEY (RecipientID) REFERENCES Users(UserID)
            )
        `);
            yield db_1.default.execute(`
            CREATE TABLE IF NOT EXISTS Posts (
                PostID INT PRIMARY KEY AUTO_INCREMENT,
                UserID INT NOT NULL,
                PostType ENUM('Text', 'Image', 'Video', 'Article') NOT NULL,
                Content TEXT NOT NULL,
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (UserID) REFERENCES Users(UserID)
            )
        `);
            yield db_1.default.execute(`
            CREATE TABLE IF NOT EXISTS Reactions (
                ReactionID INT PRIMARY KEY AUTO_INCREMENT,
                ReactionType ENUM('Like', 'Celebrate', 'Support', 'Love', 'Insightful', 'Curious') NOT NULL
            )
        `);
            yield db_1.default.execute(`
            CREATE TABLE IF NOT EXISTS PostReactions (
                PostID INT,
                UserID INT,
                ReactionID INT,
                CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (PostID, UserID),
                FOREIGN KEY (PostID) REFERENCES Posts(PostID),
                FOREIGN KEY (UserID) REFERENCES Users(UserID),
                FOREIGN KEY (ReactionID) REFERENCES Reactions(ReactionID)
            )
        `);
            yield db_1.default.execute(`
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
            )
        `);
            yield db_1.default.execute(`
            INSERT IGNORE INTO Reactions (ReactionID, ReactionType) VALUES
            (1, 'Like'),
            (2, 'Celebrate'),
            (3, 'Support'),
            (4, 'Love'),
            (5, 'Insightful'),
            (6, 'Curious')
        `);
            console.log('All tables created successfully!');
        }
        catch (error) {
            console.error('Error creating tables:', error);
        }
    });
}
//# sourceMappingURL=schema.js.map