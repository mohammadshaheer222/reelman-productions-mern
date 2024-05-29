const mongoose = require("mongoose");

const instaSchema = new mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("link", instaSchema);
