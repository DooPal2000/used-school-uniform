const User = require("../models/User");

module.exports.googleCallback = async (req, res) => {
    try {
        console.log("🔑 Google User Profile:", req.user); // 디버깅용
        const { id: googleId, displayName: name, emails } = req.user;
        const email = emails[0].value;

        // ✅ DB에서 사용자가 존재하는지 확인
        let user = await User.findOne({ googleId });

        if (!user) {
            // ✅ 새 사용자면 자동 회원가입 (DB에 저장)
            user = new User({ googleId, name, email });
            console.log(`-------------------------------------------email : ${email}`)

            await user.save();
            console.log("✅ 새 Google 사용자 회원가입 완료:", user);
        } else {
            console.log("✅ 기존 Google 사용자 로그인:", user);
        }

        // ✅ 로그인 후 세션에 사용자 정보 저장
        req.login(user, (err) => {
            if (err) {
                console.error("❌ 세션 저장 중 오류 발생:", err);
                return res.status(500).send("로그인 세션 저장 중 오류 발생");
            }
            res.redirect("/"); // 로그인 성공 후 홈으로 이동
        });

    } catch (error) {
        console.error("❌ Google 로그인 처리 중 오류:", error);
        res.status(500).json({ message: "로그인 처리 중 오류 발생", error });
    }
};

// ✅ 로그아웃 기능
module.exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("❌ 로그아웃 오류:", err);
            return res.status(500).send("로그아웃 처리 중 오류 발생");
        }
        req.session.destroy(() => {
            res.redirect("/");
        });
    });
};
