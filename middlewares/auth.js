const jwt = require('jsonwebtoken');
const { getUserFromToken, getPromoterFromUser } = require('../utils/token');
const models = require('../models');
const token = require('../utils/token');

exports.auth = async (req, res, next) => {

    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.type !== 'auth') {
            return res.status(401).json({ error: 'Invalid token type' });
        }

        req.user = await getUserFromToken(token);
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }

}

exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    next();
}

exports.isPromoterOrAdmin = async (req, res, next) => {

    if (!req.user || (req.user.role !== 'promoter' && req.user.role !== 'admin')) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.user.role === 'promoter') {

        req.promoter = await getPromoterFromUser(req.user.uuid);
    }

    next();

}

exports.ifUSer = async (req, res, next) => {

    try {

        let token;

        if (req.headers['authorization']) {
            token = req.headers['authorization']?.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded.type !== 'auth') {
                return res.status(401).json({ error: 'Invalid token type' });
            }

            req.user = await getUserFromToken(token);
            console.log(req.user);

            next();

        } else {
            next();
        }


    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }

}

exports.isAvailablePromoter = async (req, res, next) => {

    try {

        const { uuid } = req.params;

        if (req.user.role == 'admin') {
            return next();
        }

        const promoter = await getPromoterFromUser(req.user.uuid);

        if (promoter.uuid !== uuid) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        req.promoter = promoter;
        return next();


    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }




}

exports.isAvailableSpace = async (req, res, next) => {

    try {

        const { uuid } = req.params;

        if (req.user.role == 'admin') {
            return next();
        }

        const space = models.Space.findOne({
            where: {
                uuid: uuid,
                promoter: req.promoter.uuid
            }
        })

        if (!space) {
            return res.status(401).json({ error: 'Forbidden' });
        }

        return next();

    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }

}

exports.isAvailableEvent = async (req, res, next) => {

    try {

        const { uuid } = req.params;

        if (req.user.role == 'admin') {
            return next();
        }

        const event = await models.Event.findOne({
            where: {
                uuid: uuid,
                promoter: req.promoter.uuid
            }
        });

        if (!event) {
            return res.status(401).json({ error: 'Forbidden' });
        }

        return next();

    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }

}

exports.validateSession = async (req, res, next) => {
    try {
        const tokenSession = req.query.tokenSession;

        if (!tokenSession) {
            return res.status(400).json({ error: 'Token session is required' });
        }

        const decoded = await token.decodeToken(tokenSession);

        if (decoded.type !== 'session') {
            return res.status(401).json({ error: 'Invalid token type' });
        }

        const session = await models.Session.findOne({
            where: {
                uuid: decoded.uuid,
                endTime: {
                    [models.Sequelize.Op.gt]: new Date() // Check if session is still valid
                }
            }
        });

        if (!session) {
            return res.status(401).json({ msg: 'Session not found or expired' });
        }
        if (session.metadata.ip !== req.ip || session.metadata.userAgent !== req.headers['user-agent']) {

            return res.status(401).json({ msg: 'Session IP or user agent mismatch' });
        }

        // return res.status(200).json({ valid: true, session: session, json: {ip: req.ip, agent: req.headers['user-agent']} });

        req.session = session;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token session' });
    }
}

exports.isValidator = async (req, res, next) => {

    try {

        const tokenValidator = req.headers['authorization']?.split(' ')[1];

        if (!tokenValidator) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const validator = await token.getValidatorFromToken(tokenValidator, req);


        if (!validator) {
            return res.status(401).json({ error: 'Validator not found or inactive' });
        }

        if (validator.device.ip !== req.ip || validator.device.userAgent !== req.headers['user-agent']) {
            return res.status(401).json({ error: 'Device not authorized' });
        }

        validator.lastAccess = new Date();
        await validator.save();

        req.validator = validator;
        next();

    } catch (error) {

        return res.status(401).json({ error: 'Invalid token' });
    }

}