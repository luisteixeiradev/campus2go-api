const express = require('express');
const router = express.Router();
const Controller = require('../controllers/sessions');
const validationRoute = require('../middlewares/validationRoute');
const auth = require('../middlewares/auth');
const token = require('../utils/token');

const {
    query,
    param,
    body
} = require('express-validator');

router.route('/')
    .get([], Controller.createSession)
    // .post([

    // ])

router.route('/validate')
    .get([
        query('tokenSession').isJWT().withMessage('Token session must be a valid JWT'),
    ], validationRoute, auth.validateSession);


router.route('/tickets')
    .get([
        query('tokenSession').isJWT().withMessage('Token session must be a valid JWT'),
    ], validationRoute)
    .post([
        query('tokenSession').isJWT().withMessage('Token session must be a valid JWT'),
        body('tickets').isArray().withMessage('Tickets must be an array'),
        body('tickets.*.availableTicketId').isUUID().withMessage('Each ticket must have a valid UUID'),
        body('tickets.*.quantity').isInt({ min: 1 }).withMessage('Each ticket must have a quantity greater than 0')
    ], validationRoute, auth.validateSession, Controller.reserveTickets);


module.exports = router;