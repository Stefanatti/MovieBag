const User = require("../modules/userModule");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
//const speakeasy = require("speakeasy");
require("dotenv").config({ path: ".env" });

const appUrl = process.env.APP_URL;

const signupUser = async (req, res) => {
  try {
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res
        .status(400)
        .send({ message: "Please complete all the fields" });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send({ message: "The user already exists" });
    }

    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .send({ message: "An error occurred while hashing the password" });
      }

      const secret = crypto.randomBytes(20).toString("hex");

      let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        otpSecret: secret,
      });

      try {
        await newUser.save();
        res.status(201).send({ message: "User created successfully" });
      } catch (saveErr) {
        console.error(saveErr);
        res
          .status(500)
          .send({ message: "An error occurred while saving the user" });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An  error occurred" });
  }
};

const loginUser = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).send({ message: "Wrong username" });
    }

    bcrypt.compare(req.body.password, user.password, function (err, result) {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .send({ message: "An error occurred while comparing passwords" });
      }

      if (result) {
        let token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY, {
          expiresIn: process.env.TOKEN_EXPIRES_IN,
        });

        res.status(200).send({ token });
      } else {
        res.status(401).send({ message: "Wrong password" });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred" });
  }
};

const verifyUser = async (req, res) => {
  try {
    jwt.verify(req.body.token, process.env.TOKEN_KEY, async (err, payload) => {
      if (err) {
        console.error(err);
        return res.status(401).send({ message: "Session expired" });
      }

      if (payload) {
        let user = await User.findOne({ _id: payload.id });
        if (user) {
          res.status(200).send(user);
        } else {
          res.status(404).send({ message: "User not found" });
        }
      } else {
        res.status(401).send({ message: "Session expired" });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "User's email don't found" });
    }
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY, {
      expiresIn: "10m",
    });
    const transpoter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "stekots@gmail.com",
        pass: "xokuajxnjtbeaill",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const resetUrl = `${appUrl}/reset_password/${token}`;

    const emailOptions = {
      from: "stekots@gmail.com",
      to: req.body.email,
      subject: "Test Email",
      subject: "Reset Password",
      html: `<h1>Reset Your Password</h1>
      <p>Click on the following link to reset your password:</p>
      <a href=${resetUrl}>${resetUrl}</a>
      <p>The link will expire in 10 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    transpoter.sendMail(emailOptions, (err, info) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      res.status(200).send({ message: "Email sent, check your email." });
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.params.token, process.env.TOKEN_KEY);

    if (!decodedToken) {
      return res.status(401).send({ message: "Invalid token" });
    }
    console.log(decodedToken);
    const user = await User.findOne({ id: decodedToken.userId });
    if (!user) {
      return res.status(401).send({ message: "No user found" });
    }

    const salt = await bcrypt.genSalt(10);
    req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).send({ message: "Password updated" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// const generateOtp = async (req, res) => {
//   const userId = req.body.id;
//   try {
//     const token = speakeasy.totp({
//       secret: userId.otpSecret,
//       encoding: "base32",
//     });

//     res.send({ token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: "Failed to generate OTP." });
//   }
// };

// const verifyOtp = async (req, res) => {
//   const { userId, token } = req.body;

//   try {
//     const verified = speakeasy.totp.verify({
//       secret: userId.otpSecret,
//       encoding: "base32",
//       token,
//     });

//     if (verified) {
//       res.send({ success: true, message: "OTP verified successfully." });
//     } else {
//       res.send({ success: false, message: "Invalid OTP." });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: "Failed to verify OTP." });
//   }
// };

module.exports = {
  signupUser,
  loginUser,
  verifyUser,
  forgotPassword,
  resetPassword,
  // generateOtp,
  // verifyOtp,
};
