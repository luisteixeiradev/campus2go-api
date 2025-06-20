const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/auth', require('./auth'));
router.use('/promoters', require('./promoters'));
router.use('/spaces', require('./spaces'));
// router.use('/zones', require('./zones'));
router.use('/events', require('./events'));
// router.use('/availableTickets', require('./availableTickets'));
router.use('/sessions', require('./sessions'));
// router.use('/tickets', require('./tickets'));
router.use('/purchases', require('./purchases'));
router.use('/tickets', require('./tickets'));

module.exports = router;