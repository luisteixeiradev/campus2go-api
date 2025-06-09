const uuid = require('uuid');
const { v7 } = uuid;

module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define('Answer', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: ()=>v7(),
            unique: true,
            primaryKey: true,
            allowNull: false
        },
        ticket: {
            type: DataTypes.UUID,
            allowNull: false
        },
        answer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        form: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'answers'
    });

    Answer.associate = (models) => {
        Answer.belongsTo(models.Form, {
            foreignKey: 'form',
            as: 'formDetails'
        });

        Answer.belongsTo(models.Ticket, {
            foreignKey: 'ticket',
            as: 'ticketDetails'
        });
    };

    return Answer;

}