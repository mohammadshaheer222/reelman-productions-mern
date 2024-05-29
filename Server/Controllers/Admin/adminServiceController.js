const express = require("express");
const router = express.Router();
const AdminService = require("../../Model/Admin/adminServiceModel");
const CatchAsyncErrors = require("../../Middleware/CatchAsyncErrors");
const upload = require("../../multer");
const path = require("path");
const ErrorHandler = require("../../Utils/ErrorHandler");

router.route("/get-service").get(
  CatchAsyncErrors(async (req, res, next) => {
    try {
      const service = await AdminService.find({});
      res.status(200).json({ success: true, service });
    } catch (error) {
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  })
);

router.route("/create-service").post(
  upload.single("image"),
  CatchAsyncErrors(async (req, res, next) => {
    try {
      const { category, description } = req.body;

      if (!category || !description) {
        return next(new ErrorHandler("All fields are mandatory", 400));
      }

      const fileName = req.file.filename;
      const fileUrl = path.join(fileName);

      const details = {
        category,
        description,
        image: fileUrl,
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

router.route("/update-service/:id").patch(
  upload.single("image"),
  CatchAsyncErrors(async (req, res, next) => {
    const { id: serviceId } = req.params;
    const { category, description } = req.body;

    let updatedFields = {
      category,
      description,
    };

    if (req.file) {
      const fileName = req.file.filename;
      const fileUrl = path.join(fileName);
      updatedFields.image = fileUrl;
    }

    const service = await AdminService.findOneAndUpdate(
      { _id: serviceId },
      updatedFields,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ msg: `No service with id: ${serviceId}` });
    }

    res.status(200).json({ success: true, service });
  })
);

router.route("/single-service/:id").get(
  CatchAsyncErrors(async (req, res, next) => {
    const { id: serviceId } = req.params;
    const service = await AdminService.findOne({ _id: serviceId });
    if (!service) {
      return next(new ErrorHandler("No data with this id", 400));
    }
    res.status(200).json({ success: true, service });
  })
);

router.route("/delete-service/:id").delete(
  CatchAsyncErrors(async (req, res, next) => {
    const { id: serviceId } = req.params;
    const service = await AdminService.findOneAndDelete({ _id: serviceId });
    if (!service) {
      return next(new ErrorHandler("No data with this id", 400));
    }
    res.status(200).json({ success: true, service });
  })
);

module.exports = router;
