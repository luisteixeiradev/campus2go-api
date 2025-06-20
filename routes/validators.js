const express = require('express');
const router = express.Router({ mergeParams: true });
const Controller = require('../controllers/validators');
const validationRoute = require('../middlewares/validationRoute');
const auth = require('../middlewares/auth');

const {
    query,
    param,
    body
} = require('express-validator');

router.route('/')
    .get([
        param('uuid').isUUID().withMessage('Event ID must be a valid UUID'),
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
        query('name').optional().isString().withMessage('Name must be a string'),
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, Controller.getAllValidators)
    .post([
        param('uuid').isUUID().withMessage('Event ID must be a valid UUID'),
        body('name').notEmpty().isString().withMessage('Name is required and must be a string'),
        body('code').optional().isString().withMessage('Code must be a string'),
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableEvent, Controller.createValidator);

router.route('/:validatorUuid')
    .get([
        param('uuid').isUUID().withMessage('Event ID must be a valid UUID'),
        param('validatorUuid').isUUID().withMessage('Validator ID must be a valid UUID'),
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, Controller.getValidatorById)
    .put([
        param('uuid').isUUID().withMessage('Event ID must be a valid UUID'),
        param('validatorUuid').isUUID().withMessage('Validator ID must be a valid UUID'),
        body('name').optional().isString().withMessage('Name must be a string'),
        body('code').optional().isString().withMessage('Code must be a string'),
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, Controller.updateValidator)
    .delete([
        param('uuid').isUUID().withMessage('Event ID must be a valid UUID'),
        param('validatorUuid').isUUID().withMessage('Validator ID must be a valid UUID'),
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, Controller.deleteValidator);

module.exports = router;