import type { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category.service.js';

export const CategoryController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await CategoryService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },
    
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const result = await CategoryService.list(page, limit);
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
            
            const result = await CategoryService.update(idParam, req.body);
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
            
            const result = await CategoryService.softDelete(idParam);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
};
