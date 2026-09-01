import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { deactivateBusiness, getAllBusinesses, getMyBusiness, updateBusiness } from '../controllers/businessController.js';

const router = express.Router();

router.get('/', protectRoute, getAllBusinesses);
router.get('/my', protectRoute, getMyBusiness);
router.patch('/deactivate', protectRoute, deactivateBusiness);
router.patch('/:id', protectRoute, updateBusiness);

export default router;