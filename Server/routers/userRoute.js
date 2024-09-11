const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/signup", userController.signupUser);
router.post("/login", userController.loginUser);
router.post("/verify", userController.verifyUser);
router.post("/forgot_password", userController.forgotPassword);
router.post("/reset_password/:token", userController.resetPassword);
// router.get("/generate_otp", userController.generateOtp);
// router.post("/verify_otp", userController.verifyOtp);

module.exports = router;
