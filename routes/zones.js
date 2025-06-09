const express = require('express');
const router = express.Router({mergeParams: true });
const Controller = require('../controllers/zones');
const validationRoute = require('../middlewares/validationRoute');
const auth = require('../middlewares/auth');

const {
    query,
    param,
    body
} = require('express-validator');

router.route('/')
    .get(validationRoute, Controller.getAllZones)
    .post([
        body('name').notEmpty().isString().withMessage('Name is required and must be a string'),
        body('capacity').notEmpty().isInt({ min: 1 }).withMessage('Capacity is required and must be a positive integer'),
        // body('description').optional().isString().withMessage('Description must be a string'),
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableSpace, Controller.createZone) //Vereficar se o usuario é admin ou promoter

router.route('/:idZone')
    .get([
        param('idZone').notEmpty().isUUID().withMessage('ID is required and must be a valid UUID'),
    ], validationRoute, Controller.getZoneById)
    .put([
        param('idZone').notEmpty().isUUID().withMessage('ID is required and must be a valid UUID'),
        body('name').optional().isString().withMessage('Name must be a string'),
        body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
    ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableSpace, Controller.updateZone)
    // .delete([
    //     param('idZone').notEmpty().isUUID().withMessage('ID is required and must be a valid UUID'),
    // ], validationRoute, auth.auth, auth.isPromoterOrAdmin, auth.isAvailableSpace, Controller.deleteZone);


module.exports = router;