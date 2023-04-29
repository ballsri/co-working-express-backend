const express = require('express');
const mockupfunc = require('../util/mockup-response.js').mockupfunc;

const router = express.Router();

router.route('/:u_id/reservation').get(mockupfunc('get all reservations of a user'))
router.route('/:u_id/reservation/:r_id')
    .put(mockupfunc('update a reservation of a user'))
    .delete(mockupfunc('delete a reservation of a user'))

module.exports = router;