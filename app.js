const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const indexRouter = require("./routes/index");
const limiter = require("./middleware/rateLimiter");

// Create rate limiting middleware

// Apply the rate limiting middleware to all requests
const app = express();
const mongoString = process.env.MONGO_URI;

mongoose.set("strictQuery", true);
mongoose.connect(mongoString);

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(limiter);

app.use("/", indexRouter);

module.exports = app;
