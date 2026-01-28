import { Schema, model } from 'mongoose';
import type { SubcategoryDocument } from './subcategory.types.js';

const SubcategorySchema = new Schema<SubcategoryDocument>(
    {
        category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        name: { type: String, required: true, trim: true },
        image: { type: String },
        description: { type: String },
        tax_applicable: { type: Boolean, default: null },
        tax_percentage: { type: Number, default: null },
        is_active: { type: Boolean, default: true }
    },
    {
        timestamps: true,
        collection: 'subcategories'
    }
);

SubcategorySchema.index({ category_id: 1, name: 1 }, { unique: true });

export const SubcategoryModel = model<SubcategoryDocument>('Subcategory', SubcategorySchema);
