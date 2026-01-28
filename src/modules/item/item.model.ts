import { Schema, model } from 'mongoose';
import type { ItemDocument, PricingType } from './item.types.js';

const PricingTypeEnum: PricingType[] = [
  'STATIC',
  'TIERED',
  'COMPLIMENTARY',
  'DISCOUNTED',
  'DYNAMIC',
];

const ItemSchema = new Schema<ItemDocument>(
  {
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },

    subcategory_id: {
      type: Schema.Types.ObjectId,
      ref: 'Subcategory',
      default: null,
    },

    name: { type: String, required: true, trim: true },
    description: { type: String },
    image: { type: String },
    is_active: { type: Boolean, default: true },

    tax_applicable: { type: Boolean, default: null },
    tax_percentage: { type: Number, default: null },

    pricing: {
      type: {
        type: String,
        required: true,
        enum: PricingTypeEnum,
      },
      static: {
        price: { type: Number },
      },
      tiered: [
        {
          uptoHours: { type: Number },
          price: { type: Number },
        },
      ],
      discounted: {
        basePrice: { type: Number },
        flat: { type: Number },
        percent: { type: Number },
      },
      dynamic: [
        {
          startTime: { type: String },
          endTime: { type: String },
          price: { type: Number },
        },
      ],
    },

    availability: {
      days: [String],
      slots: [
        {
          startTime: { type: String },
          endTime: { type: String },
        },
      ],
    },
  },
  {
    timestamps: true,
    collection: 'items',
  }
);

/**
 * Optional uniqueness constraints per parent.
 * Uniqueness disabled (unique: false) by design.
 */
ItemSchema.index({ category_id: 1, name: 1 }, { unique: false });
ItemSchema.index({ subcategory_id: 1, name: 1 }, { unique: false });

export const ItemModel = model<ItemDocument>('Item', ItemSchema);
