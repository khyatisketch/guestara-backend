import type { Request, Response, NextFunction } from 'express';
import { PricingService } from './pricing.service.js';
import type { PricingContext } from './pricing.types.js';

export const PricingController = {
    async calculate(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (typeof id !== 'string') {
                throw new Error('Invalid item id');
            }
            
            const { time, durationHours, addons } = req.query;
            
            const context: PricingContext = {
                ...(typeof time === 'string' && { time }),
                ...(typeof durationHours === 'string' && {
                    durationHours: parseFloat(durationHours),
                }),
                ...(addons && {
                    addons: Array.isArray(addons)
                    ? addons.filter((v): v is string => typeof v === 'string')
                    : typeof addons === 'string'
                    ? [addons]
                    : [],
                }),
            };
            
            const result = await PricingService.calculate(id, context);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
};
