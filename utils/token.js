const jwt = require('jsonwebtoken');
const models = require('../models');

exports.generateToken = async (data, type) => {

    if (type !== 'auth' && type !== 'active' && type !== 'forgotPassword') {
        throw new Error('Invalid token type');
    }
    const token = await jwt.sign({
        uuid: data.uuid,
        type
    }, process.env.JWT_SECRET, {
        expiresIn: '1d'
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