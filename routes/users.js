const express = require('express');
const router = express.Router();
const Controller = require('../controllers/users');
const validationRoute = require('../middlewares/validationRoute');
const auth = require('../middlewares/auth');

const {
    query,
    param,
    body
} = require('express-validator');

router.route('/')
    .get([
        query('page').optional().isNumeric().withMessage('Page must be a number'),
        query('limit').optional().isNumeric().withMessage('Limit must be a number'),
        query('sort').optional().isString().withMessage('Sort must be a string'),
        query('fields').optional().isString().withMessage('Fields must be a string'),
        query('email').optional().isEmail().withMessage('Email must be a valid email'),
        query('name').optional().isString().withMessage('Name must be a string'),
        query('active').optional().isBoolean().withMessage('Active must be a boolean'),
        query('uuid').optional().isUUID().withMessage('UUID must be a valid UUID'),
    ], validationRoute, auth.auth, auth.isAdmin, Controller.getAllUsers)
    // .post([
    //     body('name').notEmpty().isString().withMessage('Name is required and must be a string'),
    //     body('email').notEmpty().isEmail().withMessage('Email is required and must be a valid email'),
    //     body('password').notEmpty().isString().withMessage('Password is required and must be a string'),
    //     body('role').notEmpty().isString().withMessage('Role is required and must be a string').enum(['admin','promoter', 'user']),
    // ], validationRoute, Controller.createUser)

router.route('/me')
    .get(auth.auth, Controller.getMe)
    .put([
        body('name').optional().isString().withMessage('Name is invalid'),
        body('email').optional().isEmail().withMessage('Email is invalid'),
    ], validationRoute, auth.auth, Controller.updateMe)

router.route('/:uuid')
    .get([
        param('uuid').isUUID().withMessage('ID must be a valid UUID'),
    ], validationRoute, auth.auth, auth.isAdmin, Controller.getUserById)
    .put([
        body('name').optional().isString().withMessage('Name is invalid'),
        body('email').optional().isEmail().withMessage('Email is invalid'),
        body('active').optional().isBoolean().withMessage('Active must be a boolean'),
        body('role').optional().isString().withMessage('Role must be a string').isIn(['admin', 'promoter', 'client']),
        body('password').optional().isString().withMessage('Password must be a string')
    ], validationRoute, auth.auth, auth.isAdmin, Controller.updateUser)
    .delete([
        param('uuid').isUUID().withMessage('ID must be a valid UUID'),
    ], validationRoute, auth.auth, auth.isAdmin, Controller.deleteUser)

module.exports = router;