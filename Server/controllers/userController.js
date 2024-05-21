const User = require("../modules/userModule");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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

      let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
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

// const forgotPassword = async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return res.status(404).send({ message: "User don't found" });
//     }
//     const token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY, {
//       expiresIn: "10m",
//     });
//     const transpoter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "stekots@gmail.com",
//         pass: "1006000",
//       },
//     });
//     const emailOptions = {
//       from: "stekots@gmail.com",
//       to: req.body.email,
//       subject: "Reset Password",
//       html: `<h1>Reset Your Password</h1>
//     <p>Click on the following link to reset your password:</p>
//     <a href="http://localhost:3636/reset_password/${token}">http://localhost:3636/reset_password/${token}</a>
//     <p>The link will expire in 10 minutes.</p>
//     <p>If you didn't request a password reset, please ignore this email.</p>`,
//     };

//     transpoter.sendMail(emailOptions, (err, info) => {
//       if (err) {
//         return res.status(500).send({ message: err.message });
//       }
//       res.status(200).send({ message: "Email sent" });
//     });
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// };

// const resetPassword = async (req,res) =>{
//   try{

//   }catch(err){console.log(err)}
// }

module.exports = {
  signupUser,
  loginUser,
  verifyUser,
  //forgotPassword
};
