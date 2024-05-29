const express = require("express");
const router = express.Router();
const Wedding = require("../../Model/Admin/adminWeddingModel");
const upload = require("../../multer");
const catchAsyncErrors = require("../../Middleware/CatchAsyncErrors");
const path = require("path");
const ErrorHandler = require("../../Utils/ErrorHandler");

router.route("/create-details").post(
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { para1, para2 } = req.body;

      if (!para1 || !para2) {
        return next(new ErrorHandler("All fields are mandatory", 400));
      }

      const fileName = req.file.filename;
      const fileUrl = path.join(fileName);

      const details = {
        category,
        description,
      };

      const service = await AdminService.create(details);

      if (!service) {
        return next(new ErrorHandler("Data not created", 400));
      }

      res.status(201).json({ success: true, service });
    } catch (error) {
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  })
);

module.exports = router;
