const User = require("../../models/User");
const Reservation = require("../../models/reservation");

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
    const reservations = await Reservation.find({u_id: req.params.u_id});
    res.status(200).json({ success: true, data: reservations });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};
