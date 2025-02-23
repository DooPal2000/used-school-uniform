require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("./config/passport");
const path = require("path");

const authRoutes = require("./routes/auth");
const tokenRoutes = require("./routes/token");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log("✅ MongoDB Atlas 연결 성공!"))
  .catch(err => console.error("❌ MongoDB 연결 실패:", err));

// ✅ EJS 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ JSON 요청 처리
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 세션 설정 (로그인 상태 유지)
app.use(session({
  secret: process.env.SESSION_SECRET || "your_secret_key", // ✅ 보안을 위해 환경변수 사용 추천
  resave: false, // 변경이 없으면 세션을 다시 저장하지 않음
  saveUninitialized: true, // 로그인하지 않은 사용자도 세션을 생성할지 여부
  cookie: { secure: false } // ✅ HTTPS 환경에서는 true, 로컬 개발에서는 false
}));

// ✅ Passport 초기화 및 세션 연동
app.use(passport.initialize());
app.use(passport.session());

// ✅ 정적 파일 제공 (CSS, JS 등)
app.use(express.static(path.join(__dirname, "public")));

// ✅ 라우터 연결
app.use("/auth", authRoutes);
app.use("/token", tokenRoutes);

// ✅ 기본 페이지 렌더링
app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
