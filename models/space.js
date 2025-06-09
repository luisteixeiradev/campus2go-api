const uuid = require('uuid');
const { v7 } = uuid;

module.exports = (sequelize, DataTypes) => {

    const Space = sequelize.define('Space', {

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
        address: {
            type: DataTypes.JSON,
            allowNull: false
        },
        map: {
            type: DataTypes.STRING,
            allowNull: true
        },
        public: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        promoter: {
            type: DataTypes.UUID,
            allowNull: true
        },
        // totalCapacity: {
        //     type: DataTypes.VIRTUAL,
        //     get() {
        //       if (!this.zones) return 0;
      
        //       return this.zones.reduce((total, zone) => {
        //         return total + (zone.capacity || 0);
        //       }, 0);
        //     }
        //   }
    },
        {
            timestamps: true,
            tableName: 'spaces'
        },
    );

    Space.associate = (models) => {
        Space.belongsTo(models.Promoter, {
            foreignKey: 'promoter',
            targetKey: 'uuid'
        });

        Space.hasMany(models.Zone, {
            foreignKey: 'space',
            sourceKey: 'uuid',
            as: 'zones'
        });

        Space.hasMany(models.Event, {
            foreignKey: 'space',
            sourceKey: 'uuid',
            as: 'events'
        });

    }

    return Space;
}