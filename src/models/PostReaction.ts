import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './database';
import User from './User';
import Post from './Post';
import Reaction from './Reaction';

interface PostReactionAttributes {
    PostID: number;
    UserID: number;
    ReactionID: number;
    CreatedAt?: Date;
}

interface PostReactionCreationAttributes extends Optional<PostReactionAttributes, 'CreatedAt'> {}

class PostReaction extends Model<PostReactionAttributes, PostReactionCreationAttributes> implements PostReactionAttributes {
    public PostID!: number;
    public UserID!: number;
    public ReactionID!: number;
    public CreatedAt!: Date;
}

PostReaction.init(
    {
        PostID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: Post,
                key: 'PostID',
            },
        },
        UserID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: User,
                key: 'UserID',
            },
        },
        ReactionID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Reaction,
                key: 'ReactionID',
            },
        },
        CreatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'PostReactions',
        timestamps: false,
    }
);

// Define associations
PostReaction.belongsTo(User, { foreignKey: 'UserID', as: 'user' });
PostReaction.belongsTo(Post, { foreignKey: 'PostID', as: 'post' });
PostReaction.belongsTo(Reaction, { foreignKey: 'ReactionID', as: 'reaction' });

User.hasMany(PostReaction, { foreignKey: 'UserID', as: 'postReactions' });
Post.hasMany(PostReaction, { foreignKey: 'PostID', as: 'reactions' });
Reaction.hasMany(PostReaction, { foreignKey: 'ReactionID', as: 'postReactions' });

export default PostReaction;
