const express = require("express");
const router = express.Router();
const AdminForm = require("../Model/adminForm");
const CatchAsyncErrors = require("../Middleware/CatchAsyncErrors");
const upload = require("../multer");
const path = require("path");

router.route("/create-slide").post(
  upload.fields([
    { name: "hero-avatar", maxCount: 8 },
    { name: "mid-avatar", maxCount: 8 },
  ]),
  CatchAsyncErrors(async (req, res, next) => {
    try {
      let heroAvatar = [];
      if (Array.isArray(req.files["hero-avatar"])) {
        //array.isArray means ith true or false maathrame return cheyyu. hero-avataril nthelum files undenkil true return cheyyum allenkil false return cheyyum
        heroAvatar = req.files["hero-avatar"].map((file) =>
          path.join(file.filename)
        );
      }

      let midAvatar = [];
      if (Array.isArray(req.files["mid-avatar"])) {
        midAvatar = req.files["mid-avatar"].map((file) =>
          path.join(file.filename)
        );
      }
      const avatar = await AdminForm.create({ heroAvatar, midAvatar });
      res.status(201).json({ avatar });
    } catch (error) {
      console.log(error);
    }
  })
);



router.route("/get-slide").get(CatchAsyncErrors(async(req, res, next) => {
  const avatar = await AdminForm.find()
  res.status(200).json(avatar)
}))

module.exports = router;
