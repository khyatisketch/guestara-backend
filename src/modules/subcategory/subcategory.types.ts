import type { Document, Types } from 'mongoose';

export type SubcategoryAttributes = {
    category_id: Types.ObjectId;
    name: string;
    image?: string;
    description?: string;
    tax_applicable?: boolean | null;
    tax_percentage?: number | null;
    is_active: boolean;
};

export interface SubcategoryDocument extends SubcategoryAttributes, Document {
    createdAt: Date;
    updatedAt: Date;
}

export type CreateSubcategoryDTO = {
    category_id: string;
    name: string;
    image?: string;
    description?: string;
    tax_applicable?: boolean | null;
    tax_percentage?: number | null;
};

export type UpdateSubcategoryDTO = Partial<CreateSubcategoryDTO>;
