const uuid = require('uuid');
const { v7 } = uuid;

module.exports = (sequelize, DataTypes) => {

    const Event = sequelize.define('Event', {

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
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        promoter: {
            type: DataTypes.UUID,
            allowNull: false
        },
        space: {
            type: DataTypes.UUID,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

    }, {
        timestamps: true,
        tableName: 'events'
    })

    Event.associate = (models) => {
        Event.belongsTo(models.Promoter, {
            foreignKey: 'promoter',
            targetKey: 'uuid',
            as: 'promoterDetails'
        });

        Event.belongsTo(models.Space, {
            foreignKey: 'space',
            targetKey: 'uuid',
            as: 'spaceDetails'
        });

        Event.hasMany(models.AvailableTicket, {
            foreignKey: 'event',
            sourceKey: 'uuid',
            as: 'availableTickets'
        });

        Event.hasMany(models.Form, {
            foreignKey: 'event',
            sourceKey: 'uuid',
            as: 'forms'
        });

        Event.hasMany(models.Validator, {
            foreignKey: 'event',
            sourceKey: 'uuid',
            as: 'validators'
        });
        
    }

    return Event;

}