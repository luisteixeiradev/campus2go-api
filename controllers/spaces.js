const models = require('../models');
const { fn, col } = require('sequelize');

exports.getAllSpaces = async (req, res) => {

    try {
        const { page = 1, limit = 10, public: isPublic, name, include } = req.query;

        const query = {
            where: {},
        };

        if (isPublic) {
            query.where.public = isPublic;
        } else {
            query.where.public = false;
        }

        if (name) {
            query.where.name = {
                [models.Sequelize.Op.like]: `%${name}%`
            };
        }

        const includeArray = [];

        if (include) {
            const includes = include.split(',');

            includes.forEach((inc) => {
                if (inc === 'zones') {
                    includeArray.push({
                        model: models.Zone,
                        as: 'zones',
                        attributes: ['uuid', 'name', 'capacity'],
                        required: false
                    });
                }
            });
        }

        const spaces = await models.Space.findAll({
            ...query,
            limit,
            offset: (page - 1) * limit,
            attributes: {
                include: [
                    [
                        models.Sequelize.literal(`(
                      SELECT CAST(SUM(capacity) AS UNSIGNED)
                      FROM zones
                      WHERE zones.space = Space.uuid
                    )`),
                        'totalCapacity'
                    ]
                ]
            },
            include: includeArray,
        });

        return res.status(200).send(spaces);
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            error: "error when fetching spaces"
        });
    }

}

exports.getSpaceById = async (req, res) => {

    try {
        const { id } = req.params;
        const { include } = req.query;

        const includeArray = [];

        if (include) {
            const includes = include.split(',');

            includes.forEach((inc) => {
                if (inc === 'zones') {
                    includeArray.push({
                        model: models.Zone,
                        as: 'zones',
                        attributes: ['uuid', 'name', 'capacity'],
                        required: false
                    });
                }
            });
        }

        const space = await models.Space.findOne({
            where: {
                uuid: id
            },
            attributes: {
                include: [
                    [
                        models.Sequelize.literal(`(
                      SELECT CAST(SUM(capacity) AS UNSIGNED)
                      FROM zones
                      WHERE zones.space = Space.uuid
                    )`),
                        'totalCapacity'
                    ]
                ]
            },
            include: includeArray,
        });

        if (!space) {
            return res.status(404).send({
                error: "space not found"
            });
        }

        return res.status(200).send(space);
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            error: "error when fetching space"
        });
    }

}

exports.createSpace = async (req, res) => {
    try {
        const { name, address, map, public } = req.body;

        const json = {
            name,
            address,
            map
        }

        req.user.role == "admin"?json['public']=public:json['public']=false;
        //Ir buscar o promoter do usuario. Vai estar na validação de acesso
        req.user.role == "promoter"?json['promoter']=req.promoter.uuid:json['promoter']=null;

        const space = await models.Space.create(
           json
        );

        return res.status(201).send(space);
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            error: "error when creating space"
        });
    }
}

exports.updateSpace = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, map, public } = req.body;

        const space = await models.Space.findOne({
            where: {
                uuid: id,
                promoter: req.user.role === "promoter" ? req.promoter.uuid : null
            }
        });

        if (!space) {
            return res.status(404).send({
                error: "space not found"
            });
        }

        const json = {
            name,
            address,
            map
        }

        res.user.role = "admin"?json['public']=public:json['public']=space.public;

        await space.update({
            json
        });

        return res.status(200).send({
            msg: "space updated"
        });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            error: "error when updating space"
        });
    }
}