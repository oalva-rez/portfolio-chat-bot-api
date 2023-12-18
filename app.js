const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const indexRouter = require("./routes/index");

const app = express();
const mongoString = process.env.MONGO_URI;

mongoose.set("strictQuery", true);
mongoose.connect(mongoString);

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

module.exports = app;
