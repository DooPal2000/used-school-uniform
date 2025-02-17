const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['교복상의', '교복하의', '교복마의', '생활복상의', '생활복하의'], // 카테고리 종류를 명시적으로 제한
    required: true
  },
  sizes: [
    {
      size: {
        type: String, // 예: 'S', 'M', 'L'
        enum: ['S', 'M', 'L', 'XL', 'XXL'], // 카테고리 종류를 명시적으로 제한
        required: true
      },
      quantity: {
        type: Number, // 해당 사이즈의 재고 수량
        required: true,
        min: 0 // 재고는 음수가 될 수 없음
      }
    }
  ],
  price: {
    type: Number,
    required: true,
    min: 0 // 가격은 음수가 될 수 없음
  },
  description: {
    type: String, // 상품 설명 (선택적)
    default: ''
  },
  imageUrl: {
    type: String, // 상품 이미지 URL (선택적)
    default: ''
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;