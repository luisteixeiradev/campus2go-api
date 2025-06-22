const express = require('express');
const router = express.Router({mergeParams: true});
const Controller = require('../controllers/spaces');
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
        // query('public').optional().isBoolean().withMessage('Public must be a boolean'),
        query('name').optional().isString().withMessage('Name must be a string'),
        query('include').optional().isString().withMessage('Includes must be a string'),
        query('minCapacity').optional().isInt({ min: 0 }).withMessage('Min capacity must be a non-negative integer'),
        query('maxCapacity').optional().isInt({ min: 0 }).withMessage('Max capacity must be a non-negative integer'),
    ], validationRoute, auth.ifUSer, Controller.getAllSpaces)
    .post([
        body('name').notEmpty().isString().withMessage('Name is required and must be a string'),
        body('address.street').notEmpty().isString().withMessage('Street is required and must be a string'),
        body('address.city').notEmpty().isString().withMessage('City is required and must be a string'),
        body('address.state').notEmpty().isString().withMessage('State is required and must be a string'),
        body('address.zip').notEmpty().isString().withMessage('Zip is required and must be a string'),
        body('address.country').notEmpty().isString().withMessage('Country is required and must be a string'),
        body('map').optional().isURL().withMessage('Map is required and must be a valid URL'),
        body('public').optional().isBoolean().withMessage('Public must be a boolean') 
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, Controller.createSpace)

router.route('/:uuid')
    .get([
        param('uuid').notEmpty().isUUID().withMessage('Id is required and must be a valid UUID'),
        query('include').optional().isString().withMessage('Includes must be a string')
    ], validationRoute, Controller.getSpaceById)
    .put([
        body('name').optional().isString().withMessage('Name must be a string'),
        body('address.street').optional().isString().withMessage('Street must be a string'),
        body('address.city').optional().isString().withMessage('City must be a string'),
        body('address.state').optional().isString().withMessage('State must be a string'),
        body('address.zip').optional().isString().withMessage('Zip must be a string'),
        body('address.country').optional().isString().withMessage('Country must be a string'),
        body('public').optional().isBoolean().withMessage('Public must be a boolean')
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableSpace, Controller.updateSpace)

router.route('/:uuid/map')
    .put([
        param('uuid').notEmpty().isUUID().withMessage('Id is required and must be a valid UUID'),    
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableSpace, upload.space.single('map'), Controller.uploadMapSpace);

router.use('/:uuid/zones', require('./zones'));

module.exports = router;