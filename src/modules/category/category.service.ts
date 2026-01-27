import { CategoryModel } from './category.model.js';
import type {
    CreateCategoryInput,
    UpdateCategoryInput,
    CategoryDocument,
} from './category.types.js';

export const CategoryService = {
    async create(data: CreateCategoryInput): Promise<CategoryDocument> {
        if (data.tax_applicable === true && !data.tax_percentage) {
            throw new Error('tax_percentage is required when tax_applicable = true');
        }
        
        const category = await CategoryModel.create({
            ...data,
            is_active: true,
            tax_applicable: data.tax_applicable ?? false,
        });
        
        return category;
    },
    
    async list(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        
        const [data, total] = await Promise.all([
            CategoryModel.find({ is_active: true }).skip(skip).limit(limit).lean(),
            CategoryModel.countDocuments({ is_active: true }),
        ]);
        
        return {
            data,
            pagination: { page, limit, total },
    };
},

async update(id: string, data: UpdateCategoryInput): Promise<CategoryDocument> {
    if (data.tax_applicable === true && !data.tax_percentage) {
        throw new Error('tax_percentage is required when tax_applicable = true');
    }

    const category = await CategoryModel.findByIdAndUpdate(id, data, {
        new: true,
    });

    if (!category) throw new Error('Category not found');

    return category;
},

async softDelete(id: string): Promise<CategoryDocument> {
    const category = await CategoryModel.findByIdAndUpdate(
        id,
        { is_active: false },
        { new: true }
    );

    if (!category) throw new Error('Category not found');

    return category;
},
};
