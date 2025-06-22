const models = require('../models');
const token = require('../utils/token');
const { Op, or } = require('sequelize');

exports.getAllSpaces = async (req, res) => {

    try {
        const { page = 1, limit = 10, public: isPublic = undefined, name, include, minCapacity, maxCapacity } = req.query;
        const { user } = req;

        const query = {
            where: {},
        };


        if (req.user) {
            if (req.user.role == "promoter") {
                const promoter = await token.getPromoterFromUser(user.uuid);
                query.where[Op.or] = [
                    { public: true },
                    { promoter: promoter.uuid }
                ];
            }
        } else {
            query.where.public = true; // For other roles, only public spaces are returned
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
                        required: false,
                    });
                }

                if (inc === 'promoter' && req.user.role === 'admin') {
                    includeArray.push({
                        model: models.Promoter,
                        as: 'promoterDetails',
                        attributes: ['uuid', 'name', 'email'],
                    });
                }

            });
        }

        const min = minCapacity ? Number(minCapacity) : undefined;
        const max = maxCapacity ? Number(maxCapacity) : undefined;
        let totalCapacityCondition = '';

        if (min !== undefined && max !== undefined) {
            totalCapacityCondition = `
                (SELECT COALESCE(SUM(capacity), 0) FROM zones WHERE zones.space = Space.uuid) BETWEEN ${min} AND ${max}
            `;
        } else if (min !== undefined) {
            totalCapacityCondition = `
                (SELECT COALESCE(SUM(capacity), 0) FROM zones WHERE zones.space = Space.uuid) >= ${min}
            `;
        } else if (max !== undefined) {
            totalCapacityCondition = `
                (SELECT COALESCE(SUM(capacity), 0) FROM zones WHERE zones.space = Space.uuid) <= ${max}
            `;
        }
        if (totalCapacityCondition) {
            query.where[Op.and] = models.Sequelize.literal(totalCapacityCondition);
        }

        const spaces = await models.Space.findAndCountAll({
            ...query,
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
            attributes: {
                include: [
                    [
                        models.Sequelize.literal(`(SELECT COALESCE(SUM(capacity), 0) FROM zones WHERE zones.space = Space.uuid) `),
                        'totalCapacity'
                    ]
                ]
            },
            include: includeArray,
            order: [['name', 'ASC']],
        });

        return res.status(200).send({
            spaces: spaces.rows,
            totalItems: spaces.count,
            totalPages: Math.ceil(spaces.count / limit),
            currentPage: parseInt(page),
            itemsPerPage: parseInt(limit)
        });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            error: "error when fetching spaces"
        });
    }

}

exports.getSpaceById = async (req, res) => {

    try {
        const { uuid } = req.params;
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
                uuid: uuid
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

        req.user.role == "admin" ? json['public'] = public : json['public'] = false;
        //Ir buscar o promoter do usuario. Vai estar na validação de acesso
        req.user.role == "promoter" ? json['promoter'] = req.promoter.uuid : json['promoter'] = null;

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
        const { uuid } = req.params;
        const { name, address, map, public } = req.body;

        const whereCondition = {
            uuid: uuid
        };

        if (req.user.role == "promoter") {
            whereCondition.promoter = req.promoter.uuid;
        }

        const space = await models.Space.findOne({
            where: whereCondition
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

        req.user.role == "admin" ? json['public'] = public : json['public'] = space.public;

        await space.update(
            json
        );

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

exports.uploadMapSpace = async (req, res) => {
    const { uuid } = req.params;
    try {

        const space = await models.Space.findOne({
            where: {
                uuid: uuid
            }
        });

        if (!space) {
            return res.status(404).send({
                error: "space not found"
            });
        }

        if (!req.file) {
            return res.status(400).send({
                msg: "No file uploaded"
            });
        }

        const imagePath = `/images/maps/${req.file.filename}`;

        await space.update({
            map: imagePath
        });

        return res.status(200).send({
            msg: "Map uploaded successfully",
            map: imagePath
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });

    }


}