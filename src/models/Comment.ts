import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './database';
import User from './User';
import Post from './Post';

interface CommentAttributes {
    CommentID: number;
    PostID: number;
    UserID: number;
    CommentText: string;
    ReplyToID?: number;
    CreatedAt?: Date;
}

interface CommentCreationAttributes extends Optional<CommentAttributes, 'CommentID' | 'ReplyToID' | 'CreatedAt'> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
    public CommentID!: number;
    public PostID!: number;
    public UserID!: number;
    public CommentText!: string;
    public ReplyToID?: number;
    public CreatedAt!: Date;
}

Comment.init(
    {
        CommentID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        PostID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Post,
                key: 'PostID',
            },
        },
        UserID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'UserID',
            },
        },
        CommentText: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        ReplyToID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Comments',
                key: 'CommentID',
            },
        },
        CreatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'Comments',
        timestamps: false,
    }
);

Comment.belongsTo(User, { foreignKey: 'UserID', as: 'author' });
Comment.belongsTo(Post, { foreignKey: 'PostID', as: 'post' });
Comment.belongsTo(Comment, { foreignKey: 'ReplyToID', as: 'parentComment' });
Comment.hasMany(Comment, { foreignKey: 'ReplyToID', as: 'replies' });

User.hasMany(Comment, { foreignKey: 'UserID', as: 'comments' });
Post.hasMany(Comment, { foreignKey: 'PostID', as: 'comments' });

export default Comment;
