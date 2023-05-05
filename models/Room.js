const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const RoomSchema = new mongoose.Schema({
  coworking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CoWorking",
    required: [true, "Please add a coworking id"],
  },
  name: {
    type: String,
    required: [true, "Please add name"],
  },
  size: {
    type: String,
    enum: ["S", "M", "L"],
    required: [true, "Please add a size"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
  },
  status : {
    type: String,
    enum: ["unoccupied", "occupied" ],
    default: "unoccupied",
  },
});

module.exports = mongoose.model("Room", RoomSchema);
