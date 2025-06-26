const models = require('../models');

exports.getAllValidators = async (req, res) => {
    const { uuid } = req.params;
    const { page = 1, limit = 10, name } = req.query;

    try {
        const options = {
            where: { event: uuid },
            order: [['createdAt', 'ASC']],
            offset: (page - 1) * limit,
            limit: parseInt(limit, 10),
        };

        if (name) {
            options.where.name = { [models.Sequelize.Op.like]: `%${name}%` };
        }

        const validators = await models.Validator.findAndCountAll(options);   

        return res.status(200).json({
            validators: validators.rows,
            totalItems: validators.count,
            page: parseInt(page),
            currentPage: parseInt(page),
            totalPages: Math.ceil(validators.count / limit),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }


}

exports.createValidator = async (req, res) => {
    const { uuid } = req.params;
    const { name, code } = req.body;

    try {

        const validator = await models.Validator.create({
            name,
            event: uuid,
            code
        });

        return res.status(201).json({
            msg: 'Validator created successfully',
            validator
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}

exports.getValidatorById = async (req, res) => {
    const { uuid, validatorUuid } = req.params;

    try {
        const validator = await models.Validator.findOne({
            where: {
                uuid: validatorUuid,
                event: uuid,
            },
        });

        if (!validator) {
            return res.status(404).json({ msg: 'Validator not found' });
        }

        return res.status(200).json(validator);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}

exports.updateValidator = async (req, res) => {
    const { uuid, validatorUuid } = req.params;
    const { name, code } = req.body;

    try {
        const validator = await models.Validator.findOne({
            where: {
                uuid: validatorUuid,
                event: uuid,
            },
        });

        if (!validator) {
            return res.status(404).json({ msg: 'Validator not found' });
        }

        if (name) validator.name = name;
        if (code) validator.code = code;

        await validator.save();

        return res.status(200).json({
            msg: 'Validator updated successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}

exports.deleteValidator = async (req, res) => {
    const { uuid, validatorUuid } = req.params;

    try {
        const validator = await models.Validator.findOne({
            where: {
                uuid: validatorUuid,
                event: uuid,
            },
        });

        if (!validator) {
            return res.status(404).json({ msg: 'Validator not found' });
        }

        await validator.destroy();

        return res.status(200).json({ msg: 'Validator deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}