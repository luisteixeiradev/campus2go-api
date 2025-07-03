const models = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const sendEmails = require('../utils/sendEmails');
const e = require('express');

exports.getAllUsers = async (req, res) => {

    try {
        const { page = 1, limit = 10, sort = 'createdAt', order = 'asc' } = req.query;

        const options = {
            where: {
                ...(req.query.email && { email: { [Op.like]: `%${req.query.email}%` } }),
                ...(req.query.name && { name: { [Op.like]: `%${req.query.name}%` } }),
                ...(req.query.active && { active: req.query.active }),
            },
            order: [[sort, order]],
            limit: parseInt(limit),
            offset: (page - 1) * parseInt(limit)
        };

        const users = await models.User.findAndCountAll(options);

        return res.status(200).json({
            users: users.rows,
            totalItems: users.count,
            totalPages: Math.ceil(users.count / limit),
            currentPage: parseInt(page),
            itemsPerPage: parseInt(limit)
        });
    } catch (error) {
        console.log(error);
        
        return res.status(500).send({
            error: "error when getting users"
        });
    }

}

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, active } = req.body;
        const user = await models.User.findOne({ where: { email } });
        if (user) {
            return res.status(400).send({
                error: "user already exists"
            });
        }
        const newUser = await models.User.create({
            name,
            email,
            password,
            role,
            active
        });
        return res.status(201).send({
            msg: "user created",
            user: {
                uuid: newUser.uuid,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                active: newUser.active
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "error when creating user"
        });
    }
}

exports.updateMe = async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await models.User.findOne({ where: { uuid: req.user.uuid } });        

        if (!user) {
            return res.status(400).send({
                error: "user not found"
            });
        }

        if (email) {
            const emailExists = await models.User.findOne({ where: { email } });
            if (emailExists && emailExists.uuid !== user.uuid) {
                return res.status(400).send({
                    error: "email already exists"
                });
            }
        }

        email?user.email = email:user.email;
        name?user.name = name:user.name;

        await user.save();

        return res.status(200).send({
            msg: "user updated"
        });

    } catch (error) {
        console.log(error);
        
        return res.status(500).send({
            error: "error when updating user"
        });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const { uuid } = req.params;

        const user = await models.User.findOne({ where: { uuid } });

        if (!user) {
            return res.status(400).send({
                error: "user not found"
            });
        }

        return res.status(200).send(user);
    } catch (error) {
        console.log(error);
        
        return res.status(500).send({
            error: "error when getting user"
        });
    }
}

exports.getMe = async (req, res) => {
    try {
        const user = await models.User.findOne({
            where: {
                uuid: req.user.uuid
            },
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            }
         });

        if (!user) {
            return res.status(400).send({
                error: "user not found"
            });
        }

        return res.status(200).send({user});
    } catch (error) {
        console.log(error);
        
        return res.status(500).send({
            error: "error when getting user"
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { name, email, active, role, password } = req.body;

        const user = await models.User.findOne({ where: { uuid } });

        if (!user) {
            return res.status(400).send({
                error: "user not found"
            });
        }

        if (email) {
            const emailExists = await models.User.findOne({ where: { email } });
            if (emailExists && emailExists.uuid !== user.uuid) {
                return res.status(400).send({
                    error: "email already exists"
                });
            }
        }

        email?user.email = email:user.email;
        name?user.name = name:user.name;
        active !== undefined?user.active = active:user.active;
        role?user.role = role:user.role;
        password?user.password = bcrypt.hashSync(password, 10):user.password = user.password;

        await user.save();

        return res.status(200).send({
            msg: "user updated"
        });

    } catch (error) {
        console.log(error);
        
        return res.status(500).send({
            error: "error when updating user"
        });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { uuid } = req.params;

        const user = await models.User.findOne({ where: { uuid } });

        if (!user) {
            return res.status(400).send({
                error: "user not found"
            });
        }
        const email = user.email;
        await user.destroy();

        sendEmails.userDeleted(user);

        res.status(200).send({
            msg: "user deleted"
        });

    } catch (error) {
        console.log(error);
        
        return res.status(500).send({
            error: "error when deleting user"
        });
    }
}