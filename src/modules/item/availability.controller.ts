import type { Request, Response, NextFunction } from 'express';
import { AvailabilityService } from './availability.service.js';
import { ApiError } from '../../core/errors/ApiError.js';

export const AvailabilityController = {
    async getAvailableSlots(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            
            /**
            * Param narrowing is required because Express params
            * can be string | string[] | undefined under strict typing.
            */
            if (typeof id !== 'string') {
                throw new ApiError('Invalid item id', 400);
            }
            
            const { date } = req.query;
            
            /**
            * Availability lookup requires an explicit date input.
            */
            if (typeof date !== 'string' || date.length === 0) {
                throw new ApiError(
                    'date query param required (YYYY-MM-DD)',
                    400
                );
            }
            
            const result = await AvailabilityService.getAvailableSlots(id, date);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
};
