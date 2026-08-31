import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { checkAuth, loginUser, logoutUser, registerUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login',  loginUser);
router.get('/check', protectRoute, checkAuth);
router.post('/logout', logoutUser);

export default router;