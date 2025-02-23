const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true }, // Google OAuth 고유 ID
    name: { type: String, required: true }, // 이름 저장
    email: { type: String, required: true, unique: true }, // 이메일 저장
    createdAt: { type: Date, default: Date.now } // 생성 시간
});

const User = mongoose.model("User", userSchema);
module.exports = User;
