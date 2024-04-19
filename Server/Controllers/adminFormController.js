const express = require("express");
const router = express.Router();
const AdminForm = require("../Model/adminForm");
const CatchAsyncErrors = require("../Middleware/CatchAsyncErrors");
const upload = require("../multer");

router.route("/create-slide").post(
  upload.array("hero-avatar", 8),
  CatchAsyncErrors(async (req, res, next) => {
    // const { heroAvatar } = req.files
    console.log(req.files);
  })
);

module.exports = router;
