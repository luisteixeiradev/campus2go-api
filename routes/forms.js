const express = require('express');
const router = express.Router({mergeParams: true });
const Controller = require('../controllers/forms');
const validationRoute = require('../middlewares/validationRoute');
const auth = require('../middlewares/auth');

const {
    query,
    param,
    body
} = require('express-validator');

router.route('/')
    .get([
        
    ], validationRoute, Controller.getAllForms)
    .post([
        body('question').notEmpty().isString().withMessage('Question is required and must be a string'),
        body('type').notEmpty().isString().withMessage('Type must be a string'),
        body('required').optional().isBoolean().withMessage('Required must be a boolean'),
        body('options.answers').optional().isArray().withMessage('Options must be an array'),
        body('options.answers.*').optional().isString().withMessage('Each option must be a string'),
        body('options.min').optional().isFloat().withMessage('Min must be a number'),
        body('options.max').optional().isFloat().withMessage('Max must be a number'),

        body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer')
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableEvent, Controller.createForm)

router.route('/bulk')
    // .post([
    //     body('forms').isArray().withMessage('Forms must be an array'),
    //     body('forms.*.question').notEmpty().isString().withMessage('Question is required and must be a string'),
    //     body('forms.*.type').notEmpty().isString().withMessage('Type must be a string'),
    //     body('forms.*.required').optional().isBoolean().withMessage('Required must be a boolean'),
    //     body('forms.*.options.answers').optional().isArray().withMessage('Options must be an array'),
    //     body('forms.*.options.answers.*').optional().isString().withMessage('Each option must be a string'),
    //     body('forms.*.options.min').optional().isFloat().withMessage('Min must be a number'),
    //     body('forms.*.options.max').optional().isFloat().withMessage('Max must be a number'),
    //     body('forms.*.order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer')
    // ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableEvent, Controller.bulkCreateForms)
    .put([
        body('forms').isArray().withMessage('Forms must be an array'),
        body('forms.*.uuid').notEmpty().isUUID().withMessage('UUID is required and must be a valid UUID'),
        body('forms.*.question').optional().isString().withMessage('Question must be a string'),
        body('forms.*.type').optional().isString().withMessage('Type must be a string'),
        body('forms.*.required').optional().isBoolean().withMessage('Required must be a boolean'),
        body('forms.*.options.answers').optional().isArray().withMessage('Options must be an array'),
        body('forms.*.options.answers.*').optional().isString().withMessage('Each option must be a string'),
        body('forms.*.options.min').optional().isFloat().withMessage('Min must be a number'),
        body('forms.*.options.max').optional().isFloat().withMessage('Max must be a number'),
        body('forms.*.order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer')
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableEvent, Controller.bulkUpdateForms);

router.route('/:formUuid')
    .get([
        param('formUuid').isUUID().withMessage('Form ID must be a valid UUID')
    ], validationRoute, Controller.getFormById)
    .put([
        param('formUuid').isUUID().withMessage('Form ID must be a valid UUID'),
        body('question').optional().isString().withMessage('Question must be a string'),
        body('type').optional().isString().withMessage('Type must be a string'),
        body('required').optional().isBoolean().withMessage('Required must be a boolean'),
        body('options.answers').optional().isArray().withMessage('Options must be an array'),
        body('options.answers.*').optional().isString().withMessage('Each option must be a string'),
        body('options.min').optional().isFloat().withMessage('Min must be a number'),
        body('options.max').optional().isFloat().withMessage('Max must be a number'),
        body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer')
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableEvent, Controller.updateForm)
    .delete([
        param('formUuid').isUUID().withMessage('Form ID must be a valid UUID')
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableEvent, Controller.deleteForm);

module.exports = router;