import { Schema, model } from 'mongoose';
import type { CategoryDocument } from './category.types.js';

const CategorySchema = new Schema<CategoryDocument>(
    {
        name: { type: String, required: true, unique: true, trim: true },
        image: { type: String },
        description: { type: String },
        tax_applicable: { type: Boolean, default: false },
        tax_percentage: { type: Number },
        is_active: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        collection: 'categories',
    }
);

export const CategoryModel = model<CategoryDocument>('Category', CategorySchema);
