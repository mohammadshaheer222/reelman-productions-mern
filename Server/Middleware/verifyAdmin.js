const jwt = require("jsonwebtoken");
const ErrorHandler = require("../Utils/ErrorHandler");

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(req.cookies);
    if (!token) {
      return next(new ErrorHandler("No token", 400));
    }
    console.log(token)
    const decoded = await jwt.verify(token, process.env.ACTIVATION_SECRET);

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { verifyAdmin };
