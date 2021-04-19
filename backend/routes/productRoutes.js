import express from 'express';
import { getTopProducts, createProductReview, getProducts, getProductById, deleteProduct, updateProduct, createProduct } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

//@desc fetch all products
//@route GET /api/products
//@access Public
router.get('/', getProducts)
router.get('/top', getTopProducts)

router.post('/', protect, admin, createProduct);
router.post('/:id/reviews', protect, createProductReview);

//@desc fetch single products
//@route GET /api/products/:id
//@access Public
router.get('/:id', getProductById)
router.delete('/:id', protect, admin, deleteProduct);
router.put('/:id', protect, admin, updateProduct);


export default router;