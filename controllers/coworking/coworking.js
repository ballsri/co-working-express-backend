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
    const reservations = await Reservation.find({
      room_id: req.params.room_id,
    });
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

    // Check if date is not undefined
    if (!req.body.check_in || !req.body.check_out) {
      return res.status(400).json({
        success: false,
        error: "Please add a check in and check out date",
      });
    }

    // Date string must be in Bangkok timezone
    req.body.check_in = moment(req.body.check_in, "YYYY-MM-DDTHH:mm:ssZ")
      .tz("Asia/Bangkok")
      .toDate();
    req.body.check_out = moment(req.body.check_out, "YYYY-MM-DDTHH:mm:ssZ")
      .tz("Asia/Bangkok")
      .toDate();

    // Create date objects
    checkIn_date = new Date(req.body.check_in);
    checkOut_date = new Date(req.body.check_out);

    // Check if the room exists
    const room = await Room.findById(req.params.room_id);
    if (!room) {
      return res.status(400).json({ success: false, error: "Room not found" });
    }

    // Check if the co-working space exists
    const co_working = await CoWorking.findById(req.params.c_id);
    if (!co_working) {
      return res
        .status(400)
        .json({ success: false, error: "Co-working space not found" });
    }

    // Check if the room is in the co-working space
    if (room.coworking_id != req.params.c_id) {
      return res.status(400).json({
        success: false,
        error: "Room not found in the co-working space",
      });
    }

    // Check if user already has 3 reservations
    const u_reservations = await Reservation.find({ u_id: req.user._id });
    if (u_reservations.length >= 3) {
      return res
        .status(400)
        .json({ success: false, error: "User already has 3 reservations" });
    }

    // Check-in and check-out time must be in the future
    const date_now = new Date();
    if (
      checkIn_date.getTime() <= date_now.getTime() ||
      checkOut_date.getTime() <= date_now.getTime()
    ) {
      return res.status(400).json({
        success: false,
        error: "Check in and check out time must be in the future",
      });
    }

    // Check-in and check-out time must end with 00
    if (checkIn_date.getMinutes() != 0 || checkOut_date.getMinutes() != 0) {
      return res.status(400).json({
        success: false,
        error: "Check in and check out time must end with 00",
      });
    }

    // Check-in and check-out time must be at least 1 hour apart
    if (checkOut_date.getTime() - checkIn_date.getTime() < 3600000) {
      return res.status(400).json({
        success: false,
        error: "Check in and check out time must be at least 1 hour apart",
      });
    }

    // Check-in time must be before check-out time
    if (checkIn_date.getTime() >= checkOut_date.getTime()) {
      return res.status(400).json({
        success: false,
        error: "Check in time must be before check out time",
      });
    }

    // Check-in time must be after the co-working space's opening time
    if (checkIn_date.getHours() < co_working.open_at) {
      return res.status(400).json({
        success: false,
        error:
          "Check in time must be after the co-working space's opening time",
      });
    }

    // Check-out time must be before the co-working space's closing time
    if (checkOut_date.getHours() > co_working.close_at) {
      return res.status(400).json({
        success: false,
        error:
          "Check out time must be before the co-working space's closing time",
      });
    }

    // Check-in and check-out time must be in the same day

    const start_check_in_date = new Date(checkIn_date).setHours(0, 0, 0, 0);
    const end_check_in_date = new Date(checkIn_date).setHours(0, 0, 0, 0);
    if (start_check_in_date != end_check_in_date) {
      return res.status(400).json({
        success: false,
        error: "Check in and check out time must be in the same day",
      });
    }

    // Check if the room is available in the time range
    const reservations = await Reservation.find({
      room_id: req.params.room_id,
      $or: [
        // Requested check-in dates fall within an existing reservation
        {
          check_in: { $gt: checkIn_date, $lt: checkOut_date },
        },
        // Requested check-out dates fall within an existing reservation
        {
            check_out: { $gt: checkIn_date, $lt: checkOut_date },
        },
        // Requested reservation includes an existing reservation
        {
          check_in: { $lt: checkIn_date },
          check_out: { $gt: checkOut_date },
        },
      ],
    });

    if (reservations.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Room is not available in the time range",
      });
    }

    // Calculate the total price
    const diffTime = checkOut_date.getTime() - checkIn_date.getTime(),
      diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    var total_price = diffHours * room.price;


    // Random if the user lucky
    var discount = 0;
    if (Math.random() < 0.5) {
      // random discount by the total price
      req.body.lucky = true;
      discount = Math.floor(Math.random() * (total_price / 2));
    }

    if (discount != 0) {
      total_price = total_price - discount;
    }

    req.body.voucher.discount = discount;

 

    // Create reservation
    await Reservation.create(req.body);

    // Add total price to the data
    req.body.total_price = total_price;

    res.status(200).json({ success: true, data: req.body });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
    console.log(err.stack);
  }
};

// @desc Update a reservation in a room
// @route PUT /api/v1/co-working/:c_id/room/:room_id/reservation/:r_id
// @access Public
exports.updateReservationInRoom = async (req, res, next) => {
  try {
    var room = await Room.findById(req.params.room_id);
    var coworking = await CoWorking.findById(room.coworking_id);
    var reservation = await Reservation.findById(req.params.r_id);
    // the updated check-in and check-out time should be in between the coworking space's open and close time
    if (req.body.check_in != undefined) {
      req.body.check_in = moment(req.body.check_in, "YYYY-MM-DDTHH:mm:ssZ")
        .tz("Asia/Bangkok")
        .toDate();
    } else {
      req.body.check_in = reservation.check_in;
    }
    if (req.body.check_out != undefined) {
      req.body.check_out = moment(req.body.check_out, "YYYY-MM-DDTHH:mm:ssZ")
        .tz("Asia/Bangkok")
        .toDate();
    } else {
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
      return res.status(400).json({
        success: false,
        error: "The check-in time should be earlier than the check-out time",
      });
    }
    if (req.body.check_in.getDate() != req.body.check_out.getDate()) {
      return res.status(400).json({
        success: false,
        error: "The check-in and check-out time should be in the same day",
      });
    }
    // the open and close time of the coworking is encoded as an integer 0-23
    const check_in_hour = req.body.check_in.getHours();
    const check_out_hour = req.body.check_out.getHours();

    // 4. check in time should be earlier than the close time of the coworking
    if (check_in_hour < coworking.open_at) {
      return res.status(400).json({
        success: false,
        error:
          "The check-in time should be later than the open time of the coworking",
      });
    }
    // 5. check out time should be earlier than the close time of the coworking
    if (check_out_hour > coworking.close_at) {
      return res.status(400).json({
        success: false,
        error:
          "The check-out time should be earlier than the close time of the coworking",
      });
    }

    // validate order
    if (req.body.order != undefined) {
      req.body.order = reservation.order;
    }
    // validate caretaker
    if (req.body.caretaker != undefined) {
      req.body.caretaker = reservation.caretaker;
    }

    reservation = await Reservation.findByIdAndUpdate(
      req.params.r_id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ success: true, data: reservation });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
    console.log(err.stack);
  }
};

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
};
