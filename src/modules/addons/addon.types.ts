import type { Document, Types } from 'mongoose';

/**
 * Persistent fields stored in MongoDB for addons.
 */
export type AddonAttributes = {
    item_id: Types.ObjectId;
    name: string;
    price: number;
    group?: string | null;
    is_mandatory: boolean;
    is_active: boolean;
}

/**
 * Mongoose document type (only for model layer).
 */
export interface AddonDocument extends AddonAttributes, Document {
    createdAt: Date;
    updatedAt: Date;
}

/**
 * DTO for creating an addon via API.
 * `item_id` must be string here because HTTP request bodies carry strings.
 */
export type CreateAddonDTO = {
    item_id: string;
    name: string;
    price: number;
    group?: string | null;
    is_mandatory?: boolean;
};

/**
 * DTO for partial update operations.
 */
export type UpdateAddonDTO = Partial<CreateAddonDTO>;
