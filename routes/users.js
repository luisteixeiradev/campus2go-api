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

router.route('/me')
    .put([
        body('name').optional().isString().withMessage('Name is invalid'),
        body('email').optional().isEmail().withMessage('Email is invalid'),
    ], auth.auth, validationRoute, Controller.updateMe)


module.exports = router;