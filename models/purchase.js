const uuid = require('uuid');
const { v7 } = uuid;

module.exports = (sequelize, DataTypes) => {
    const Purchase = sequelize.define('Purchase', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: ()=>v7(),
            unique: true,
            primaryKey: true,
            allowNull: false
        },
        user: {
            type: DataTypes.UUID,
            allowNull: true
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
            type: DataTypes.ENUM('paid', 'reserved', 'waiting_payment', 'cancelled', 'expired'),
            defaultValue: 'reserved',
            allowNull: false
        },
        total_tickets_amount: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        total_fee_amount: {
            type: DataTypes.FLOAT,
            allowNull: true,
            // defaultValue: sequelize.literal('total_tickets_amount * 0.06') // Assuming a 6% fee
        },
        total_amount: {
            type: DataTypes.FLOAT,
            allowNull: true,
            // defaultValue: sequelize.literal('total_tickets_amount + total_fee_amount')
        },

    }, {
        timestamps: true,
        tableName: 'purchases'
    });

    Purchase.associate = (models) => {
        Purchase.belongsTo(models.User, {
            foreignKey: 'user',
            as: 'userDetails'
        });

        Purchase.hasMany(models.Ticket, {
            foreignKey: 'purchase',
            as: 'tickets'
        });

        Purchase.hasMany(models.Payment, {
            foreignKey: 'purchase',
            as: 'paymentDetails'
        });
    };


    return Purchase;
}