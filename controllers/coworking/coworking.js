const User = require("../../models/User");
const Room = require("../../models/Room");
const Reservation = require("../../models/Reservation");
const CoWorking = require("../../models/CoWorking");
const { checkout } = require("../../routes/auth");
const moment = require("moment-timezone");

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
        req.body.room_id = req.params.room_id;
        req.body.u_id = req.user._id;
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

        var room = await Room.findById(req.params.room_id);
        var coworking = await CoWorking.findById(room.coworking_id);
        var reservation = await Reservation.findById(req.params.r_id);
        // the updated check-in and check-out time should be in between the coworking space's open and close time
        if (req.body.check_in != undefined){
            req.body.check_in = moment(req.body.check_in, 'YYYY-MM-DDTHH:mm:ssZ').tz('Asia/Bangkok').toDate();
        }else{
            req.body.check_in = reservation.check_in;
        }
        if (req.body.check_out != undefined){
            req.body.check_out = moment(req.body.check_out, 'YYYY-MM-DDTHH:mm:ssZ').tz('Asia/Bangkok').toDate();
        }else {
            req.body.check_out = reservation.check_out;
        }

        // 1. check in and check out time should not be in the past
        // 2. check in time should be earlier than check out time
        // 3. check in and check out time should be in the same day
        // if (req.body.check_in < Date.now() || req.body.check_out < Date.now()) {
        //     return res.status(400).json({ success: false, error: "The check-in and check-out time should not be in the past" });
        // }
        console.log(req.body.check_in);
        console.log(req.body.check_out);
        if (req.body.check_in > req.body.check_out) {
            return res.status(400).json({ success: false, error: "The check-in time should be earlier than the check-out time" });
        }
        if (req.body.check_in.getDate() != req.body.check_out.getDate()) {
            return res.status(400).json({ success: false, error: "The check-in and check-out time should be in the same day" });
        }
        // the open and close time of the coworking is encoded as an integer 0-23
        const check_in_hour = req.body.check_in.getHours();
        const check_out_hour = req.body.check_out.getHours();

        // 4. check in time should be earlier than the close time of the coworking
        if (check_in_hour < coworking.open_at) {
            return res.status(400).json({ success: false, error: "The check-in time should be later than the open time of the coworking" });
        }
        // 5. check out time should be earlier than the close time of the coworking
        if (check_out_hour > coworking.close_at) {
            return res.status(400).json({ success: false, error: "The check-out time should be earlier than the close time of the coworking" });
        }

        // validate order
        if (req.body.order != undefined) {
            req.body.order = reservation.order;
        }
        // validate caretaker
        if (req.body.caretaker != undefined) {
            req.body.caretaker = reservation.caretaker;
        }

        reservation = await Reservation.findByIdAndUpdate(req.params.r_id, req.body, {
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
