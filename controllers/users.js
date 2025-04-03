const models = require('../models');

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