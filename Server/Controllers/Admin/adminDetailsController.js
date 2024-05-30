const express = require("express");
const router = express.Router();
const AdminDetails = require("../../Model/Admin/AdminDetailsModel");
const upload = require("../../multer");
const catchAsyncErrors = require("../../Middleware/CatchAsyncErrors");
const path = require("path");
const ErrorHandler = require("../../Utils/ErrorHandler");

router.route("/get-details").get(
  catchAsyncErrors(async (req, res, next) => {
    try {
      const details = await AdminDetails.find({});
      res.status(200).json({ success: true, details });
    } catch (error) {
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  })
);

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

      let image1, image2
      if(req.files["image1"]) {
        const fileName = req.files["image1"][0].filename;
        const fileUrl = path.join(fileName);
        image1 = fileUrl
      }
      if(req.files["image2"]) {
        const fileName = req.files["image2"][0].filename;
        const fileUrl = path.join(fileName);
        image2 = fileUrl
      }


      const datas = {
        para1,
        para2,
        image1,
        image2,
      };

      const details = await AdminDetails.create(datas);

      if (!details) {
        return next(new ErrorHandler("Data not created", 400));
      }

      res.status(201).json({ success: true, details });
    } catch (error) {
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  })
);


router.route("/single-details/:id").get(
  catchAsyncErrors(async (req, res, next) => {
    const { id: detailsId } = req.params;
    const details = await AdminDetails.findOne({ _id: detailsId });
    if (!details) {
      return next(new ErrorHandler("No details with this id", 400));
    }
    res.status(200).json({ success: true, details });
  })
);


router.route("/update-details/:id").patch(
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  catchAsyncErrors(async (req, res, next) => {
    const { id: detailsId } = req.params;
    const { para1, para2 } = req.body;
    console.log(req.body)

    let updatedFields = {
      para1,
      para2,
    };

    if (req.files["image1"]) {
      const fileName = req.files["image1"][0].filename;
      const fileUrl = path.join(fileName);
      updatedFields.image1 = fileUrl;
    }

    if (req.files["image2"]) {
      const fileName = req.files["image2"][0].filename;
      const fileUrl = path.join(fileName);
      updatedFields.image2 = fileUrl;
    }

    const details = await AdminDetails.findOneAndUpdate(
      { _id: detailsId },
      updatedFields,
      { new: true, runValidators: true }
    );

    if (!details) {
      return res.status(404).json({ msg: `No details with id: ${detailsId}` });
    }

    res.status(200).json({ success: true, details });
  })
);



router.route("/delete-details/:id").delete(
  catchAsyncErrors(async (req, res, next) => {
    const { id: detailsId } = req.params;
    const details = await AdminDetails.findOneAndDelete({ _id: detailsId });
    if (!details) {
      return next(new ErrorHandler("No details with this id", 400));
    }
    res.status(200).json({ success: true, details });
  })
);

module.exports = router;
