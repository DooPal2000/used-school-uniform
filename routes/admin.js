const express = require('express');
const router = express.Router();
const passport = require('passport');

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isSecureAdminCreation, isAdmin } = require('../middleware');
const adminController = require('../controllers/adminController');


router.get('/', isAdmin, catchAsync(adminController.renderAdmin));

// 사용자 활성화 상태 토글
router.patch('/toggle-active/:userId', isAdmin, catchAsync(adminController.toggleUserActive));

// 사용자 삭제
router.delete('/delete-user/:userId', isAdmin, catchAsync(adminController.deleteUser));


module.exports = router;