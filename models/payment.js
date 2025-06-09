const uuid = require('uuid');
const { v7 } = uuid;

module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: ()=>v7(),
            unique: true,
            primaryKey: true,
            allowNull: false
        },
        purchase: {
            type: DataTypes.UUID,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // status: {
        //     type: DataTypes.ENUM('pending', 'completed', 'failed'),
        //     defaultValue: 'pending',
        //     allowNull: false
        // },
        provider: {
            type: DataTypes.STRING,
            allowNull: false
        },
        transactionId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: false
        },
        paid_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true
        }
    }, {
        timestamps: true,
        tableName: 'payments'
    });
    Payment.associate = (models) => {
        Payment.belongsTo(models.Purchase, {
            foreignKey: 'purchase',
            as: 'purchaseDetails'
        });
    };
    return Payment;
}