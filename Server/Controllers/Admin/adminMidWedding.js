const express = require("express");
const router = express.Router();
const Wedding = require("../../Model/Admin/adminMidWedding");
const upload = require("../../multer");
const catchAsyncErrors = require("../../Middleware/CatchAsyncErrors");
const ErrorHandler = require("../../Utils/ErrorHandler");
const fs = require("fs");

router.route("/get-wedding-mid").get(
  catchAsyncErrors(async (req, res, next) => {
    try {
      const wedding = await Wedding.find({});
      res.status(200).json({ success: true, wedding });
    } catch (error) {
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  })
);

router.route("/create-wedding-mid").post(
  upload.fields([
    { name: "profile-avatar", maxCount: 1 },
    { name: "cover-avatar", maxCount: 1 },
    { name: "file", maxCount: 70 },
  ]),
  catchAsyncErrors(async (req, res, next) => {
    try {
        console.log(req.body)
      const { groom, bride, quote, description } = req.body;
      if (!groom || !bride || !quote || !description) {
        return next(new ErrorHandler("All fields are mandatory", 400));
      }

      if (!req.files || req.files.length === 0) {
        return next(new ErrorHandler("Image field is mandatory", 400));
      }

      const weddingAvatar = req.files["file"].map((file) => file.filename);

      let profile, gif;
      if (req.files["profile-avatar"]) {
        const profileFile = req.files["profile-avatar"][0];
        profile = profileFile.filename;
      }

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

      if (!weddingData) {
        return next(new ErrorHandler("Data not create", 400));
      }

      res.status(201).json({ success: true, weddingData });
    } catch (error) {
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  })
);

router.route("/single-wedding-mid/:id").get(
  catchAsyncErrors(async (req, res, next) => {
    const { id: weddingId } = req.params;
    const wedding = await Wedding.findOne({ _id: weddingId });
    if (!wedding) {
      return next(new ErrorHandler("No Wedding with this id", 400));
    }
    res.status(200).json({ success: true, wedding });
  })
);

router.route("/update-wedding-mid/:id").patch(
  upload.fields([
    { name: "profile-avatar", maxCount: 1 },
    { name: "cover-avatar", maxCount: 1 },
    { name: "file", maxCount: 50 },
  ]),
  catchAsyncErrors(async (req, res, next) => {
    const { id: weddingId } = req.params;
    const { groom, bride, quote, description } = req.body;

    const updatedFields = {
      groom,
      bride,
      quote,
      description,
    };

    if (req.files["profile-avatar"]) {
      updatedFields.profile = req.files["profile-avatar"][0].filename;
    }

    if (req.files["cover-avatar"]) {
      updatedFields.cover = req.files["cover-avatar"][0].filename;
    }

    if (req.files["file"]) {
      if (req.files["file"].length > 50) {
        return res
          .status(400)
          .json({ message: "Maximum 50 photos are allowed" });
      }

      updatedFields.weddingAvatar = req.files["file"].map(
        (file) => file.filename
      );
    }

    const wedding = await Wedding.findOneAndUpdate(
      { _id: weddingId },
      updatedFields,
      { new: true, runValidators: true }
    );

    if (!wedding) {
      return res.status(404).json({ msg: `No wedding with id: ${weddingId}` });
    }

    res.status(200).json({ success: true, wedding });
  })
);

router.route("/delete-wedding-mid/:id").delete(
  catchAsyncErrors(async (req, res, next) => {
    const { id: weddingId } = req.params;
    const wedding = await Wedding.findOneAndDelete({ _id: weddingId });
    if (!wedding) {
      return next(new ErrorHandler("No Images with this id", 400));
    }
    res.status(200).json({ success: true, wedding });
  })
);

router.route("/latest-wedding").get(
  catchAsyncErrors(async (req, res, next) => {
    try {
      const wedding = await Wedding.find({});
      if (!wedding) {
        return next(new ErrorHandler("No wedding with this id", 400));
      }
      const latestWedding = wedding.slice(0).slice(-4);
      res.json({ status: true, latestWedding });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
