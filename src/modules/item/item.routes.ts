import { Router } from 'express';
import { ItemController } from './item.controller.js';

const router = Router();

router.post('/', ItemController.create);
router.get('/', ItemController.list);
router.patch('/:id', ItemController.update);
router.delete('/:id', ItemController.softDelete);

export default router;
