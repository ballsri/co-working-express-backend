const User = require("../../models/User");
const Reservation = require("../../models/Reservation");
const CoWorking = require("../../models/CoWorking");
const Room = require("../../models/Room");
const { updateReservation } = require("../coworking/coworking.js");

//@desc     Get all reservations for a user
//@routes   Get /api/v1/user/:u_id/reservation
//@acess    Public
exports.getReservationsByUserId = async (req, res, next) => {
  try {
    // find user by id

    const user = await User.findById(req.params.u_id);
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    }
    const reservations = await Reservation.find({ u_id: req.params.u_id });
    res.status(200).json({ success: true, data: reservations });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

//@desc     Update a reservation for a user
//@routes   PUT /api/v1/user/:u_id/reservation/:r_id
//@acess    Public
exports.updateReservationByUserId = async (req, res, next) => {
  try {
    var user = await User.findById(req.params.u_id);
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    }
    var reservation = await Reservation.findById(req.params.r_id);
    if (!reservation) {
      return res
        .status(400)
        .json({ success: false, msg: "Reservation not found" });
    }

    var room = await Room.findById(reservation.room_id);
    var coworking = await CoWorking.findById(room.coworking_id);

    console.log("reservation: ", reservation)
    console.log("room: ", room)
    console.log("coworking: ", coworking)
    
    return await updateReservation(req,res, reservation, room, coworking);
  
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

//@desc    Delete a reservation for a user
//@routes   DELETE /api/v1/user/:u_id/reservation/:r_id
//@acess    Public
exports.deleteReservationByUserId = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.u_id);
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    }
    const reservation = await Reservation.findById(req.params.r_id);
    if (!reservation) {
      return res
        .status(400)
        .json({ success: false, msg: "Reservation not found" });
    }

    // delete reservation
    await Reservation.findByIdAndDelete(req.params.r_id);

    res.status(200).json({ success: true, msg: "Reservation was deleted" });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

// @desc    Check in a reservation for a user
// @routes   GET /api/v1/user/:u_id/reservation/:r_id/check-in
// @acess    Public
exports.checkin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.u_id);
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    }
    const reservation = await Reservation.findById(req.params.r_id);
    if (!reservation) {
      return res
        .status(400)
        .json({ success: false, msg: "Reservation not found" });
    }
    // check if the user owns the reservation
    if (reservation.u_id != req.params.u_id) {
      return res
        .status(400)
        .json({ success: false, msg: "User does not own the reservation" });
    }
    // check if the check in time is within the reservation time +- 10 minutes
    const now = new Date();
    // reservation.check_in is Date
    const checkinTime = reservation.check_in
    if (now.getTime() < checkinTime.getTime() - 10 * 60 * 1000 || 
        now.getTime() > checkinTime.getTime() + 10 * 60 * 1000) {
      return res
        .status(400)
        .json({ success: false, msg: `Check in time is not within the reservation time, please check in at ${checkinTime}` });
    }
    // update room status
    const room = await Room.findById(reservation.room_id);
    if (!room) {
      return res.status(400).json({ success: false, msg: "Room not found" });
    }
    if (room.status === "occupied") {
      return res
        .status(400)
        .json({ success: false, msg: "Room is already occupied" });
    }
    const updatedRoom = await Room.findByIdAndUpdate(
      reservation.room_id,
      { status: "occupied" },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      data: {
        reservation: reservation,
        room: updatedRoom,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

// @desc    Check out a reservation for a user
// @routes   GET /api/v1/user/:u_id/reservation/:r_id/check-out
// @acess    Public
exports.checkout = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.u_id);
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    }
    const reservation = await Reservation.findById(req.params.r_id);
    if (!reservation) {
      return res
        .status(400)
        .json({ success: false, msg: "Reservation not found" });
    }
    // check if the user owns the reservation
    if (reservation.u_id != req.params.u_id) {
      return res
        .status(400)
        .json({ success: false, msg: "User does not own the reservation" });
    }

    // update room status
    const room = await Room.findById(reservation.room_id);
    if (!room) {
      return res.status(400).json({ success: false, msg: "Room not found" });
    }
    if (room.status === "unoccupied") {
      return res
        .status(400)
        .json({ success: false, msg: "Room is already checked out" });
    }
    const updatedRoom = await Room.findByIdAndUpdate(
      reservation.room_id,
      { status: "unoccupied" },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      data: {
        reservation: reservation,
        room: updatedRoom,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};
