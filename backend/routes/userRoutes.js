import express from 'express';
import { getUserById, updateUser, deleteUsers, authUser, getUserProfile, registerUser, updateUserProfile, getUsers } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

//this request has 2 middlewares as first it needs to get the req.user defined in the protect middleware and then it needs to check in req.user.isAdmin in the admin middleware
router.get('/', protect, admin, getUsers);

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

//these requests has 2 middlewares as first it needs to get the req.user defined in the protect middleware and then it needs to check in req.user.isAdmin in the admin middleware
router.delete('/:id', protect, admin, deleteUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUser);


export default router;