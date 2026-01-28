import type { Document, Types } from 'mongoose';

export type PricingType =
| 'STATIC'
| 'TIERED'
| 'COMPLIMENTARY'
| 'DISCOUNTED'
| 'DYNAMIC';

/**
 * Persistent attributes stored in MongoDB.
 */
export type ItemAttributes = {
    category_id?: Types.ObjectId | null;
    subcategory_id?: Types.ObjectId | null;
    name: string;
    description?: string;
    image?: string;
    is_active: boolean;
    tax_applicable?: boolean | null;
    tax_percentage?: number | null;
    pricing: {
        type: PricingType;
        static?: { price: number };
        tiered?: { uptoHours: number; price: number }[];
        discounted?: { basePrice: number; flat?: number; percent?: number };
        dynamic?: { startTime: string; endTime: string; price: number }[];
    };
    availability?: {
        days: string[];
        slots: { startTime: string; endTime: string }[];
    };
};

/**
 * Extended mongoose document (in model layer only)
 */
export interface ItemDocument extends ItemAttributes, Document {
    createdAt: Date;
    updatedAt: Date;
}

/**
 * DTOs for API input
 * category_id/subcategory_id come in as strings via HTTP.
 */
export type CreateItemDTO = {
  category_id?: string | null;
  subcategory_id?: string | null;
  name: string;
  description?: string;
  image?: string;
  tax_applicable?: boolean | null;
  tax_percentage?: number | null;

  pricing: ItemAttributes['pricing'];

  availability?: {
    days?: string[];
    slots?: { startTime: string; endTime: string }[];
  };
};

export type UpdateItemDTO = Partial<CreateItemDTO>;
