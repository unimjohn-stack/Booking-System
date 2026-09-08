import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createAvailability, getMyAvailability, updateAvailability } from '../controllers/availabilityController.js';

const router = express.Router();

router.post("/", protectRoute, createAvailability);
router.get("/", protectRoute, getMyAvailability);
router.patch("/:id", protectRoute, updateAvailability);

export default router;