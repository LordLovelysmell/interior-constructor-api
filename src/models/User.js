const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  surname: String,
  interiors: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Interior" }
  ]
});

module.exports = mongoose.model("User", UserSchema);