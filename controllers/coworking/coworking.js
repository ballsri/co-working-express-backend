const User = require("../../models/User");
const Room = require("../../models/Room");
const Reservation = require("../../models/Reservation");
const CoWorking = require("../../models/CoWorking");

// @desc Get all co-working spaces
// @route GET /api/v1/co-working
// @access Public
exports.getCoWorkingSpaces = async (req, res, next) => {
  try {
    const co_working = await CoWorking.find();
    res.status(200).json({ success: true, data: co_working });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
    console.log(err.stack);
  }
};

// @desc Get all rooms in a co-working space
// @route GET /api/v1/co-working/:c_id/room
// @access Public
exports.getRoomsInCoWorkingSpace = async (req, res, next) => {
  try {
    const rooms = await Room.find({ co_working_id: req.params.c_id });
    res.status(200).json({ success: true, data: rooms });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
    console.log(err.stack);
  }
};

// @desc Get all reservations in a room
// @route GET /api/v1/co-working/:c_id/room/:room_id/reservation
// @access Public
exports.getReservationsInRoom = async (req, res, next) => {
    try {
        const reservations = await Reservation.find({ room_id: req.params.room_id });
        res.status(200).json({ success: true, data: reservations });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
        console.log(err.stack);
    }
};

// @desc Create a reservation in a room
// @route POST /api/v1/co-working/:c_id/room/:room_id/reservation
// @access Public
exports.createReservationInRoom = async (req, res, next) => {
    try {
        const reservation = await Reservation.create(req.body);
        res.status(200).json({ success: true, data: reservation });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
        console.log(err.stack);
    }
}

// @desc Update a reservation in a room
// @route PUT /api/v1/co-working/:c_id/room/:room_id/reservation/:r_id
// @access Public
exports.updateReservationInRoom = async (req, res, next) => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(req.params.r_id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: reservation });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
        console.log(err.stack);
    }
}

// @desc Delete a reservation in a room
// @route DELETE /api/v1/co-working/:c_id/room/:room_id/reservation/:r_id
// @access Public
exports.deleteReservationInRoom = async (req, res, next) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.r_id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
        console.log(err.stack);
    }
}
