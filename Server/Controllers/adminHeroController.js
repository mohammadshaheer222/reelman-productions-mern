const express = require("express");
const router = express.Router();
const AdminHero = require("../Model/adminHeroModel");
const CatchAsyncErrors = require("../Middleware/CatchAsyncErrors");
const upload = require("../multer");
const path = require("path");
const ErrorHandler = require("../Utils/ErrorHandler");

router.route("/get-slide").get(
  CatchAsyncErrors(async (req, res, next) => {
    try {
      const avatar = await AdminHero.find({});
      res.status(200).json({ success: true, avatar });
    } catch (error) {
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  })
);

router.route("/create-slide").post(
  upload.array("hero-avatar", 8),
  CatchAsyncErrors(async (req, res, next) => {
    try {
      if (!req.files) {
        return next(new ErrorHandler("Image field is mandatory", 400));
      }
      let heroAvatar = [];
      for (const file of req.files) {
        const fileName = file.filename;
        const fileUrl = path.join(fileName);
        heroAvatar.push(fileUrl);
      }

      const avatar = await AdminHero.create({ success: true, heroAvatar });
      res.status(201).json({ avatar });
    } catch (error) {
      return next(new ErrorHandler("Bad Request", 400));
    }
  })
);

router.route("/delete-slide/:id").delete(
  CatchAsyncErrors(async (req, res, next) => {
    try {
      const { id: heroId } = req.params;
      const heroAvatar = await AdminHero.findOneAndDelete({ _id: heroId });
      if (!heroAvatar) {
        return next(new ErrorHandler("No Images with this category", 404));
      }
      res.status(200).json({ success: true, heroAvatar });
    } catch (error) {
      console.log(error);
    }
  })
);

module.exports = router;
