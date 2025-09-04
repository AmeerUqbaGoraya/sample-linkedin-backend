import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './database';
import User from './User';

interface PostAttributes {
    PostID: number;
    UserID: number;
    PostType: 'Text' | 'Image' | 'Video' | 'Article';
    Content: string;
    CreatedAt?: Date;
}

interface PostCreationAttributes extends Optional<PostAttributes, 'PostID' | 'CreatedAt'> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
    public PostID!: number;
    public UserID!: number;
    public PostType!: 'Text' | 'Image' | 'Video' | 'Article';
    public Content!: string;
    public CreatedAt!: Date;
}

Post.init(
    {
        PostID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        UserID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'UserID',
            },
        },
        PostType: {
            type: DataTypes.ENUM('Text', 'Image', 'Video', 'Article'),
            allowNull: false,
        },
        Content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        CreatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'Posts',
        timestamps: false,
    }
);

// Define associations
Post.belongsTo(User, { foreignKey: 'UserID', as: 'author' });
User.hasMany(Post, { foreignKey: 'UserID', as: 'posts' });

export default Post;
