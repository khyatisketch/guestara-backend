import { Router } from 'express';
import { AvailabilityController } from './availability.controller.js';
import { ItemController } from './item.controller.js';
import { PricingController } from './pricing.controller.js';
import { SearchController } from './search.controller.js';

const router = Router();

router.post('/', ItemController.create);
router.get('/', ItemController.list);
router.patch('/:id', ItemController.update);
router.delete('/:id', ItemController.softDelete);

router.get('/search', SearchController.search);

router.get('/:id/price', PricingController.calculate);
router.get('/:id/availability', AvailabilityController.getAvailableSlots);

export default router;
