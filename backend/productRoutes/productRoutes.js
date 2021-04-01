import express from 'express';
import Product from '../models/productModel.js';
import AsyncHandler from 'express-async-handler';;

const router = express.Router();

//@desc fetch all products
//@route GET /api/products
//@access Public
router.get('/', AsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products)
}))


//@desc fetch single products
//@route GET /api/products/:id
//@access Public
router.get('/:id', AsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' })
    }
}))



export default router;