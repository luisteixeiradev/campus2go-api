const uuid = require('uuid');
const { v7 } = uuid;

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: v7(),
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
        type: {
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
            tableName: 'users',
            hooks: {
                // afterCreate: (user) => {
                //     delete user.dataValues.id;
                //     delete user.dataValues.password;
                //     delete user.dataValues.createdAt;
                //     delete user.dataValues.updatedAt;
                //     delete user.dataValues.active;
                //     delete user.dataValues.type;
                // }
            }
        },
    );

    return User;

}