import { Types } from 'mongoose';
import { ItemModel } from './item.model.js';
import { PricingService } from './pricing.service.js';
import type { SearchQueryDTO, SearchResult } from './search.types.js';
import { ApiError } from '../../core/errors/ApiError.js';

export const SearchService = {
    async search(query: SearchQueryDTO): Promise<SearchResult> {
        const {
            q,
            category,
            subcategory,
            active = true,
            minPrice,
            maxPrice,
            time,
            durationHours,
            sort = 'name',
            page = 1,
            limit = 10,
        } = query;
        
        const dbQuery: Record<string, unknown> = {};
        
        if (q) {
            dbQuery.$text = { $search: q };
        }
        
        if (category) {
            dbQuery.category_id = new Types.ObjectId(category);
        }
        
        if (subcategory) {
            dbQuery.subcategory_id = new Types.ObjectId(subcategory);
        }
        
        if (active) {
            dbQuery.is_active = true;
        }
        
        const items = await ItemModel.find(dbQuery);
        
        const pricedItems: {
            item: any;
            price: number;
        }[] = [];
        
        for (const item of items) {
            try {
                const pricingContext = {
                    ...(time !== undefined && { time }),
                    ...(durationHours !== undefined && { durationHours }),
                };
                
                const pricingResult = await PricingService.calculate(
                    item._id.toString(),
                    pricingContext
                );
                
                const finalPrice = pricingResult.finalPayable;
                
                /**
                * Price filters are applied after pricing resolution.
                */
                if (
                    (minPrice !== undefined && finalPrice < minPrice) ||
                    (maxPrice !== undefined && finalPrice > maxPrice)
                ) {
                    continue;
                }
                
                pricedItems.push({
                    item,
                    price: finalPrice,
                });
            } catch {
                continue;
            }
        }
        
        /**
        * Sorting is applied after pricing resolution
        * because price-based sorting depends on computed values.
        */
        switch (sort) {
            case 'price':
                pricedItems.sort((a, b) => a.price - b.price);
                break;
                
                case 'createdAt':
                    pricedItems.sort(
                        (a, b) =>
                            new Date(a.item.createdAt).getTime() -
                        new Date(b.item.createdAt).getTime()
                    );
                    break;
                    
                    case 'name':
                    default:
                        pricedItems.sort((a, b) =>
                            a.item.name.localeCompare(b.item.name)
                    );
                }
                
                const total = pricedItems.length;
                const start = (page - 1) * limit;
                const paginated = pricedItems.slice(start, start + limit);
                
                return {
                    data: paginated.map((p) => ({
                        item: p.item,
                        price: p.price,
                    })),
                    pagination: {
                        page,
                        limit,
                        total,
                    },
                };
            },
        };
