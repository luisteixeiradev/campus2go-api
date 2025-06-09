const models = require('../models');
const token = require('../utils/token');

exports.createSession = async (req, res) => {

    try {
        
        const metadata = {
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            // token: generatedToken
        }

        const session = await models.Session.create({
            metadata: metadata,
            endTime: new Date(Date.now() + 600000) // 10 minutes from now
        })

        const generatedToken = await token.generateToken(session, 'session');

        return res.status(200).json({ msg: 'Session created successfully', session: {endTime: session.endTime}, token: generatedToken });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: "Error when creating session"
        });
    }

}

exports.reserveTickets = async (req, res) => {

    try {
        const { tickets } = req.body;
        const { session } = req;

        

        return res.status(200).json({ msg: 'Tickets reserved successfully', tickets });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: "Error when reserving tickets"
        });
    }

}