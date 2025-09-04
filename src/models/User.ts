import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './database';

interface UserAttributes {
    UserID: number;
    UserName: string;
    Email: string;
    PasswordHash: string;
    UserRole: 'Normal' | 'Admin';
    CreatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'UserID' | 'CreatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public UserID!: number;
    public UserName!: string;
    public Email!: string;
    public PasswordHash!: string;
    public UserRole!: 'Normal' | 'Admin';
    public CreatedAt!: Date;
}

User.init(
    {
        UserID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        UserName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        Email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        PasswordHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        UserRole: {
            type: DataTypes.ENUM('Normal', 'Admin'),
            allowNull: false,
            defaultValue: 'Normal',
        },
        CreatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'Users',
        timestamps: false, // We're handling CreatedAt manually
    }
);

export default User;
