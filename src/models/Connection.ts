import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './database';
import User from './User';

interface ConnectionAttributes {
    UserID: number;
    RecipientID: number;
    Status: 'Pending' | 'Accepted' | 'Rejected';
    CreatedAt?: Date;
}

interface ConnectionCreationAttributes extends Optional<ConnectionAttributes, 'CreatedAt'> {}

class Connection extends Model<ConnectionAttributes, ConnectionCreationAttributes> implements ConnectionAttributes {
    public UserID!: number;
    public RecipientID!: number;
    public Status!: 'Pending' | 'Accepted' | 'Rejected';
    public CreatedAt!: Date;
}

Connection.init(
    {
        UserID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: User,
                key: 'UserID',
            },
        },
        RecipientID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: User,
                key: 'UserID',
            },
        },
        Status: {
            type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
            allowNull: false,
        },
        CreatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'Connections',
        timestamps: false,
    }
);

// Define associations
Connection.belongsTo(User, { foreignKey: 'UserID', as: 'requester' });
Connection.belongsTo(User, { foreignKey: 'RecipientID', as: 'recipient' });

export default Connection;
