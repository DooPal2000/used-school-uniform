const axios = require("axios");

async function refreshAccessToken(refreshToken) {
    try {
        const response = await axios.post("https://oauth2.googleapis.com/token", null, {
            params: {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                refresh_token: refreshToken,
                grant_type: "refresh_token"
            }
        });

        return response.data.access_token; // ✅ 새 Access Token 반환
    } catch (error) {
        console.error("❌ Refresh Token을 사용한 Access Token 갱신 실패:", error);
        return null;
    }
}

module.exports = refreshAccessToken;
