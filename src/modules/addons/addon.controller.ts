import type { Request, Response, NextFunction } from 'express';
import { AddonService } from './addon.service.js';

export const AddonController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            /**
            * Request payload is forwarded directly to the service
            * which handles validation and persistence rules.
            */
            const result = await AddonService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },
    
    async listByItem(req: Request, res: Response, next: NextFunction) {
        try {
            /**
            * itemId is sourced from the URL. Defensive narrowing avoids
            * cases where it could be an array due to Express param parsing.
            */
            const itemId = req.params.itemId;
            if (typeof itemId !== 'string') {
                return res.status(400).json({ error: 'Invalid or missing itemId parameter' });
            }
            
            const result = await AddonService.listByItem(itemId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
    
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const idParam = req.params.id;
            if (typeof idParam !== 'string') {
                return res.status(400).json({ error: 'Invalid or missing id parameter' });
            }
            const result = await AddonService.update(idParam, req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
    
    async softDelete(req: Request, res: Response, next: NextFunction) {
        try {
            const idParam = req.params.id;
            if (typeof idParam !== 'string') {
                return res.status(400).json({ error: 'Invalid or missing id parameter' });
            }
            
            const result = await AddonService.softDelete(idParam);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
};
