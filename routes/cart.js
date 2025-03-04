const express = require('express');
const router = express.Router();
const passport = require('passport');

const catchAsync = require('../utils/catchAsync');
const { isAuthorized, isLoggedIn } = require('../middleware');
const cartController = require('../controllers/cartController');

router.post('/add', isLoggedIn, catchAsync(cartController.addToCart));
router.get('/', isLoggedIn, catchAsync(cartController.getCart));




// router.route('/')
//     .get(isAuthorized, catchAsync(cartController.index))
//     .post(isAuthorized, catchAsync(cartController.createProduct));

// router.get('/new', isAuthorized, products.renderNewForm);

// router.route('/:id')
//     .get(isAuthorized, catchAsync(products.showProduct))
//     .put(isAuthorized, catchAsync(products.updateProduct))
//     .delete(isAuthorized, catchAsync(products.deleteProduct));

// router.get('/:id/edit', isAuthorized, catchAsync(products.renderEditForm));

// router.post('/:id/update-quantity', isAuthorized, catchAsync(products.updateQuantity));



module.exports = router;