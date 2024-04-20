const mongoose = require("mongoose");

const adminFormSchema = new mongoose.Schema({
  heroAvatar: {
    type: [String],
    required: false,
  },

  midAvatar: {
    type: [String],
    required: false,
  },
});

module.exports = mongoose.model("adminForm", adminFormSchema);
