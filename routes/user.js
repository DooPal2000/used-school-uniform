const express = require('express');
const router = express.Router();
const passport = require('passport');

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isSecureAdminCreation, isAuthorized, isRealPhone } = require('../middleware');
const userController = require('../controllers/userController');


router.get('/register', userController.renderRegister);
router.get('/register/admin', userController.renderRegisterAdmin);

router.post('/register', isRealPhone, catchAsync(userController.register));
router.post('/register/admin', isSecureAdminCreation, catchAsync(userController.registerAdmin));

// PASSPORT 보안 강화로 인해 로그인 시 세션 초기화, 아래 코드 사용 
// 이렇게 수정하면, 최신 버전의 Passport.js를 사용해도 애플리케이션에서 사용자가 로그인 페이지 전에 방문 중이던 페이지로 정확하게 리디렉션됩니다.
router.get('/login', userController.renderLogin);

// router.post('/login',
//     // passport.authenticate logs the user in and clears req.session
//     passport.authenticate('local', { failureFlash: false, failureRedirect: '/err' }),

//     // Now we can use res.locals.returnTo to redirect the user after login
//     users.login);

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // 로그인 실패 시 플래시 메시지 설정
            req.flash('error', info.message || '로그인 실패');
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }

            if (user.role === 'admin') {
                return res.redirect('/admin');
            } else {
                return res.redirect('/products');
            }

            // 로그인 성공 시 리다이렉트
            return res.redirect(res.locals.returnTo || '/');
        });
    })(req, res, next);
});

router.get('/logout', userController.logout);

module.exports = router;