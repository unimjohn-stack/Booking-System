import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { deactivateBusiness, getAllBusinesses, getMyBusiness, updateBusiness } from '../controllers/businessController.js';

const router = express.Router();

router.get('/', protectRoute, getAllBusinesses);
router.get('/:id', protectRoute, getMyBusiness);
router.patch('/:id', protectRoute, updateBusiness);
router.patch('/:id', protectRoute, deactivateBusiness);

export default router;