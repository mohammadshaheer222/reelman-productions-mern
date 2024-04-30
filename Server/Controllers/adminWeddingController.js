const express = require("express");
const router = express.Router();
const Wedding = require("../Model/adminWeddingModel");
const upload = require("../multer");
const catchAsyncErrors = require("../Middleware/CatchAsyncErrors");
const path = require("path");
const ErrorHandler = require("../Utils/ErrorHandler");

router.route("/get-wedding").get(
  catchAsyncErrors(async (req, res, next) => {
    try {
      const wedding = await Wedding.find({});
      res.status(200).json({ success: true, wedding });
    } catch (error) {
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  })
);

router.route("/create-wedding").post(
  upload.fields([
    { name: "profile-avatar", maxCount: 1 },
    { name: "cover-avatar", maxCount: 1 },
    { name: "file", maxCount: 20 },
  ]),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { groom, bride, quote, description } = req.body;
      if (!groom || !bride || !quote || !description) {
        return next(new ErrorHandler("All fields are mandatory", 400));
      }

      if (!req.files || req.files.length === 0) {
        return next(new ErrorHandler("Image field is mandatory", 400));
      }

      const weddingAvatar = [];
      for (const file of req.files["file"]) {
        const fileName = file.filename;
        const avatar = path.join(fileName);
        weddingAvatar.push(avatar);
      }

      const profileFile = req.files["profile-avatar"][0];
      const profile = profileFile.filename;

      const coverFile = req.files["cover-avatar"][0];
      const cover = coverFile.filename;

      const weddingData = await Wedding.create({
        bride,
        groom,
        quote,
        description,
        weddingAvatar,
        profile,
        cover,
      });

      res.status(201).json({ success: true, weddingData });
    } catch (error) {
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  })
);

router.route("/delete-wedding").delete(
  catchAsyncErrors(async (req, res, next) => {
    console.log(req.body);
  })
);

module.exports = router;
