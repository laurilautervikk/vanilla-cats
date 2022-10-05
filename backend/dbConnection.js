const mongoose = require("mongoose");
const User = require("./models/userModel.js");
const dotenv = require("dotenv");

dotenv.config();
// Connecting to database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

module.exports = User;
