import express from 'express';
import {protectRoute} from '../middleware/protectRoute.js';
import { cancelBooking, completeBooking, confirmBooking, createBooking, getMyBooking, getMyBookings, getMyBusinessBooking, getMyBusinessBookings, updateBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.post("/", createBooking);
router.get("/my", getMyBookings);
router.get("/my/:id", getMyBooking);
router.patch("/my/update/:id", updateBooking);
router.patch("/my/cancel/:id", cancelBooking);

router.get("/business", protectRoute, getMyBusinessBookings);
router.get("/business/:id", protectRoute, getMyBusinessBooking);
router.patch("/business/:id/confirm", protectRoute, confirmBooking);
router.patch("/business/:id/complete", protectRoute, completeBooking);

export default router;