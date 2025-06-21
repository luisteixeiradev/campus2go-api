const express = require('express');
const router = express.Router();
const Controller = require('../controllers/events');
const validationRoute = require('../middlewares/validationRoute');
const auth = require('../middlewares/auth');
const token = require('../utils/token');
const upload = require('../middlewares/upload');

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
        body('startDate').notEmpty().isISO8601().withMessage('Start date is required and must be a valid date'),
        body('endDate').notEmpty().isISO8601().withMessage('End date is required and must be a valid date'),
        body('image').optional().isString().withMessage('Image must be a valid URL'),
        body('promoter').optional().isUUID().withMessage('Promoter is required and must be a valid UUID'),
        body('space').notEmpty().isUUID().withMessage('Space is required and must be a valid UUID')
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, Controller.createEvent)

router.route('/:uuid')
    .get([
        param('uuid').isUUID().withMessage('ID must be a valid UUID'),
        query('include').optional().isString().withMessage('Includes must be a string'),
        query('availableTickets').optional().isBoolean().withMessage('availableTickets must be a boolean'),
    ], validationRoute, Controller.getEventById)
    .put([
        param('uuid').isUUID().withMessage('ID must be a valid UUID'),
        body('name').optional().isString().withMessage('Name must be a string'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
        body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
        body('image').optional().isString().withMessage('Image must be a valid URL'),
        body('promoter').optional().isUUID().withMessage('Promoter must be a valid UUID'),
        body('space').optional().isUUID().withMessage('Space must be a valid UUID'),
        body('active').optional().isBoolean().withMessage('Active must be a boolean'),
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, Controller.updateEvent)
    .delete([
        param('uuid').isUUID().withMessage('ID must be a valid UUID')
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, Controller.deleteEvent);

router.route('/:uuid/image')
    .put([
        param('uuid').isUUID().withMessage('UUID must be a valid UUID'),
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, upload.event.single('image'), Controller.uploadEventImage);

router.route('/:uuid/statistics')
    .get([
        param('uuid').isUUID().withMessage('ID must be a valid UUID'),
        query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
        query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, Controller.getEventStatistics);

router.use('/:uuid/available-tickets', require('./availableTickets'));
router.use('/:uuid/forms', require('./forms'));
router.route('/:uuid/tickets')
    .get([
        param('uuid').isUUID().withMessage('ID must be a valid UUID'),
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
        query('sort').optional().isString().withMessage('Sort must be a string'),
        query('order').optional().isString().withMessage('Order must be a string'),
        query('status').optional().isString().withMessage('Status must be a string').isIn(['available', 'reserved', 'expired']),
        query('email').optional().isEmail().withMessage('Email must be a valid email address'),
        query('availableTicket').optional().isUUID().withMessage('ID must be a valid UUID'),
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableEvent, Controller.getTicketsByEvent)

// router.route('/:uuid/tickets/export')
//     .get([
//         param('uuid').isUUID().withMessage('Event ID must be a valid UUID'),
//         query('status').optional().isString().withMessage('Status must be a string').isIn(['available', 'reserved', 'expired']),
//         query('email').optional().isEmail().withMessage('Email must be a valid email address'),
//         query('availableTicket').optional().isUUID().withMessage('ID must be a valid UUID'),
//     ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableEvent, Controller.exportTickets);

router.route('/:uuid/tickets/:ticketUuid')
    .get([
        param('uuid').isUUID().withMessage('Event ID must be a valid UUID'),
        param('ticketUuid').isUUID().withMessage('Ticket ID must be a valid UUID'),
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableEvent, Controller.getTicketById)
    .put([
        param('uuid').isUUID().withMessage('Event ID must be a valid UUID'),
        param('ticketUuid').isUUID().withMessage('Ticket ID must be a valid UUID'),
        body('status').optional().isString().withMessage('Status must be a string').isIn(['available', 'reserved', 'expired']),
        body('email').optional().isEmail().withMessage('Email must be a valid email address'),
        body('validated').optional().isBoolean().withMessage('Validated must be a boolean'),
        body('name').optional().isString().withMessage('Name must be a string'),
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableEvent, Controller.updateTicket)

router.route('/:uuid/tickets/:ticketUuid/resend')
    // .post([
    //     param('uuid').isUUID().withMessage('Event ID must be a valid UUID'),
    //     param('ticketUuid').isUUID().withMessage('Ticket ID must be a valid UUID'),
    // ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableEvent, Controller.resendTicket);

router.use('/:uuid/validators', require('./validators'));

module.exports = router;