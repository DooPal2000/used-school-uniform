const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');

module.exports.renderAdmin = async (req, res) => {
    const users = await User.find({ role: 'user' }).select('-password'); // user role만 담고 password 제외
    // const users = await User.find({ role: 'user' }).select('-password'); // user role만 담고 password 제외

    res.render('admin/admin', { users: users, });
};

module.exports.toggleUserActive = async (req, res) => {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(userId);
    console.log('Before update:', user.isActive);

    user.isActive = !user.isActive;
    await user.save();

    console.log('After update:', user.isActive);

    const updatedUser = await User.findById(userId);
    console.log('Final state:', updatedUser.isActive);


    res.json({ success: true, isActive: user.isActive });
}

module.exports.deleteUser = async (req, res) => {
    const { userId } = req.params;

    await User.findByIdAndDelete(userId);

    res.json({ success: true });
}

// const User = require('../models/user'); // 사용자 모델 import
// const ExpressError = require('../utils/ExpressError');


// module.exports = {
//     // 관리자 페이지 렌더링
//     renderAdmin: async (req, res) => {
//         const users = await User.find({});
//         res.render('admin/dashboard', { users });
//     },

//     // 사용자 활성화 상태 토글
//     toggleUserActive: async (req, res) => {
//         const { userId } = req.params;
//         const { isActive } = req.body;

//         await User.findByIdAndUpdate(userId, { isActive });

//         res.json({ success: true });
//     },

//     // 사용자 삭제
//     deleteUser: async (req, res) => {
//         const { userId } = req.params;

//         await User.findByIdAndDelete(userId);

//         res.json({ success: true });
//     }
// };
