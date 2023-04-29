const express = require('express');
const mockupfunc = require('../util/mockup-response.js').mockupfunc;
const { protect, authorize } = require('../middleware/auth');
const { 
    getCoWorkingSpaces,
    getRoomsInCoWorkingSpace,
    getReservationsInRoom,
    createReservationInRoom,
    updateReservationInRoom,
    deleteReservationInRoom,
 } = require('../controllers/coworking/coworking.js');

const router = express.Router();




router.route('').get(getCoWorkingSpaces)

router.route('/:c_id/room').get(getRoomsInCoWorkingSpace)

router.route('/:c_id/room/:room_id/reservation')
    // .get( ,mockupfunc('get all reservations in a room')) should be protected for admin only
    .get(mockupfunc('get all reservations in a room'))
    .post(mockupfunc('create a reservation in a room'))

router.route('/:c_id/room/:room_id/reservation/:r_id')
    .put(mockupfunc('update a reservation in a room'))
    .delete(mockupfunc('delete a reservation in a room'))



module.exports = router;