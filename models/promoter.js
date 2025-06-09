const uuid = require('uuid');
const { v7 } = uuid;

module.exports = (sequelize, DataTypes) => {
    const Promoter = sequelize.define('Promoter', {

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
        vat: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        address: {
            type: DataTypes.JSON,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        }

    }, {
        timestamps: true,
        tableName: 'promoters'
    })


    Promoter.associate = (models) => {

        Promoter.belongsToMany(models.User, {
            through: models.UsersHasPromoters,
            foreignKey: 'promoter',
            as: 'users',
            otherKey: 'user'
        });

        Promoter.hasMany(models.Space, {
            foreignKey: 'promoter',
            sourceKey: 'uuid',
            as: 'spaces'
        });

        Promoter.hasMany(models.Event, {
            foreignKey: 'promoter',
            sourceKey: 'uuid',
            as: 'events'
        });

    }


    return Promoter;
}