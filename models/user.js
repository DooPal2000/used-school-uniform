const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// const userSchema = new Schema({
//     phonenum: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     role: {
//         type: String,
//         enum: ['user', 'admin'],
//         default: 'user'
//     },
//     isActive: {
//         type: Boolean,
//         default: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
// });
// userSchema.plugin(passportLocalMongoose, {usernameField: 'phonenum' });
// module.exports = mongoose.model("User", userSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
