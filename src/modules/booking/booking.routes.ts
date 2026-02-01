import { Router } from 'express';
import { BookingController } from './booking.controller.js';

const router = Router();

router.post('/', BookingController.create);

export default router;
