const router = require("express").Router();
const { rateLimit } = require("express-rate-limit");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

const limit = (limit) => rateLimit({
  windowMs: 15 * 60 * 1000,
  limit,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." },
});

router.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

router.post("/signup", limit(10), userController.signupUser);
router.post("/login", limit(20), userController.loginUser);
router.post("/logout", userController.logoutUser);
router.get("/verify", auth, userController.verifyUser);
router.post("/forgot_password", limit(5), userController.forgotPassword);
router.post("/reset_password/:token", limit(10), userController.resetPassword);

module.exports = router;
