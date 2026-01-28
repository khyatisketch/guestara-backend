import { Types } from 'mongoose';
import { CategoryModel } from '../category/category.model.js';
import { SubcategoryModel } from '../subcategory/subcategory.model.js';
import { ItemModel } from './item.model.js';
import type { CreateItemDTO, UpdateItemDTO, ItemDocument } from './item.types.js';
import { ApiError } from '../../core/errors/ApiError.js';

export const ItemService = {
    async create(data: CreateItemDTO): Promise<ItemDocument> {
        /**
        * An item must link to either a category or a subcategory,
        * but never both. This enforces consistent parent relationships.
        */
        const hasCategory = Boolean(data.category_id);
        const hasSubcategory = Boolean(data.subcategory_id);
        
        if (!hasCategory && !hasSubcategory) {
            throw new ApiError('Either category_id or subcategory_id is required', 400);
        }
        
        if (hasCategory && hasSubcategory) {
            throw new ApiError('Only one of category_id or subcategory_id is allowed', 400);
        }
        
        /**
        * Validate parent category.
        * If category_id is provided, ensure the category exists and is active.
        */
        if (data.category_id) {
            const category = await CategoryModel.findById(data.category_id);
            if (!category || !category.is_active) {
                throw new ApiError('Parent category not found or inactive', 404);
            }
        }
        
        /**
        * Validate parent subcategory and its parent category.
        * Ensures no orphaned or inactive parent linkage.
        */
        if (data.subcategory_id) {
            const sub = await SubcategoryModel.findById(data.subcategory_id).populate('category_id');
            if (!sub || !sub.is_active) {
                throw new ApiError('Parent subcategory not found or inactive', 404);
            }
            
            const parentCategory = sub.category_id as any;
            if (!parentCategory?.is_active) {
                throw new ApiError('Parent category of subcategory is inactive', 400);
            }
        }
        
        /**
        * Pricing type must be specified for all item types.
        * Additional deeper pricing validation can be added separately
        * or handled by schema validations.
        */
        if (!data.pricing?.type) {
            throw new ApiError('Pricing type is required', 400);
        }
        
        /**
        * Convert string IDs to ObjectId for persistence.
        */
        const item = await ItemModel.create({
            ...data,
            category_id: data.category_id ? new Types.ObjectId(data.category_id) : null,
            subcategory_id: data.subcategory_id ? new Types.ObjectId(data.subcategory_id) : null,
            is_active: true,
        });
        
        return item;
    },
    
    async list(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        
        /**
        * Parallel fetch for list + total count for pagination metadata.
        */
        const [data, total] = await Promise.all([
            ItemModel.find({ is_active: true })
            .populate('category_id')
            .populate('subcategory_id')
            .skip(skip)
            .limit(limit)
            .lean(),
            ItemModel.countDocuments({ is_active: true }),
        ]);
        
        return {
            data,
            pagination: { page, limit, total },
        };
    },
    
    async update(id: string, data: UpdateItemDTO): Promise<ItemDocument> {
        const item = await ItemModel.findByIdAndUpdate(id, data, {
            new: true,
        });
        
        if (!item) {
            throw new ApiError('Item not found', 404);
        }
        
        return item;
    },
    
    async softDelete(id: string): Promise<ItemDocument> {
        /**
        * Soft-delete preserves history and avoids orphaned relations.
        */
        const item = await ItemModel.findByIdAndUpdate(
            id,
            { is_active: false },
            { new: true }
        );
        
        if (!item) {
            throw new ApiError('Item not found', 404);
        }
        
        return item;
    },
};
