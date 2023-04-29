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




router.route('').get(protect, getCoWorkingSpaces)

router.route('/:c_id/room').get(protect, getRoomsInCoWorkingSpace)

router.route('/:c_id/room/:room_id/reservation')
    // .get( ,mockupfunc('get all reservations in a room')) should be protected for admin only
    .get(protect, authorize("admin"), getReservationsInRoom)
    .post(protect,authorize("user"), createReservationInRoom)

router.route('/:c_id/room/:room_id/reservation/:r_id')
    .put(protect, authorize("user",'admin'), updateReservationInRoom)
    .delete(protect,authorize("user",'admin'), deleteReservationInRoom)


module.exports = router;