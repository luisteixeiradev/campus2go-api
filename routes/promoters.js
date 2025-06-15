const express = require('express');
const router = express.Router();
const Controller = require('../controllers/promoters');
const validationRoute = require('../middlewares/validationRoute');
const auth = require('../middlewares/auth');

const {
    query,
    param,
    body
} = require('express-validator');

router.route('/')
    .get([
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
        query('name').optional().isString().withMessage('Name must be a string'),
        query('email').optional().isEmail().withMessage('Email must be a valid email'),
        query('vat').optional().isString().withMessage('VAT must be a string'),
        query('include').optional().isString().withMessage('Includes must be a string'),
        
        query('sort').optional().isString().withMessage('Sort must be a string'),
        query('order').optional().isIn(['asc', 'desc']).withMessage('Order must be either "asc" or "desc"'),
    ], validationRoute, Controller.getAllPromoters)
    .post([
        body('name').notEmpty().isString().withMessage('Name is required and must be a string'),
        body('vat').notEmpty().isString().withMessage('VAT is required and must be a string'),
        body('address.street').notEmpty().isString().withMessage('Street is required and must be a string'),
        body('address.city').notEmpty().isString().withMessage('City is required and must be a string'),
        body('address.state').notEmpty().isString().withMessage('State is required and must be a string'),
        body('address.zip').notEmpty().isString().withMessage('Zip is required and must be a string'),
        body('address.country').notEmpty().isString().withMessage('Country is required and must be a string'),
        body('email').notEmpty().isEmail().withMessage('Email is required and must be a valid email'),
        body('phone').notEmpty().isString().withMessage('Phone is required and must be a string'),
        body('user.name').notEmpty().isString().withMessage('User name is required and must be a string'),
        body('user.email').notEmpty().isEmail().withMessage('User email is required and must be a valid email'),
    ], validationRoute, auth.auth, auth.isAdmin, Controller.createPromoter)

router.route('/me')
    .get([
        query('include').optional().isString().withMessage('Includes must be a string'),
    ], validationRoute, auth.ifUSer, Controller.getMyPromoter)

router.route('/:uuid')
    .get([
        param('uuid').notEmpty().isString().withMessage('UUID is required and must be a string'),
    ], validationRoute, auth.ifUSer, Controller.getPromoter)
    .put([
        body('name').optional().isString().withMessage('Name must be a string'),
        body('vat').optional().isString().withMessage('VAT must be a string'),
        body('address.street').optional().isString().withMessage('Street must be a string'),
        body('address.city').optional().isString().withMessage('City must be a string'),
        body('address.state').optional().isString().withMessage('State must be a string'),
        body('address.zip').optional().isString().withMessage('Zip must be a string'),
        body('address.country').optional().isString().withMessage('Country must be a string'),
        body('email').optional().isEmail().withMessage('Email must be a valid email'),
        body('phone').optional().isString().withMessage('Phone must be a string'),
    ], validationRoute, auth.auth, auth.isAvailablePromoter, Controller.updatePromoter)

router.route('/:uuid/users')
    .get([
        param('uuid').notEmpty().isString().withMessage('UUID is required and must be a string')
    ], validationRoute, auth.auth, auth.isAvailablePromoter, Controller.getPromoterUsers)
    .post([
        param('uuid').notEmpty().isString().withMessage('UUID is required and must be a string'),
        body('name').notEmpty().isString().withMessage('Name is required and must be a string'),
        body('email').notEmpty().isEmail().withMessage('Email is required and must be a valid email'),
    ], validationRoute, auth.auth, auth.isAdmin, Controller.createPromoterUser)

router.route('/:uuid/users/:userUuid')
    .get([
        param('uuid').notEmpty().isString().withMessage('UUID is required and must be a string'),
        param('userUuid').notEmpty().isString().withMessage('User UUID is required and must be a string'),
    ], validationRoute, auth.auth, auth.isAdmin, Controller.getPromoterUser)
    .delete([
        param('uuid').notEmpty().isString().withMessage('UUID is required and must be a string'),
        param('userUuid').notEmpty().isString().withMessage('User UUID is required and must be a string'),
    ], validationRoute, auth.auth, auth.isAdmin, Controller.deletePromoterUser)

router.route('/:uuid/events')
    .get([
        param('uuid').notEmpty().isString().withMessage('UUID is required and must be a string'),
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
        query('include').optional().isString().withMessage('Includes must be a string'),
    ], validationRoute, auth.auth, auth.isAvailablePromoter, Controller.getPromoterEvents)
    
    
module.exports = router;