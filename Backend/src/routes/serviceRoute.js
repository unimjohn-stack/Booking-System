import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createService, deactivateService, getMyService, getMyServices, getService, getServices, updateService } from '../controllers/serviceController.js';

const router = express.Router;

router.post('/', protectRoute, createService);
router.get('/', protectRoute, getMyServices);
router.get('/:id', protectRoute, getMyService);
router.patch('/:id', protectRoute, updateService);
router.patch('/:id', protectRoute, deactivateService);

router.get('/:id', getService);
router.get('/', getServices)

export default router;