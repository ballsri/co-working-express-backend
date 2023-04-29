const express = require('express');
const mockupfunc = require('../util/mockup-response.js').mockupfunc;

const router = express.Router();




router.route('').get(mockupfunc('get all co-working spaces'))

router.route('/:c_id/room').get(mockupfunc('get all rooms in a co-working space'))

router.route('/:c_id/room/:room_id/reservation')
    .get(mockupfunc('get all reservations in a room'))
    .post(mockupfunc('create a reservation in a room'))
    .put(mockupfunc('update a reservation in a room'))
    .delete(mockupfunc('delete a reservation in a room'))



module.exports = router;