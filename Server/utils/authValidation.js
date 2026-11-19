const isEmail = (email) =>
  typeof email === "string" &&
  email.length <= 254 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

const isUsername = (username) =>
  typeof username === "string" && username.trim().length > 0 && username.length <= 256;

const signupPasswordMinimum = 5;
const resetPasswordMinimum = 15;

const passwordPolicyMessage = (minimum) =>
  `Use at least ${minimum} characters and no more than 72 UTF-8 bytes for your password.`;

const isNewPassword = (password, minimum) =>
  typeof password === "string" &&
  password.length <= 72 &&
  Buffer.byteLength(password, "utf8") <= 72 &&
  [...password].length >= minimum;

module.exports = {
  isEmail, normalizeEmail, isUsername, isNewPassword, passwordPolicyMessage,
  signupPasswordMinimum, resetPasswordMinimum,
};
