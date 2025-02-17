const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isAdmin } = require('../middleware');
const productController = require('../controllers/productController');

// 모든 라우터에 isAdmin 미들웨어 적용
router.use(isAdmin);

router.get('/', catchAsync(productController.index));
router.get('/new', catchAsync(productController.renderNewForm));
router.post('/', catchAsync(productController.createProduct));
router.get('/:id', catchAsync(productController.showProduct));
router.get('/:id/edit', catchAsync(productController.renderEditForm));
router.put('/:id', catchAsync(productController.updateProduct));
router.patch('/:id/quantity', catchAsync(productController.updateQuantity));
router.delete('/:id', catchAsync(productController.deleteProduct));

module.exports = router;
