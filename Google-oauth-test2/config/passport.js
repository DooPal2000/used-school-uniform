const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_SIGNUP_REDIRECT_URI,
    accessType: "offline",
    prompt: "consent"
  },
  async (accessToken, refreshToken, profile, done) => {
    return done(null, profile); // ✅ DB 저장하지 않고 profile만 넘겨줌
  }
));

// ✅ 세션에 사용자 정보 저장
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// ✅ 요청마다 사용자 정보 복구
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
