const Product = require('../models/product');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');

const Cart = require('../models/cart');
const Product = require('../models/product');


module.exports.addToCart = async (req, res) => {
    /*
    * addToCart 함수:
    * - 기존 카트의 아이템을 유지하면서 새로운 아이템을 추가합니다.
    * - 동일한 상품 ID와 사이즈를 가진 아이템이 이미 카트에 있는 경우, 해당 아이템의 수량을 증가시킵니다.
    * - 동일한 아이템이 없는 경우, 새로운 아이템을 카트에 추가합니다.
    */
    const userId = req.user._id;
    const { items, quantities } = req.body;

    if (!items || items.length === 0) {
        throw new ExpressError('선택된 상품이 없습니다.', 400);
    }

    let cart = await Cart.findOne({ user: userId }) || new Cart({ user: userId, items: [] });

    for (let i = 0; i < items.length; i++) {
        const [productId, size] = items[i].split('_');
        const quantity = parseInt(quantities[i]);

        if (isNaN(quantity) || quantity < 1) {
            throw new ExpressError('유효하지 않은 수량입니다.', 400);
        }

        const product = await Product.findById(productId);
        if (!product) {
            throw new ExpressError('상품을 찾을 수 없습니다.', 404);
        }

        const sizeData = product.sizes.find(s => s.size === size);
        if (!sizeData || quantity > sizeData.quantity) {
            throw new ExpressError(`재고가 부족합니다: ${product.name} (${size})`, 400);
        }

        const existingItem = cart.items.find(item =>
            item.product.toString() === productId && item.size === size
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, size, quantity });
        }
    }

    await cart.save();
    res.redirect('/cart');
};




module.exports.initAddToCart = async (req, res) => {
    /*
     * initAddToCart 함수:
     * - 카트를 초기화하여 기존의 모든 아이템을 제거한 후, 새로운 아이템만 추가합니다.
     * - 현재 요청에서 지정한 아이템만 카트에 남기고, 이전에 추가된 모든 아이템을 제거합니다.
     */

    const userId = req.user._id;
    const { items, quantities } = req.body;

    if (!items || items.length === 0) {
        throw new ExpressError('선택된 상품이 없습니다.', 400);
    }

    let cart = await Cart.findOne({ user: userId }) || new Cart({ user: userId, items: [] });

    // 기존 카트 아이템 초기화
    cart.items = [];

    for (let i = 0; i < items.length; i++) {
        const [productId, size] = items[i].split('_');
        const quantity = parseInt(quantities[i]);

        if (isNaN(quantity) || quantity < 1) {
            throw new ExpressError('유효하지 않은 수량입니다.', 400);
        }

        const product = await Product.findById(productId);
        if (!product) {
            throw new ExpressError('상품을 찾을 수 없습니다.', 404);
        }

        const sizeData = product.sizes.find(s => s.size === size);
        if (!sizeData || quantity > sizeData.quantity) {
            throw new ExpressError(`재고가 부족합니다: ${product.name} (${size})`, 400);
        }

        cart.items.push({ product: productId, size, quantity });
    }

    await cart.save();
    res.redirect('/cart');
};




module.exports.index = async (req, res) => {
    const products = await Product.find({ createdBy: req.user._id });
    res.render('products/index', { products });
};

module.exports.renderNewForm = (req, res) => {
    res.render('products/new');
};

module.exports.createProduct = async (req, res) => {
    const product = new Product(req.body.product);
    product.createdBy = req.user._id;
    await product.save();

    res.redirect('/products');
};

module.exports.showProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('products/edit', { product });
};

module.exports.renderEditForm = async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('products/edit', { product });
};

module.exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });

    // 저장한 후 createdBy가 req.user._id인 모든 product를 가져옴
    const products = await Product.find({ createdBy: req.user._id });

    res.redirect('/products');
};


module.exports.updateQuantity = async (req, res, next) => {
    const { id } = req.params;
    const { quantity } = req.body;

    // 유효성 검사
    if (typeof quantity !== 'number' || quantity < 0 || !Number.isInteger(quantity)) {
        throw new ExpressError('수량은 0 이상의 정수여야 합니다.', 400);
    }

    const product = await Product.findById(id);
    if (!product) {
        throw new ExpressError('상품을 찾을 수 없습니다.', 404);
    }

    product.quantity = quantity;
    await product.save();

    res.json({ success: true, quantity: product.quantity });
};


module.exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
};

