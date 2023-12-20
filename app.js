const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const indexRouter = require("./routes/index");
const limiter = require("./middleware/rateLimiter");
const mongoString = process.env.MONGO_URI;

const app = express();

// express-rate-limiter requires trust proxy to be set to users ip when behind a proxy (heroku/render)
app.set("trust proxy", 2);

mongoose.set("strictQuery", true);
mongoose.connect(mongoString);

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// rate limiter
app.use(limiter);

app.use("/", indexRouter);

module.exports = app;
