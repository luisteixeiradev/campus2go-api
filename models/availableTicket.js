const uuid = require('uuid');
const { v7 } = uuid;

module.exports = (sequelize, DataTypes) => {

    const AvailableTickets = sequelize.define('AvailableTickets', {

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
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        event: {
            type: DataTypes.UUID,
            allowNull: false
        },
        zone: {
            type: DataTypes.UUID,
            allowNull: true
        }

    }, {
        timestamps: true,
        tableName: 'available_tickets'
    });

    AvailableTickets.associate = (models) => {
        AvailableTickets.belongsTo(models.Event, {
            foreignKey: 'event',
            targetKey: 'uuid',
            as: 'eventDetails'
        });

        AvailableTickets.belongsTo(models.Zone, {
            foreignKey: 'zone',
            targetKey: 'uuid',
            as: 'zoneDetails'
        });

        AvailableTickets.hasMany(models.Ticket, {
            foreignKey: 'availableTicket',
            sourceKey: 'uuid',
            as: 'tickets'
        });
    }

    return AvailableTickets;

}