const uuid = require('uuid');
const { v7 } = uuid;

module.exports = (sequelize, DataTypes) => {
    const Form = sequelize.define('Form', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: ()=>v7(),
            unique: true,
            primaryKey: true,
            allowNull: false
        },
        question: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        required: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        options: {
            type: DataTypes.JSON,
            allowNull: true
        },
        event: {
            type: DataTypes.UUID,
            allowNull: false
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    }, {
        timestamps: true,
        tableName: 'forms'
    });

    Form.associate = (models) => {
        Form.belongsTo(models.Event, {
            foreignKey: 'event',
            as: 'eventDetails'
        });

        Form.hasMany(models.Answer, {
            foreignKey: 'form',
            as: 'answers'
        });

        // Form.hasMany(models.FormResponse, {
        //     foreignKey: 'form',
        //     as: 'responses'
        // });
    };

    return Form;
}