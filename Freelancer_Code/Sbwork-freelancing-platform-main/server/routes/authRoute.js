const express = require("express");
const { register, login, verifyOtp, getFreelancers } = require("../controllers/authcontroller");

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.get("/freelancers", getFreelancers);


module.exports = router;
