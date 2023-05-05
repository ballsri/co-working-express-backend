const mongoose = require("mongoose");

const CaretakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add name"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
    min: [1000, "Price must be between 1000 and 10000"],
    max: [10000, "Price must be between 1000 and 10000"],
  },
  coworking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CoWorking",
    required: [true, "Please add a coworking id"],
  }
});

module.exports = mongoose.model("Caretaker", CaretakerSchema);
