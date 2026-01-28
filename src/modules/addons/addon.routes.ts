import { Router } from 'express';
import { AddonController } from './addon.controller.js';

const router = Router();

router.post('/', AddonController.create);
router.get('/item/:itemId', AddonController.listByItem);
router.patch('/:id', AddonController.update);
router.delete('/:id', AddonController.softDelete);

export default router;
