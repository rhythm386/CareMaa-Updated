const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  role: { type: String, default: "mother" }
});

module.exports = mongoose.model("User", UserSchema);
