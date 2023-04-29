const express = require('express');
const mockupfunc = require('../util/mockup-response.js').mockupfunc;

const router = express.Router();

router.route('user/:u_id/reservation').get(mockupfunc('get all reservations of a user'))
router.route('user/:u_id/reservation/:r_id')
    .put(mockupfunc('get a reservation of a user'))
    .delete(mockupfunc('delete a reservation of a user'))
