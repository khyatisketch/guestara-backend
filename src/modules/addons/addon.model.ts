import { Schema, model } from 'mongoose';
import type { AddonDocument } from './addon.types.js';

const AddonSchema = new Schema<AddonDocument>(
    {
        item_id: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        group: {
            type: String,
            default: null
        },
        is_mandatory: {
            type: Boolean,
            default: false
        },
        is_active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        collection: 'addons'
    }
);

/**
 * Optional uniqueness per item. Uniqueness disabled by design.
 */
AddonSchema.index({ item_id: 1, name: 1 }, { unique: false });

export const AddonModel = model<AddonDocument>('Addon', AddonSchema);
