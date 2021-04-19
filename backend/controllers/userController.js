import User from '../models/userModel.js';
import AsyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';

//get logged in user and sign a token for him/her
export const authUser = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // res.json({ email, password });
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(401);
        throw new Error('Invalids Credentials')
    }
})


//private route
export const getUserProfile = AsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    }
    else {
        res.status(404)
        throw new Error('User not found');
    }
})

//update userprofile


//private route
export const updateUserProfile = AsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })
    }
    else {
        res.status(404)
        throw new Error('User not found');
    }
})



//sign up a user /api/users
export const registerUser = AsyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    // res.json({ email, password });
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400)
        throw new Error('User already Exists')
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(400)
        throw new Error('User not found')
    }
})




//get all users
//GET api/users
// private
export const getUsers = AsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users)
})


//delete all users
//DELETE api/users/:id
// private
export const deleteUsers = AsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await user.remove();
        res.json({ message: 'User removed successfully' });
    } else {
        res.status(404)
        throw new Error('user not found')
    }
})


//get user by id
//GET api/users/:id
// private
export const getUserById = AsyncHandler(async (req, res) => {
    const user = await (await User.findById(req.params.id).select('-password'));
    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
    res.json(users)
})



//update user by admin
//put api/users/:id
//private
export const updateUser = AsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.isAdmin) {
            user.isAdmin = req.body.isAdmin
        }
        else {
            user.isAdmin = false
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    }
    else {
        res.status(404)
        throw new Error('User not found');
    }
})