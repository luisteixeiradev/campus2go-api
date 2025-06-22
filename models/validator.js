const uuid = require('uuid');
const { v7 } = uuid;
const { customAlphabet, urlAlphabet, random } = require('nanoid');

module.exports = (sequelize, DataTypes) => {
    const Validator = sequelize.define('Validator', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: () => v7(),
            unique: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            defaultValue: () => customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8)(),
            allowNull: false,
            unique: false
        },
        event: {
            type: DataTypes.UUID,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        registeredAt: {
            type: DataTypes.DATE,
            defaultValue: null,
            allowNull: true 
        },
        lastAccess: {
            type: DataTypes.DATE,
            defaultValue: null,
            allowNull: true
        },
        device: {
            type: DataTypes.JSON,
            defaultValue: null,
            allowNull: true
        },
    }, {
        timestamps: true,
        tableName: 'validators'
    });

    Validator.associate = (models) => {
        Validator.belongsTo(models.Event, {
            foreignKey: 'event',
            as: 'eventDetails'
        });
    };

    return Validator;
}