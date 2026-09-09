import express from 'express';
// import { protectRoute } from '../middleware/protectRoute.js';
import { getAvailableSlots } from '../controllers/availableSlotController.js';

const router = express.Router();

router.get("/", getAvailableSlots);

export default router;