import Order from '../models/orderModel.js';
import AsyncHandler from 'express-async-handler';

//  create new orderModel
// route POST /api/orders
//  private route
export const addOrderItems = AsyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('no order items')
        return
    } else {
        const order = new Order({
            orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice, user: req.user._id
        })

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
})




//  Get order by id
// route GET /api/orders/:id
//  private route
export const getOrderById = AsyncHandler(async (req, res) => {
    const id = req.params.id;
    const order = await Order.findById(id).populate('user', 'name email');

    if (order) {
        res.json(order)
    } else {
        res.status(404)
        throw new Error('Order not found');
    }

})

// update order to paid
// GET /api/orders/:id/pay
// private
export const updateOrderToPaid = AsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        }

        const updatedOrder = await order.save()
        console.log("Successfully updated");
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})



// get logged in user order
// GET /api/orders/myorders
// private
export const getMyOrders = AsyncHandler(async (req, res) => {
    // console.log(req.user._id);
    const orders = await Order.find({ user: req.user._id })
    res.json(orders);
})



// get all orders
// GET /api/orders/
// private/admin
export const getOrders = AsyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
})


// update order to delivered
// GET /api/orders/:id/deliver
// private/admin
export const updateOrderToDelivered = AsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()

        const updatedOrder = await order.save()
        console.log("Successfully updated");
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})