const express = require('express')
const userController = require('../controllers/userController');
const { verifyToken } = require('../Middlewares/userAuth')

const router = express.Router()

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

router.get('/users', verifyToken, userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.get('/users/auth/google', userController.authGoogle)
router.get('/users/auth/google/callback', userController.callbackGoogle)
router.get('/protected', isLoggedIn, userController.protected)
router.get('/token', userController.refreshToken);
router.get('/users/auth/google/failure', userController.failed)
router.patch('/users/:id', userController.updateUser);
router.post('/users/register', userController.Register);
router.post('/users/verify', userController.verifyOTP);
router.post('/users/login', userController.Login);
router.delete('/users/logout', userController.Logout);
router.delete('/users/:id', userController.deleteUserById);

module.exports = router