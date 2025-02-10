const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user.js');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const { connectToDatabase } = require('./database');
const config = require('./config');




const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products.js');


// 데이터베이스 연결
connectToDatabase();

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("Connected to database!");
//   })
//   .catch((e) => {
//     console.log("Connection failed!");
//     console.error("Connection failed:", e);
//   });

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(mongoSanitize({
  replaceWith: '_'
}));

const sessionConfig = {
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3
  }
}
app.use(session(sessionConfig));
app.use(flash());

// app.use(
//   helmet({
//     hsts: false,
//     contentSecurityPolicy: {
//       directives: {
//         "default-src": ["'self'"],
//         "script-src": ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
//         "style-src": ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
//         "img-src": ["'self'", "https://images.unsplash.com", "data:"],
//       },
//     },
//   })
// );

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "script-src": [
          "'self'", 
          "https://cdn.jsdelivr.net", 
          "https://cdnjs.cloudflare.com", 
          "'unsafe-inline'"
        ],
        "style-src": ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        "img-src": ["'self'", "https://images.unsplash.com", "data:"],
      },
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  usernameField: 'phonenum'  // 'phonenum'을 사용자 식별자로 지정
}, User.authenticate()));

// 이 줄은 제거해야 합니다. 위의 설정으로 대체됩니다.
// passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
  console.log("req.user:", req.user); // 디버깅 로그 추가
  res.locals.currentUser = req.user || null; // req.user가 없으면 null로 설정;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', userRoutes);
app.use('/admin', adminRoutes);
app.use('/products', productRoutes);


app.get('/', (req, res) => {
  res.render('home');
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
});

app.listen(3000, () => {
  console.log('Serving on port 3000')
});