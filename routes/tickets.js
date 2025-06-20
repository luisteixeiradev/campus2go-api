const express = require('express');
const router = express.Router();
const Controller = require('../controllers/tickets');
const validationRoute = require('../middlewares/validationRoute');
const auth = require('../middlewares/auth');

const {
    query,
    param,
    body
} = require('express-validator');

router.route('/:uuid/validate')
    .get([
        param('uuid').notEmpty().isUUID().withMessage('UUID is required and must be a valid UUID'),
        query('availableTicket').optional().isUUID().withMessage('Available Ticket UUID must be a valid UUID'),
    ], validationRoute, auth.isValidator, Controller.validateTicket);

module.exports = router;