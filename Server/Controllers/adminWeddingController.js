const express = require("express");
const router = express.Router();
const Wedding = require("../Model/adminWeddingModel");
const upload = require("../multer");
const catchAsyncErrors = require("../Middleware/CatchAsyncErrors");

router.route("/create-wedding").post(
  upload.array("file", 20),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { groom, bride, quote, description } = req.body;
    } catch (error) {
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  })
);

module.exports = router;
