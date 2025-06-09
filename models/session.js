const uuid = require('uuid');
const { v7 } = uuid;

module.exports = (sequelize, DataTypes) => {

    const Session = sequelize.define('Session', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: ()=>v7(),
            unique: true,
            primaryKey: true,
            allowNull: false
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW+600000
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true
        },
    }, {
        timestamps: true,
        tableName: 'sessions'
    });

    Session.associate = (models) => {
        Session.belongsToMany(models.Ticket, {
            through: 'sessions_has_tickets', // Nome explícito da tabela ponte
            foreignKey: 'session_uuid', // Padronizando nomenclatura
            otherKey: 'ticket_id'
        });
    }
    
    return Session;
}