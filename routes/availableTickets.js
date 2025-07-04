const express = require('express');
const router = express.Router({mergeParams: true });
const Controller = require('../controllers/availableTickets');
const validationRoute = require('../middlewares/validationRoute');
const auth = require('../middlewares/auth');

const {
    query,
    param,
    body
} = require('express-validator');

router.route('/')
    .get([
        query('include').optional().isString().withMessage('Includes must be a string'),
        query('active').optional().isBoolean().withMessage('Active must be a boolean'),
    ],validationRoute, Controller.getAllAvailableTickets)
    .post([
        param('uuid').notEmpty().isUUID().withMessage('Event ID is required and must be a valid UUID'),
        body('name').notEmpty().isString().withMessage('Name is required and must be a string'),
        body('price').notEmpty().isFloat({ min: 0 }).withMessage('Price is required and must be a positive number'),
        body('capacity').notEmpty().isInt({ min: 0 }).withMessage('Capacity is required and must be a positive integer'),
        body('zone').optional({nullable: true}).isUUID().withMessage('Zone must be a valid UUID'),

    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableEvent, Controller.createAvailableTicket);

router.route('/:uuidAvailableTicket')
    .get([
        param('uuidAvailableTicket').notEmpty().isUUID().withMessage('Id is required and must be a valid UUID'),
        query('include').optional().isString().withMessage('Includes must be a string'),
    ], validationRoute, Controller.getAvailableTicketById)
    .put([
        param('uuidAvailableTicket').notEmpty().isUUID().withMessage('Id is required and must be a valid UUID'),
        body('name').optional().isString().withMessage('Name must be a string'),
        body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('capacity').optional().isInt({ min: 0 }).withMessage('Max must be a positive integer'),
        body('zone').optional({nullable: true}).isUUID().withMessage('Zone must be a valid UUID'),
        body('active').optional().isBoolean().withMessage('Active must be a boolean'),
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableEvent, Controller.updateAvailableTicket)
    .delete([ 
        param('uuidAvailableTicket').notEmpty().isUUID().withMessage('Id is required and must be a valid UUID')
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, Controller.deleteAvailableTicket);

module.exports = router;

