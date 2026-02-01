import type { Request, Response, NextFunction } from 'express';
import { BookingService } from './booking.service.js';
import type { CreateBookingDTO } from './booking.types.js';
import { ApiError } from '../../core/errors/ApiError.js';

export const BookingController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = req.body as CreateBookingDTO;
            if (!payload?.item_id) {
                throw new ApiError('item_id is required', 400);
            }
            
            const booking = await BookingService.create(payload);
            res.status(201).json(booking);
        } catch (error) {
            next(error);
        }
    },
};
