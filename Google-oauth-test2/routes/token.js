const express = require("express");
const tokenController = require("../controllers/tokenController");

const router = express.Router();

// ✅ Access Token 갱신 요청
router.get("/refresh", tokenController.refreshAccessToken);

module.exports = router;
