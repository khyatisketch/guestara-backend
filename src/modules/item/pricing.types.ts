import type { Types } from 'mongoose';
import type { PricingType } from './item.types.js';

export type PricingContext = {
    time?: string;
    durationHours?: number;
    addons?: string[];  
};

export type PricingResult = {
    itemId: string;
    pricingType: PricingType;
    basePrice: number;
    discount: number;
    addons: {
        id: Types.ObjectId;
        name: string;
        price: number;
    }[];
    tax: {
        applicable: boolean;
        percentage: number;
        amount: number;
    };
    finalPayable: number;
};
