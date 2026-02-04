import type { Request, Response, NextFunction } from 'express';
import { SearchService } from './search.service.js';
import type { SearchQueryDTO } from './search.types.js';

export const SearchController = {
    async search(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                q,
                category,
                subcategory,
                minPrice,
                maxPrice,
                time,
                durationHours,
                sort,
                page,
                limit,
            } = req.query;
            
            /**
            * Build query object incrementally to satisfy
            * exactOptionalPropertyTypes.
            */
            const query: Partial<SearchQueryDTO> = {
                ...(typeof q === 'string' && { q }),
                ...(typeof category === 'string' && { category }),
                ...(typeof subcategory === 'string' && { subcategory }),
                
                ...(typeof minPrice === 'string' && {
                    minPrice: Number(minPrice),
                }),
                ...(typeof maxPrice === 'string' && {
                    maxPrice: Number(maxPrice),
                }),
                
                ...(typeof time === 'string' && { time }),
                ...(typeof durationHours === 'string' && {
                    durationHours: Number(durationHours),
                }),
                
                ...(typeof sort === 'string' &&
                    (sort === 'name' || sort === 'price' || sort === 'createdAt') && {
                        sort,
                    }),
                    
                    ...(typeof page === 'string' && { page: Number(page) }),
                    ...(typeof limit === 'string' && { limit: Number(limit) }),
                };
                
                const result = await SearchService.search(query);
                res.status(200).json(result);
            } catch (error) {
                next(error);
            }
        },
};
