const User = require("../models/User");
const refreshAccessToken = require("../utils/refreshToken");

module.exports.refreshAccessToken = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "로그인이 필요합니다." });
        }

        let user = await User.findOne({ googleId: req.user.googleId });

        if (!user || !user.refreshToken) {
            return res.status(403).json({ message: "Refresh Token이 없습니다. 다시 로그인하세요." });
        }

        // ✅ Refresh Token을 사용하여 새 Access Token 요청
        const newAccessToken = await refreshAccessToken(user.refreshToken);

        if (!newAccessToken) {
            return res.status(403).json({ message: "새 Access Token을 가져올 수 없습니다. 다시 로그인하세요." });
        }

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error("❌ Access Token 갱신 중 오류 발생:", error);
        res.status(500).json({ message: "서버 오류 발생", error });
    }
};
