const mongoose = require("mongoose");

const detailsSchema = new mongoose.Schema(
  {
    para1: {
      type: String,
      required: true,
    },
    para2: {
      type: String,
      required: true,
    },
    image1: {
      type: String,
      required: true,
    },
    image2: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("detail", detailsSchema);
