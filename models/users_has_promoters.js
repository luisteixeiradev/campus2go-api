const uuid = require('uuid');
const { v7 } = uuid;

module.exports = (sequelize, DataTypes) => {
    const UsersHasPromoters = sequelize.define('UsersHasPromoters', {
        user: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        promoter: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'users_has_promoters'
    });

    

    return UsersHasPromoters;
}