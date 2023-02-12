const mongoose = require("mongoose");

const InteriorSchema = mongoose.Schema({
  name: String,
});

module.exports = mongoose.model("Interior", InteriorSchema);