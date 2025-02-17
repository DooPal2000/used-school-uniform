const Product = require('../models/product');
const ExpressError = require('../utils/ExpressError');

// 모든 상품 목록을 보여줍니다.
module.exports.index = async (req, res) => {
    const products = await Product.find();
    res.render('products/index', { products });
};

// 상품 등록 폼을 렌더링합니다.
module.exports.renderNewForm = (req, res) => {
    res.render('products/new');
};

// 새로운 상품을 생성합니다.
module.exports.createProduct = async (req, res) => {
    const product = new Product(req.body.product);
    await product.save();
    res.redirect('/products');
};

// 특정 상품의 상세 정보를 보여줍니다.
module.exports.showProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('products/edit', { product });
};

// 상품 수정 폼을 렌더링합니다.
module.exports.renderEditForm = async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('products/edit', { product });
};

// 상품 정보를 수정합니다.
module.exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
    await product.save();
    res.redirect('/products');
};

// 상품의 사이즈별 수량을 수정합니다.
module.exports.updateQuantity = async (req, res, next) => {
    const { id } = req.params;
    const { size, quantity } = req.body;

    // 유효성 검사
    if (typeof quantity !== 'number' || quantity < 0 || !Number.isInteger(quantity)) {
        throw new ExpressError('수량은 0 이상의 정수여야 합니다.', 400);
    }

    const product = await Product.findById(id);
    if (!product) {
        throw new ExpressError('상품을 찾을 수 없습니다.', 404);
    }

    // 사이즈별 수량 업데이트
    const sizeData = product.sizes.find(s => s.size === size);
    if (sizeData) {
        sizeData.quantity = quantity;
    } else {
        throw new ExpressError('해당 사이즈가 존재하지 않습니다.', 404);
    }

    await product.save();
    res.json({ success: true, quantity: sizeData.quantity });
};

// 상품을 삭제합니다.
module.exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
};
