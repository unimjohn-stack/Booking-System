import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getMyCustomer, getMyCustomers } from '../controllers/bookingController.js';

const router = express.Router();

router.get("/", protectRoute, getMyCustomers);
router.get("/", protectRoute, getMyCustomer);

export default router;