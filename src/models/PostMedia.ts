import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './database';

interface PostMediaAttributes {
    MediaID: number;
    PostID: number;
    MediaType: 'Image' | 'Video';
    MediaURL: string;
    MediaOrder: number;
    CreatedAt?: Date;
}

interface PostMediaCreationAttributes extends Optional<PostMediaAttributes, 'MediaID' | 'MediaOrder' | 'CreatedAt'> {}

class PostMedia extends Model<PostMediaAttributes, PostMediaCreationAttributes> implements PostMediaAttributes {
    public MediaID!: number;
    public PostID!: number;
    public MediaType!: 'Image' | 'Video';
    public MediaURL!: string;
    public MediaOrder!: number;
    public CreatedAt!: Date;
}

PostMedia.init(
    {
        MediaID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        PostID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Posts',
                key: 'PostID',
            },
        },
        MediaType: {
            type: DataTypes.ENUM('Image', 'Video'),
            allowNull: false,
        },
        MediaURL: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        MediaOrder: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false,
        },
        CreatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'PostMedia',
        timestamps: false,
    }
);

export default PostMedia;
