import Product from '../models/productModel.js';
import AsyncHandler from 'express-async-handler';


export const getProducts = AsyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1

    ///regex is for that case so that even if the user types iph , iphone should appear as iph is not a product but still is starting with it and then in options i means caase insensitive
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {};

    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

export const getProductById = AsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        res.json(product);
    } else {
        res.status(404)
        throw new Error('Product not found');
    }
})

//delete a product
// delete /api/products/:id
//private /admin
export const deleteProduct = AsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        await product.remove();
        res.json({ message: 'Product removed successfully' });
    } else {
        res.status(404)
        throw new Error('Product not found');
    }
})

//create a product
// post /api/products
//private /admin
export const createProduct = AsyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: './images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
})

//update a product
// put /api/products/:id
//private /admin
export const updateProduct = AsyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);
    if (product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})


//create a new review
// POST /api/products/:id/reviews
//private 
export const createProductReview = AsyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);
    if (product) {
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())
        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Product already reviewed')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.push(review)
        product.numReviews = product.reviews.length;

        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

        await product.save();
        res.status(201).json({ message: 'Review Added' });
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})



//get top rated products
// GET /api/products/top
// public 
export const getTopProducts = AsyncHandler(async (req, res) => {
    //rating by -1 means descending order , top rated first
    const products = await Product.find({}).sort({ rating: -1 }).limit(3)

    res.json(products)
})