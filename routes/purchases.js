const express = require('express');
const router = express.Router();
const Controller = require('../controllers/purchases');
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

    ], validationRoute, auth.auth, Controller.getPurchases)
    .post([
        body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email must be a valid email address'),
        body('availableTicket').isUUID().withMessage('Available Ticket ID must be a valid UUID'),
        body('tickets').isArray().withMessage('Tickets must be an array'),
        body('tickets.*.name').optional().isString().withMessage('Ticket name must be a string'),
        body('tickets.*.email').optional().isEmail().withMessage('Ticket email must be a valid email address'),
        body('tickets.*.answers').optional().isArray().withMessage('Answers must be an array'),
        body('tickets.*.answers.*.form').isUUID().withMessage('Each answer must have a valid question UUID'),
        body('tickets.*.answers.*.answer').isString().withMessage('Each answer must be a string')
    ], validationRoute, auth.ifUSer, Controller.createPurchase)
    .delete([
        query('token').isJWT().withMessage('Token must be a valid JWT'),
    ], validationRoute, Controller.deletePurchase);

router.route('/pay')
    .get([
        query('token').notEmpty().withMessage('Token is required').isJWT().withMessage('Token must be a valid JWT'),
    ], validationRoute, Controller.payPurchase)

// router.route('/:purchaseId')
//     .get([
//         param('purchaseId').isUUID().withMessage('Purchase ID must be a valid UUID'),
//         query('token').isJWT().withMessage('Token must be a valid JWT'),
//     ], validationRoute, auth.auth, Controller.getPurchaseById)
//     .put([
//         param('purchaseId').isUUID().withMessage('Purchase ID must be a valid UUID'),
//         body('status').isIn(['pending', 'completed', 'cancelled']).withMessage('Status must be one of: pending, completed, cancelled'),
//         query('token').isJWT().withMessage('Token must be a valid JWT'),
//     ], validationRoute, auth.auth, Controller.updatePurchaseStatus)
//     .delete([
//         param('purchaseId').isUUID().withMessage('Purchase ID must be a valid UUID'),
//         query('token').isJWT().withMessage('Token must be a valid JWT'),
//     ], validationRoute, auth.auth, Controller.deletePurchase);

module.exports = router;
