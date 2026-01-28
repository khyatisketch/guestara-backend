import type { Request, Response, NextFunction } from 'express';
import { ItemService } from './item.service.js';

export const ItemController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            /**
            * Request body is delegated to the service layer, which handles
            * domain validation and persistence rules.
            */
            const result = await ItemService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },
    
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            /**
            * Pagination params are optional and default to sensible values.
            * Type coercion is done here, not in the service layer.
            */
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            
            const result = await ItemService.list(page, limit);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
    
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            /**
            * Params come from the router. Defensive type-narrowing prevents
            * issues when query params are arrays (which Express can allow).
            */
            const idParam = req.params.id;
            if (typeof idParam !== 'string') {
                return res.status(400).json({ error: 'Invalid or missing id parameter' });
            }
            
            const result = await ItemService.update(idParam, req.body);
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
            
            const result = await ItemService.softDelete(idParam);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
};
