const uuid = require('uuid');
const { v7 } = uuid;

module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define('Ticket', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: ()=>v7(),
            unique: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('available', 'reserved', 'expired'),
            defaultValue: 'reserved',
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        validated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        availableTicket: {
            type: DataTypes.UUID,
            allowNull: false
        },
        purchase: {
            type: DataTypes.UUID,
            allowNull: true
        },
    }, {
        timestamps: true,
        tableName: 'tickets'
    });

    Ticket.associate = (models) => {

        Ticket.belongsTo(models.AvailableTicket, {
            foreignKey: 'availableTicket',
            as: 'availableTicketDetails'
        });

        Ticket.belongsTo(models.Purchase, {
            foreignKey: 'purchase',
            as: 'purchaseDetails'
        });

        Ticket.hasMany(models.Answer, {
            foreignKey: 'ticket',
            as: 'answers'
        });

        // Ticket.belongsToMany(models.Session, {
        //     through: models.SessionsHasTickets,
        //     foreignKey: 'ticket',
        //     as: 'sessionsDetails'
        // });
        
    };

    return Ticket;
}
