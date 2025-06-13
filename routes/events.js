const express = require('express');
const router = express.Router();
const Controller = require('../controllers/events');
const validationRoute = require('../middlewares/validationRoute');
const auth = require('../middlewares/auth');
const token = require('../utils/token');

const {
    query,
    param,
    body
} = require('express-validator');

router.route('/')
    .get([
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
        query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
        query('endDate').optional().isISO8601() .withMessage('End date must be a valid date'),
        query('name').optional().isString().withMessage('Name must be a string'),
        query('include').optional().isString().withMessage('Includes must be a string'),
        query('active').optional().isBoolean().withMessage('active must be a boolean'),
        query('sort').optional().isString().withMessage('Sort must be a string'),
        query('order').optional().isString().withMessage('Order must be a string'),
        query('promoter').optional().isUUID().withMessage('Promoter must be a valid UUID')
    ], validationRoute, Controller.getAllEvents)
    .post([
        body('name').notEmpty().isString().withMessage('Name is required and must be a string'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('startDate').notEmpty().isString().withMessage('Start date is required and must be a valid date'),
        body('endDate').notEmpty().isString().withMessage('End date is required and must be a valid date'),
        body('image').optional().isURL().withMessage('Image must be a valid URL'),
        body('promoter').optional().isUUID().withMessage('Promoter is required and must be a valid UUID'),
        body('space').notEmpty().isUUID().withMessage('Space is required and must be a valid UUID')
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, Controller.createEvent)

router.route('/:id')
    .get([
        param('id').isUUID().withMessage('ID must be a valid UUID'),
        query('include').optional().isString().withMessage('Includes must be a string'),
        query('availableTickets').optional().isBoolean().withMessage('availableTickets must be a boolean'),
    ], validationRoute, Controller.getEventById)
    .put([
        param('id').isUUID().withMessage('ID must be a valid UUID'),
        body('name').optional().isString().withMessage('Name must be a string'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('startDate').optional().isDate().withMessage('Start date must be a valid date'),
        body('endDate').optional().isDate().withMessage('End date must be a valid date'),
        body('image').optional().isURL().withMessage('Image must be a valid URL'),
        body('promoter').optional().isUUID().withMessage('Promoter must be a valid UUID'),
        body('space').optional().isUUID().withMessage('Space must be a valid UUID'),
        body('active').optional().isBoolean().withMessage('Active must be a boolean'),
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, Controller.updateEvent)
    .delete([
        param('id').isUUID().withMessage('ID must be a valid UUID')
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, Controller.deleteEvent);

router.use('/:id/available-tickets', require('./availableTickets'));
router.use('/:id/forms', require('./forms'));
    

module.exports = router;