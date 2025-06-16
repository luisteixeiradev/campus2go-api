const bcrypt = require('bcryptjs');
const sendEmails = require('../utils/sendEmails');

const models = require('../models');
const token = require('../utils/token');

exports.register = async (req, res) => {

    try {
        
        const {
            name,
            email,
            password
        } = req.body;

        const user = await models.User.create({
            name,
            email,
            password: bcrypt.hashSync(password, 10)
        });

        sendEmails.validateEmail(user);

        return res.status(201).send({
            msg: "user created",
        });

    } catch (error) {        
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ error: "email already exists" });
        }
        return res.status(500).send({
            error: "error when creating user"
        });
    }

}

exports.authenticate = async (req, res) => {    

    try {
        
        const {
            email,
            password
        } = req.body;

        const user = await models.User.findOne({
            where: {
                email
            }
        });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).send({
                msg: "user not found"
            });
        } else if (!user.active) {
            return res.status(400).send({
                msg: "email not validated"
            });
        }        

        const tokenGenerated = await token.generateToken(user, "auth");
        delete user.dataValues.password;
        delete user.dataValues.createdAt;
        delete user.dataValues.updatedAt;
        delete user.dataValues.active;

        return res.status(200).send({
            user, token: tokenGenerated
        });

    } catch (error) {
        return res.status(500).send({
            error: "error when authenticating user"
        });
    }

}

exports.validateEmail = async (req, res) => {

   try {

    const decoded = await token.decodeToken(req.params.token);
    if (decoded.type !== "active") {
        return res.status(400).send({
            error: "invalid token"
        });
    }

    const user = await models.User.findOne({ where: { uuid: decoded.uuid } });
    
    user.active = true;
    await user.save();
    return res.status(200).send({
        msg: "email validated"
    });
    
   } catch (error) {
        return res.status(500).send({
            error: "error when validating email"
        });
    }

}

exports.forgotPassword = async (req, res) => {

    try {
        
        const {
            email
        } = req.body;

        const user = await models.User.findOne({
            where: {
                email
            }
        });

        if (user) {
            await sendEmails.forgotPassword(user);
        }

        return res.status(200).send({
            msg: "email sent"
        });

    } catch (error) {
        
        return res.status(500).send({
            error: "error when sending email"
        });

    }

}

exports.resetPassword = async (req, res) => {

    try {
        
        const decoded = await token.decodeToken(req.params.token);
        if (decoded.type !== "forgotPassword") {
            return res.status(400).send({
                error: "invalid token"
            });
        }

        const user = await models.User.findOne({ where: { uuid: decoded.uuid } });

        if (!user) {
            return res.status(400).send({
                error: "user not found"
            });
        }

        user.password = bcrypt.hashSync(req.body.password, 10);
        await user.save();
        await sendEmails.changedPassword(user);

        return res.status(200).send({
            msg: "password reseted"
        });

    } catch (error) {
        
        return res.status(500).send({
            error: "error when resetting password"
        });

    }

}

exports.changePassword = async (req, res) => {

    try {
        
        const user = await models.User.findOne({ where: { uuid: req.user.uuid } });
        console.log(user);
        

        if (!user) {
            return res.status(400).send({
                error: "user not found"
            });
        }

        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).send({
                error: "password is incorrect"
            });
        }

        user.password = bcrypt.hashSync(req.body.newPassword, 10);
        await user.save();

        await sendEmails.changedPassword(user);

        return res.status(200).send({
            msg: "password changed"
        });

    } catch (error) {

        console.log(error);
        
        
        return res.status(500).send({
            error: "error when changing password"
        });

    }

}