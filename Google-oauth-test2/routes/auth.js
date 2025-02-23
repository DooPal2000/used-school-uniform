const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");

const router = express.Router();

// ✅ Google 로그인 요청 (최소한의 정보만 요청)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// ✅ Google 로그인 콜백
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), authController.googleCallback);

// ✅ 로그아웃
router.get("/logout", authController.logoutUser);


module.exports = router;
