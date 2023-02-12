require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/user");
const interiorRoutes = require("./routes/interior");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(`/${process.env.API_VERSION}/users`, userRoutes);
app.use(`/${process.env.API_VERSION}/interiors`, interiorRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/interior-constructor", (error) => {
  if (error) {
    console.log(error);
    return null;
  }
  console.log("Successefully connected to database.");
});

app.listen(3000, () => console.log("Listening on port 3000..."));