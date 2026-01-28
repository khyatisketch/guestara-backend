import { Types } from 'mongoose';
import { CategoryModel } from '../category/category.model.js';
import { SubcategoryModel } from './subcategory.model.js';
import type {
    CreateSubcategoryDTO,
    UpdateSubcategoryDTO,
    SubcategoryDocument
} from './subcategory.types.js';
import { ApiError } from '../../core/errors/ApiError.js';

export const SubcategoryService = {
    async create(data: CreateSubcategoryDTO): Promise<SubcategoryDocument> {
        /**
         *  A subcategory must belong to an active parent category.
         *  Prevents orphan subcategories and preserves domain consistency.
         *         
         */
        const parent = await CategoryModel.findById(data.category_id);
        if (!parent || !parent.is_active) {
            throw new ApiError('Parent category not found or inactive', 404);
        }
        
        /**
         * Business rule:
         *  If tax is applicable, a percentage must be provided.
         *  Enforced here instead of controller to centralize domain logic.
         */
        if (data.tax_applicable === true && !data.tax_percentage) {
            throw new ApiError('tax_percentage is required when tax_applicable = true', 400);
        }
        
        /**
         *  Convert incoming category_id (string from HTTP) to ObjectId.
         * 
        */
        const subcategory = await SubcategoryModel.create({
            ...data,
            category_id: new Types.ObjectId(data.category_id),
            is_active: true,
            tax_applicable: data.tax_applicable ?? null
        });
        
        return subcategory;
    },
    
    async list(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        
        /**
         * Use parallel queries for performance:
         * - Data fetch with pagination
         * - Total count for client-side pagination metadata
         * 
        */
        const [data, total] = await Promise.all([
            SubcategoryModel.find({ is_active: true })
            /**
            * Populate parent metadata for more useful API responses.
            * This avoids a second request from clients.
            */
            .populate('category_id')
            .skip(skip)
            .limit(limit)
            .lean(),
            SubcategoryModel.countDocuments({ is_active: true })
        ]);
        
        return {
            data,
            pagination: { page, limit, total }
        };
    },
    
    async update(id: string, data: UpdateSubcategoryDTO): Promise<SubcategoryDocument> {
        /**
        * Same tax rule applies during updates.
        */
        if (data.tax_applicable === true && !data.tax_percentage) {
            throw new ApiError('tax_percentage is required when tax_applicable = true', 400);
        }
        
        const subcategory = await SubcategoryModel.findByIdAndUpdate(id, data, {
            new: true
        });
        
        /**
        * An update call may succeed logically but fail due to non-existent id.
        */
        if (!subcategory) {
            throw new ApiError('Subcategory not found', 404);
        }
        
        return subcategory;
    },
    
    async softDelete(id: string): Promise<SubcategoryDocument> {
        /**
        * Soft-delete instead of hard-delete:
        * Preserves historical data and prevents orphan references.
        */
        const subcategory = await SubcategoryModel.findByIdAndUpdate(
            id,
            { is_active: false },
            { new: true }
        );
        
        if (!subcategory) {
            throw new ApiError('Subcategory not found', 404);
        }
        
        return subcategory;
    }
};
