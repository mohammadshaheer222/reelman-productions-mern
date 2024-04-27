const express = require("express");
const router = express.Router();
const AdminMid = require("../Model/adminMidModel");
const CatchAsyncErrors = require("../Middleware/CatchAsyncErrors");
const upload = require("../multer");
const path = require("path");
const ErrorHandler = require("../Utils/ErrorHandler");

//get all photos
router.route("/get-mid").get(
  CatchAsyncErrors(async (req, res, next) => {
    try {
      const avatar = await AdminMid.find({});
      res.status(200).json({ success: true, avatar });
    } catch (error) {
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  })
);

router.route("/create-mid").post(
  upload.array("mid-avatar", 8),
  CatchAsyncErrors(async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return next(new ErrorHandler("Image field is mandatory", 400));
      }

      if (req.files.length >= 8) {
        return next(
          new ErrorHandler("You can upload a maximum of 10 photos", 400)
        );
      }

      const avatars = [];
      for (const file of req.files) {
        const fileName = file.filename;
        const midAvatar = path.join(fileName);
        const avatar = await AdminMid.create({ success: true, midAvatar });
        avatars.push(avatar._id);
      }
      res.status(201).json({ avatars });
    } catch (error) {
      return next(new ErrorHandler("Bad Request", 400));
    }
  })
);

router.route("/update-mid/:id").patch(
  upload.single("file"),
  CatchAsyncErrors(async (req, res, next) => {
    try {
      const { id: avatarId } = req.params;
      const fileName = req.file.filename;
      const midAvatar = await AdminMid.findOneAndUpdate(
        { _id: avatarId },
        { midAvatar: fileName },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!midAvatar) {
        return next(new ErrorHandler(`No image with this ${id}`, 404));
      }
      res.status(200).json({ success: true, midAvatar });
    } catch (error) {
      console.log(error);
    }
  })
);

router.route("/delete-mid/:id").delete(
  CatchAsyncErrors(async (req, res, next) => {
    try {
      const { id: midId } = req.params;
      const midAvatar = await AdminMid.findOneAndDelete({ _id: midId });
      if (!midAvatar) {
        return next(new ErrorHandler("No Images with this category", 404));
      }
      res.status(200).json({ success: true, midAvatar });
    } catch (error) {
      console.log(error);
    }
  })
);

module.exports = router;
