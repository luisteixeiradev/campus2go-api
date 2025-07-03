const jwt = require('jsonwebtoken');
const models = require('../models');

exports.generateToken = async (data, type) => {

    if (type !== 'auth' && type !== 'active' && type !== 'forgotPassword' && type !== 'session' && type !== 'purchase' && type !== 'validator') {
        throw new Error('Invalid token type');
    }

    const token = await jwt.sign({
        uuid: data.uuid,
        type
    }, process.env.JWT_SECRET, {
        expiresIn: '128d'
    });
    return token;

}

exports.decodeToken = async (token) => {

    try {
        const decoded = await jwt.decode(token);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }

}

exports.getUserFromToken = async (token) => {

    const decoded = await this.decodeToken(token);

    const user = await models.User.findOne({
        where: {
            uuid: decoded.uuid
        },
        attributes: {
            exclude: ['id', 'password']
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;

}

exports.getPromoterFromUser = async (user) => {

    // const user = await models.User.findOne({
    //     where: {
    //         uuid: req.user.uuid
    //     },
    //     // include: [{
    //     //     model: models.Promoter,
    //     //     as: 'promoter',
    //     // }],
    // });

    // if (!user) {
    //     return res.status(404).send({
    //         error: "user not found"
    //     });
    // }

    const promoters = await models.Promoter.findAll({
        include: [{
          model: models.User,
          as: 'users', // este alias tem de ser igual ao definido em Promoter.associate
          where: { uuid: user },
        //   attributes: [], // não queremos dados do User, apenas filtrar
          through: { attributes: [] }, // remove dados da tabela de junção
        }]
      });


    if (promoters.length === 0) {
        return res.status(404).send({
            error: "promoter not found"
        });
    }

    return promoters[0];

}

exports.getValidatorFromToken = async (token, req) => {

    try {
        const decoded = await this.decodeToken(token);
        
        console.log(decoded);
        

        if (decoded.type !== 'validator') {
            throw new Error('Invalid token type');
        }

        const validator = await models.Validator.findOne({
            where: {
                uuid: decoded.uuid,
                active: true
            }
        });

        return validator;

    } catch (error) {
        console.error("Error in getValidatorFromToken:", error);
        return { error: 'Invalid token' }
    }

}