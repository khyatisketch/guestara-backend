import { Types } from 'mongoose';
import { ItemModel } from '../item/item.model.js';
import { AddonModel } from './addon.model.js';
import type { CreateAddonDTO, UpdateAddonDTO, AddonDocument } from './addon.types.js';
import { ApiError } from '../../core/errors/ApiError.js';

export const AddonService = {
    async create(data: CreateAddonDTO): Promise<AddonDocument> {
        /**
        * Addons must always belong to a parent item.
        * Parent item must exist and be active.
        */
        const parent = await ItemModel.findById(data.item_id);
        if (!parent || !parent.is_active) {
            throw new ApiError('Parent item not found or inactive', 404);
        }
        
        /**
        * Convert incoming item_id string to ObjectId for persistence.
        */
        const addon = await AddonModel.create({
            ...data,
            item_id: new Types.ObjectId(data.item_id),
            is_active: true,
            is_mandatory: data.is_mandatory ?? false,
        });
        
        return addon;
    },
    
    async listByItem(item_id: string) {
        /**
        * Only show active addons for the given item.
        * Item existence is not required for listing,
        * but can be validated if required by business rules.
        */
        const addons = await AddonModel.find({
            item_id,
            is_active: true,
        }).lean();
        
        return addons;
    
    },
    
    async update(id: string, data: UpdateAddonDTO): Promise<AddonDocument> {
        const addon = await AddonModel.findByIdAndUpdate(id, data, {
            new: true,
        });
        
        if (!addon) {
            throw new ApiError('Addon not found', 404);
        }
        
        return addon;
    },
    
    async softDelete(id: string): Promise<AddonDocument> {
        /**
        * Soft-delete avoids orphan references and retains history.
        */
        const addon = await AddonModel.findByIdAndUpdate(
            id,
            { is_active: false },
            { new: true }
        );
        
        if (!addon) {
            throw new ApiError('Addon not found', 404);
        }
        
        return addon;
    },
};
