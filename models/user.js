const uuid = require('uuid');
const { v7 } = uuid;

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {

        uuid: {
            type: DataTypes.UUID,
            defaultValue: ()=>v7(),
            unique: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('admin', "promoter", "client"),
            defaultValue: 'client'
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

    },
        {
            timestamps: true,
            tableName: 'users'
        },
    );

    User.associate = (models) => {

        User.belongsToMany(models.Promoter, {
            through: models.UsersHasPromoters,
            foreignKey: 'user',
            otherKey: 'promoter'
        });

        User.hasMany(models.Purchase, {
            foreignKey: 'user',
            as: 'purchases'
        });

    }

    return User;

}