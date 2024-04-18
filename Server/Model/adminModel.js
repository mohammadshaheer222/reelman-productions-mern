const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please Enter your Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter your Password"],
    minLength: [4, "Password should be greater than 4 characters"],
    // select: false,
  },
});

module.exports = mongoose.model("admin", adminSchema);
