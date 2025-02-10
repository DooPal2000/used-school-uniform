const mongoose = require('mongoose');

const reservationItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  size: {
    type: String,
    required: true
  }
});

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [reservationItemSchema],
  status: {
    type: String,
    enum: ['대기중', '승인됨', '취소됨'],
    default: '대기중'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
