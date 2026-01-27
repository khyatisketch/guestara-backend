import { Document } from 'mongoose';

export type CategoryAttributes = {
    name: string;
    image?: string;
    description?: string;
    tax_applicable: boolean;
    tax_percentage?: number;
    is_active: boolean;
}

export interface CategoryDocument extends CategoryAttributes, Document {
    createdAt: Date;
    updatedAt: Date;
}

export type CreateCategoryInput = {
    name: string;
    image?: string;
    description?: string;
    tax_applicable?: boolean;
    tax_percentage?: number;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;
