const express = require('express');
const router = express.Router();
const Controller = require('../controllers/auth');
const validationRoute = require('../middlewares/validationRoute');
const auth = require('../middlewares/auth');

const {
    query,
    param,
    body
} = require('express-validator');

router.route('/')
    .post([
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
        body('password').notEmpty().withMessage('Password is required')
    ], Controller.authenticate
    )

router.route('/register')
    .post([
        body('name').notEmpty().withMessage('Name is required'),
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
        body('password').notEmpty().withMessage('Password is required')
    ], validationRoute, Controller.register)

router.route('/validate/:token')
    .get([
        param('token').notEmpty().withMessage('Token is required').isJWT().withMessage('Token is invalid')
    ], validationRoute, Controller.validateEmail)

router.route('/forgot-password')
    .post([
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
    ], validationRoute, Controller.forgotPassword)

router.route('/reset-password/:token')
    .post([
        param('token').notEmpty().withMessage('Token is required').isJWT().withMessage('Token is invalid'),
        body('password').notEmpty().withMessage('Password is required')
    ], validationRoute, Controller.resetPassword)

router.route('/change-password')
    .post([
        body('password').notEmpty().withMessage('Password is required'),
        body('newPassword').notEmpty().withMessage('New password is required')
    ], auth.auth, validationRoute, Controller.changePassword)

module.exports = router;
