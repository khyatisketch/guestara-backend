import { Router } from 'express';
import { SubcategoryController } from './subcategory.controller.js';

const router = Router();

router.post('/', SubcategoryController.create);
router.get('/', SubcategoryController.list);
router.patch('/:id', SubcategoryController.update);
router.delete('/:id', SubcategoryController.softDelete);

export default router;
