const User = require("../modules/userModule");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { signSession } = require("../utils/sessionToken");
const {
  isEmail, normalizeEmail, isUsername, isNewPassword, passwordPolicyMessage,
  signupPasswordMinimum, resetPasswordMinimum,
} = require("../utils/authValidation");
require("dotenv").config({ path: ".env" });

const bcryptCost = 10;
const dummyHash = bcrypt.hashSync(crypto.randomBytes(32).toString("hex"), bcryptCost);
const resetLifetime = 10 * 60 * 1000;
const resetPattern = /^([a-f0-9]{24})\.([a-f0-9]{64})$/;
const digest = (secret) => crypto.createHash("sha256").update(secret).digest("hex");
const invalidCredentials = { message: "Incorrect username or password." };
const invalidReset = { message: "This password reset link is invalid or expired." };
const recoveryResponse = { message: "If an account exists for that email, we'll send a reset link." };
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

const fail = (res, operation, err) => {
  console.error(`Auth ${operation} failed:`, err.code || err.name);
  return res.status(500).send({ message: "Something went wrong. Please try again." });
};

const signupUser = async (req, res) => {
  const { username, password } = req.body || {};
  const email = normalizeEmail(req.body?.email);
  const fieldErrors = {};
  if (!isUsername(username)) {
    fieldErrors.username = "Enter a username between 1 and 256 characters.";
  }
  if (!isEmail(email)) fieldErrors.email = "Enter a valid email address.";
  if (!isNewPassword(password, signupPasswordMinimum)) {
    fieldErrors.password = passwordPolicyMessage(signupPasswordMinimum);
  }
  if (Object.keys(fieldErrors).length) {
    return res.status(400).send({ message: "Please correct the highlighted fields.", fieldErrors });
  }

  try {
    const hash = await bcrypt.hash(password, bcryptCost);
    await User.create({ username: username.trim(), email, password: hash });
    return res.status(201).send({ message: "Account created. You can now log in." });
  } catch (err) {
    if (err.code === 11000) {
      if (err.keyPattern?.email || Object.prototype.hasOwnProperty.call(err.keyValue || {}, "email")) {
        const message = "This email is already registered. Log in or reset your password.";
        return res.status(409).send({ message, fieldErrors: { email: message } });
      }
      return res.status(409).send({ message: "Could not create an account with those details." });
    }
    return fail(res, "sign-up", err);
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body || {};
  // Do not impose the new password policy on existing credentials.
  const fieldErrors = {};
  if (typeof username !== "string" || !username.length || username.length > 1024) {
    fieldErrors.username = "Enter your username (up to 1024 characters).";
  }
  if (typeof password !== "string" || !password.length || password.length > 1024) {
    fieldErrors.password = "Enter your password (up to 1024 characters).";
  }
  if (Object.keys(fieldErrors).length) {
    return res.status(400).send({ message: "Please correct the highlighted fields.", fieldErrors });
  }

  try {
    const user = await User.findOne({ username });
    const matches = await bcrypt.compare(password, user?.password || dummyHash);
    if (!user || !matches) return res.status(401).send(invalidCredentials);

    res.cookie("token", signSession(user), {
      ...cookieOptions(),
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).send({ user: { _id: user._id, username: user.username } });
  } catch (err) {
    return fail(res, "login", err);
  }
};

const verifyUser = (req, res) =>
  res.status(200).send({ _id: req.user.id, username: req.user.username });

const logoutUser = (req, res) => {
  res.clearCookie("token", cookieOptions());
  return res.status(200).send({ message: "Logged out successfully" });
};

const sendResetLink = async (user) => {
  const secret = crypto.randomBytes(32).toString("hex");
  const resetUrl = new URL(
    `/reset_password/${user._id}.${secret}`,
    process.env.CLIENT_URL || process.env.APP_URL || "http://localhost:3000",
  );
  const result = await User.updateOne({ _id: user._id }, {
    $set: {
      passwordResetDigest: digest(secret),
      passwordResetExpiresAt: new Date(Date.now() + resetLifetime),
    },
  });
  if (!result.matchedCount) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Reset your MovieBag password",
    text: `Reset your password: ${resetUrl}\n\nThis link expires in 10 minutes and can be used once. If you did not request it, ignore this email.`,
  });
};

const forgotPassword = async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  if (!isEmail(email)) {
    return res.status(400).send({ message: "Enter a valid email address." });
  }

  try {
    const user = await User.findOne({ email }, "email");
    // Keep mail delivery time and failures out of the public recovery response.
    if (user) {
      sendResetLink(user).catch((err) => {
        console.error("Auth reset email failed:", err.code || err.name);
      });
    }
    return res.status(200).send(recoveryResponse);
  } catch (err) {
    return fail(res, "recovery", err);
  }
};

const resetPassword = async (req, res) => {
  const token = resetPattern.exec(req.params.token);
  if (!token) return res.status(400).send(invalidReset);
  const { newPassword } = req.body || {};
  if (!isNewPassword(newPassword, resetPasswordMinimum)) {
    return res.status(400).send({ message: passwordPolicyMessage(resetPasswordMinimum) });
  }

  const filter = () => ({
    _id: token[1],
    passwordResetDigest: digest(token[2]),
    passwordResetExpiresAt: { $gt: new Date() },
  });
  try {
    if (!(await User.exists(filter()))) return res.status(400).send(invalidReset);
    const password = await bcrypt.hash(newPassword, bcryptCost);
    const result = await User.updateOne(filter(), {
      $set: { password },
      $unset: { passwordResetDigest: "", passwordResetExpiresAt: "" },
      $inc: { sessionVersion: 1 },
    });
    if (!result.modifiedCount) return res.status(400).send(invalidReset);

    return res.status(200).send({ message: "Password updated. Log in with your new password." });
  } catch (err) {
    return fail(res, "password reset", err);
  }
};

module.exports = { signupUser, loginUser, verifyUser, logoutUser, forgotPassword, resetPassword };
