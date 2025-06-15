const models = require('../models');
const bcrypt = require('bcryptjs');
const generatePassword = require('generate-password');
const sendEmails = require('../utils/sendEmails');

exports.getAllPromoters = async (req, res) => {

    try {
        const { page = 1, limit = 10, name, email, vat, sort = "name", order = "asc" } = req.query;

        const query = {
            where: {},
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
            order: [[sort, order]],
        };

        if (name) {
            query.where.name = {
                [models.Sequelize.Op.like]: `%${name}%`
            };
        }

        if (email) {
            query.where.email = {
                [models.Sequelize.Op.like]: `%${email}%`
            };
        }
        if (vat) {
            query.where.vat = {
                [models.Sequelize.Op.like]: `%${vat}%`
            };
        }

        const promoters = await models.Promoter.findAndCountAll(query);

        return res.status(200).send({
            promoters: promoters.rows,
            totalItems: promoters.count,
            totalPages: Math.ceil(promoters.count / limit),
            currentPage: parseInt(page),
            itemsPerPage: parseInt(limit)
        });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            error: "error when getting promoters"
        });
    }

}

exports.createPromoter = async (req, res) => {

    try {
        const { name, vat, address, email, phone, user } = req.body;

        // Check if the promoter already exists
        const promoterExists = await models.Promoter.findOne({ where: { vat } });
        if (promoterExists) {
            return res.status(400).send({
                error: "Promoter already exists"
            });
        }

        const userExists = await models.User.findOne({ where: { email: user.email } });
        if (userExists) {
            return res.status(400).send({
                error: "User already exists"
            });
        }

        const newPassword = await generatePassword.generate({
            length: 10,
            numbers: true,
            uppercase: true,
            lowercase: true,
        });

        const newUser = {
            name: user.name,
            email: user.email,
            password: bcrypt.hashSync(newPassword, 10),
            role: 'promoter',
            active: true
        }

        const promoter = await models.Promoter.create({
            name,
            vat,
            address,
            email,
            phone,
            users: [newUser]
        }, {
            include: [{
                model: models.User,
                as: 'users',
                through: models.UsersHasPromoters
            }]
        });

        await sendEmails.PromoterCreated(newUser, newPassword);

        return res.status(201).send({
            msg: "Promoter created",
        });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            error: "error when creating promoter"
        });
    }
}

exports.getPromoter = async (req, res) => {
    try {

        const { uuid } = req.params;

        const promoter = await models.Promoter.findOne({
            where: { uuid },
            include: [{
                model: models.User,
                as: 'users',
                through: { attributes: [] },
                attributes: ['uuid', 'name', 'email', 'active']
            }]
        });

        if (!promoter) {
            return res.status(404).send({
                error: "Promoter not found"
            });
        }

        if (req.user) {
            if (req.user.role == "promoter" || req.user.role == "admin") {
                if (promoter.users.filter(user => user.uuid == req.user.uuid)) {
                    return res.status(200).send(promoter);
                }
            }
        }
        else {
            delete promoter.dataValues.users;
            return res.status(200).send(promoter);
        }


    } catch (error) {
        console.log(error);

        return res.status(500).send({
            error: "error when getting promoter"
        });
    }
}

exports.updatePromoter = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { name, vat, address, email, phone } = req.body;

        const promoter = await models.Promoter.findOne({ where: { uuid } });

        if (!promoter) {
            return res.status(404).send({
                error: "Promoter not found"
            });
        }

        await promoter.update({
            name,
            vat,
            address,
            email,
            phone
        });

        return res.status(200).send(promoter);
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            error: "error when updating promoter"
        });
    }
}

exports.getPromoterUsers = async (req, res) => {
    try {
        const { uuid } = req.params;

        const users = await models.User.findAll({
            include: [{
                model: models.Promoter,
                where: { uuid: uuid },
                attributes: [],
                through: { attributes: [] }
            }],
            attributes: {
                exclude: ['password', 'active']
            }
        });

        return res.status(200).send({ users });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            error: "error when getting promoter users"
        });
    }
}

exports.createPromoterUser = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { name, email } = req.body;

        const promoter = await models.Promoter.findOne({ where: { uuid } });

        if (!promoter) {
            return res.status(404).send({
                error: "Promoter not found"
            });
        }

        const userExists = await models.User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).send({
                error: "User already exists"
            });
        }

        const newPassword = await generatePassword.generate({
            length: 10,
            numbers: true,
            uppercase: true,
            lowercase: true,
        });

        const newUser = {
            name,
            email,
            password: bcrypt.hashSync(newPassword, 10),
            role: 'promoter',
            active: true
        }

        const user = await models.User.create(newUser);

        await promoter.addUser(user);

        await sendEmails.PromoterCreated(newUser, newPassword);

        return res.status(201).send({ msg: "User created" });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            error: "error when creating promoter user"
        });
    }
}

exports.deletePromoterUser = async (req, res) => {
    try {
        const { uuid, userUuid } = req.params;

        const promoter = await models.Promoter.findOne({ where: { uuid } });

        if (!promoter) {
            return res.status(404).send({
                error: "Promoter not found"
            });
        }


        const user = await models.User.findOne({ where: { uuid: userUuid } });

        if (!user) {
            return res.status(404).send({
                error: "User not found"
            });
        }

        await promoter.removeUser(user);
        await user.destroy();

        return res.status(200).send({
            msg: "User removed from promoter"
        });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            error: "error when deleting promoter user"
        });
    }
}

exports.getPromoterUser = async (req, res) => {
    try {
        const { uuid, userUuid } = req.params;

        const user = await models.User.findOne({
            where: { uuid: userUuid },
            include: [{
                model: models.Promoter,
                where: { uuid: uuid },
                attributes: [],
                through: { attributes: [] }
            }]
        });

        if (!user) {
            return res.status(404).send({
                error: "User not found"
            });
        }

        return res.status(200).send(user);
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            error: "error when getting promoter user"
        });
    }
}

exports.getMyPromoter = async (req, res) => {

    try {
        const { user } = req;

        if (!user) {
            return res.status(401).send({
                error: "Unauthorized"
            });
        }

        const promoter = await models.Promoter.findOne({
            include: [
                {
                    model: models.User,
                    as: 'users',
                    where: { uuid: user.uuid },
                    through: { attributes: [] },
                    attributes: []
                }
            ]
        });

        if (!promoter) {
            return res.status(404).send({
                error: "Promoter not found"
            });
        }

        return res.status(200).send({ promoter });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            error: "error when getting my promoter"
        });
    }

}

exports.getPromoterEvents = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { page = 1, limit = 10, include } = req.query;

        const promoter = await models.Promoter.findOne({ where: { uuid } });

        if (!promoter) {
            return res.status(404).send({
                error: "Promoter not found"
            });
        }

        const query = {
            where: { promoter: uuid },
            limit,
            offset: (page - 1) * limit,
            include: []
        };

        if (include) {
            query.include.push({
                model: models.Event,
                as: 'events',
                attributes: ['uuid', 'name', 'date']
            });
        }

        const events = await models.Event.findAll(query);

        return res.status(200).send(events);
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            error: "error when getting promoter events"
        });
    }
}

exports.updatePromoterImage = async (req, res) => {
    try {
        const { uuid } = req.params;

        const promoter = await models.Promoter.findOne({ where: { uuid } });

        if (!promoter) {
            return res.status(404).send({
                error: "Promoter not found"
            });
        }

        if (!req.file) {
            return res.status(400).send({
                error: "Image file is required"
            });
        }

        const imagePath = `/images/promoters/${req.file.filename}`;

        await promoter.save({ image: imagePath });

        return res.status(200).send({
            msg: "Promoter image updated",
            image: imagePath
        });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            error: "error when updating promoter image"
        });
    }
}