const uuid = require('uuid');
const { v7 } = uuid;

module.exports = (sequelize, DataTypes) => {
    const SessionsHasTickets = sequelize.define('SessionsHasTickets', {
        session: {
            type: DataTypes.UUID,
            allowNull: false
        },
        ticket: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true
        },
    }, {
        timestamps: true,
        tableName: 'sessions_has_tickets'
    });

    return SessionsHasTickets;
}