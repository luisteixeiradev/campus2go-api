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
        body('name').notEmpty().isString().withMessage('Name is required and must be a string'),
        body('price').notEmpty().isFloat({ min: 0 }).withMessage('Price is required and must be a positive number'),
        body('max').notEmpty().isInt({ min: 1 }).withMessage('Max is required and must be a positive integer'),
        body('zone').optional().isUUID().withMessage('Zone must be a valid UUID')
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableEvent, Controller.createAvailableTicket);

router.route('/:idAvailableTicket')
    .get([
        param('idAvailableTicket').notEmpty().isUUID().withMessage('Id is required and must be a valid UUID'),
        query('include').optional().isString().withMessage('Includes must be a string'),
    ], validationRoute, Controller.getAvailableTicketById)
    .put([
        body('name').optional().isString().withMessage('Name must be a string'),
        body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
        body('max').optional().isInt({ min: 1 }).withMessage('Max must be a positive integer'),
        body('zone').optional().isUUID().withMessage('Zone must be a valid UUID')
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableEvent, Controller.updateAvailableTicket)
    .delete([ 
        param('idAvailableTicket').notEmpty().isUUID().withMessage('Id is required and must be a valid UUID')
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, Controller.deleteAvailableTicket);

module.exports = router;

