const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add name"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
    min: [0, "Price must be between 0 and 10000"],
    max: [10000, "Price must be between 0 and 10000"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
