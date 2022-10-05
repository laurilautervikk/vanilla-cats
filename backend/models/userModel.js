const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//schema
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
//model
const User = mongoose.model("User", UserSchema);

module.exports = User;
