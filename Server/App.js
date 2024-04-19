const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ErrorHandler = require("./Middleware/Error");
const notFound = require("./Middleware/not-Found");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));

//routes
const adminController = require("./Controllers/adminController");
const adminFormController = require("./Controllers/adminFormController");
app.use("/api/v2", adminController);
app.use("/api/v2/adminForm", adminFormController);

//for error handling
app.use(ErrorHandler);
app.use(notFound);

module.exports = app;
