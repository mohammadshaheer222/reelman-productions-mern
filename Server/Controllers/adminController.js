const express = require("express");
const router = express.Router();
const catchAsynErrors = require("../Middleware/CatchAsyncErrors");
const Admin = require("../Model/adminModel");
const { comparePassword } = require("../Utils/bcrypt");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../Utils/ErrorHandler");

router.route("/login").post(
  catchAsynErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new ErrorHandler("Please Provide All Fields", 400));
      }
      // const userN = await Admin.create({email,password})
      const admin = await Admin.findOne({ email });
      if (admin && (await comparePassword(password, admin.password))) {
        const accessToken = jwt.sign(
          { admin: { id: admin._id } },
          process.env.ACTIVATION_SECRET,
          {
            expiresIn: process.env.ACTIVATION_EXPIRES,
          }
        );
        return res
          .status(200)
          .json({ success: true, accessToken, message: "Login Successfull!!" });
      }
      return next(new ErrorHandler("Invalid credentials", 400));
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

module.exports = router;
