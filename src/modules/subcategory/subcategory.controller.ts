import type { Request, Response, NextFunction } from 'express';
import { SubcategoryService } from './subcategory.service.js';

export const SubcategoryController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await SubcategoryService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },
    
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            
            const result = await SubcategoryService.list(page, limit);
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
            
            const result = await SubcategoryService.update(idParam, req.body);
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
            
            const result = await SubcategoryService.softDelete(idParam);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
};
