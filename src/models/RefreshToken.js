const mongoose = require("mongoose");

const RefreshTokenSchema = mongoose.Schema({
  value: String
});

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);