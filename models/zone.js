const uuid = require('uuid');
const { v7 } = uuid;

module.exports = (sequelize, DataTypes) => {
    const Zone = sequelize.define('Zone', {
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
        space: {
            type: DataTypes.UUID,
            allowNull: false
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    }, {
        timestamps: true,
        tableName: 'zones'
    });

    Zone.associate = (models) => {
        Zone.belongsTo(models.Space, {
            foreignKey: 'space',
            targetKey: 'uuid'
        });

        Zone.hasMany(models.AvailableTicket, {
            foreignKey: 'zone',
            sourceKey: 'uuid',
            as: 'availableTickets'
        });
    }

    return Zone;
}