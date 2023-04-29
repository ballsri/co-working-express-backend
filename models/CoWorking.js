const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const CoWorkingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add name"],
    unique: true,
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  phone: {
    type: String,
    required: [true, "Please add a phone number"],
    minlength: [10, "Phone number must be 10 digits"],
    maxlength: [10, "Phone number must be 10 digits"],
  },
  open_at: {
    type: Number,
    required: [true, "Please add an open time"],
    min: [0, "Open time must be between 0 and 23"],
    max: [23, "Open time must be between 0 and 23"],
  },
  close_at: {
    type: Number,
    required: [true, "Please add a close time"],
    min: [0, "Close time must be between 0 and 23"],
    max: [23, "Close time must be between 0 and 23"],
  },
  rooms: {
    // an array of room ids
    type: Array,
    required: false,
  },
  caretaker_list: {
    // an array of caretaker string
    type: Array,
    required: false,
  },
});

module.exports = mongoose.model("CoWorking", CoWorkingSchema);
