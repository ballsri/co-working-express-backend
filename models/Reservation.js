const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const ReservationSchema = new mongoose.Schema({
  u_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please add a user id"],
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: [true, "Please add a room id"],
  },
  check_in: {
    type: Date,
    required: [true, "Please add a check in date"],
  },
  check_out: {
    type: Date,
    required: [true, "Please add a check out date"],
  },
  order: {
    type: Array,
    required: [true, "Please add an order"],
  },
  caretaker: {
    type: String,
    required: false,
  },
  lucky: {
    type: Boolean,
    required: false,
  },
  voucher: {
    type: {
      discount: {
        type: Number,
        required: true,
      },
    },
    required: false,
  },
});

module.exports = mongoose.model("Reservation", ReservationSchema);
