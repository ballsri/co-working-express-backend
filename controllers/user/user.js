const User = require("../../models/User");
const Reservation = require("../../models/Reservation");

//@desc     Get all reservations for a user
//@routes   Get /api/v1/user/:u_id/reservation
//@acess    Public
exports.getReservations = async (req, res, next) => {
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
exports.updateReservation = async (req, res, next) => {
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
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.r_id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ success: true, data: updatedReservation });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

//@desc    Delete a reservation for a user
//@routes   DELETE /api/v1/user/:u_id/reservation/:r_id
//@acess    Public
exports.deleteReservation = async (req, res, next) => {
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
    await reservation.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};
