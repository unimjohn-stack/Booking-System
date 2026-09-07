import express from 'express';
import {protectRoute} from '../middleware/protectRoute.js';
import { cancelBooking, completeBooking, confirmBooking, createBooking, getMyBooking, getMyBookings, getMyBusinessBooking, getMyBusinessBookings, updateBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.post("/", createBooking);
router.get("/my?phone", getMyBookings);
router.get("/my/:id?phone=", getMyBooking)
router.patch("/my/update/:id?phone=", updateBooking);
router.patch("/my/cancel/:id?phone=", cancelBooking);

router.get("/business", protectRoute, getMyBusinessBookings);
router.get("/business/:id", protectRoute, getMyBusinessBooking);
router.patch("/business/confirm/:id", protectRoute, confirmBooking);
router.patch("/business/complete/:id", protectRoute, completeBooking);

export default router;