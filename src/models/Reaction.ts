import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './database';

interface ReactionAttributes {
    ReactionID: number;
    ReactionType: 'Like' | 'Celebrate' | 'Support' | 'Love' | 'Insightful' | 'Curious';
}

interface ReactionCreationAttributes extends Optional<ReactionAttributes, 'ReactionID'> {}

class Reaction extends Model<ReactionAttributes, ReactionCreationAttributes> implements ReactionAttributes {
    public ReactionID!: number;
    public ReactionType!: 'Like' | 'Celebrate' | 'Support' | 'Love' | 'Insightful' | 'Curious';
}

Reaction.init(
    {
        ReactionID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        ReactionType: {
            type: DataTypes.ENUM('Like', 'Celebrate', 'Support', 'Love', 'Insightful', 'Curious'),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'Reactions',
        timestamps: false,
    }
);

export default Reaction;
