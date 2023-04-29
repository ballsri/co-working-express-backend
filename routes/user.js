const express = require('express');
const mockupfunc = require('../util/mockup-response.js').mockupfunc;
const { getReservations } = require('../controllers/user/user.js');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth.js');


router.route("/:u_id/reservation").get(protect, authorize('user'), getReservations);
router.route('/:u_id/reservation/:r_id')
    .put(mockupfunc('update a reservation of a user'))
    .delete(mockupfunc('delete a reservation of a user'))

module.exports = router;