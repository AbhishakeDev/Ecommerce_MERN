import express from 'express';
import { updateOrderToDelivered, getOrders, addOrderItems, getOrderById, updateOrderToPaid, getMyOrders } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, admin, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);



export default router;