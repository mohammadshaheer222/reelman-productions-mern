const jwt = require("jsonwebtoken");
const ErrorHandler = require("../Utils/ErrorHandler");

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return next(new ErrorHandler("No token", 400));
    }
    const decoded = await jwt.verify(token, process.env.ACTIVATION_SECRET);

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { verifyAdmin };
