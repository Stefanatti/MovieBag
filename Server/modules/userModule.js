const mongoose = require("./connection");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a valid password"],
  },
  sessionVersion: { type: Number, default: 0 },
  passwordResetDigest: { type: String, select: false },
  passwordResetExpiresAt: { type: Date, select: false },
  otpSecret: {
    type: String,
  },
  registerDate: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
