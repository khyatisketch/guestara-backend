import { Router } from 'express';
import { CategoryController } from './category.controller.js';

const router = Router();

router.post('/', CategoryController.create);

router.get('/', CategoryController.list);

router.patch('/:id', CategoryController.update);

router.delete('/:id', CategoryController.softDelete);

export default router;
