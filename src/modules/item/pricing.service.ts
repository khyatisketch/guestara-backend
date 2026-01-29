import { ItemModel } from './item.model.js';
import { CategoryModel } from '../category/category.model.js';
import { SubcategoryModel } from '../subcategory/subcategory.model.js';
import { AddonModel } from '../addons/addon.model.js';
import type { PricingContext, PricingResult } from './pricing.types.js';
import { ApiError } from '../../core/errors/ApiError.js';

export const PricingService = {
    async calculate(itemId: string, context: PricingContext): Promise<PricingResult> {
        /**
        * Load item and ensure it's active. Required as pricing
        * must reflect valid and sellable inventory.
        */
        const item = await ItemModel.findById(itemId);
        if (!item || !item.is_active) {
            throw new ApiError('Item not found or inactive', 404);
        }
        
        /**
        * Resolve parent category/subcategory for tax inheritance rules.
        */
        const subcategory = item.subcategory_id
        ? await SubcategoryModel.findById(item.subcategory_id)
        : null;
        
        const category = subcategory
        ? await CategoryModel.findById(subcategory.category_id)
        : item.category_id
        ? await CategoryModel.findById(item.category_id)
        : null;
        
        if (!category || !category.is_active) {
            throw new ApiError('Parent category not found or inactive', 404);
        }
        if (subcategory && !subcategory.is_active) {
            throw new ApiError('Parent subcategory inactive', 400);
        }
        
        const pricing = item.pricing;
        let basePrice = 0;
        let discount = 0;
        
        /**
        * Resolve base pricing by pricing type.
        */
        switch (pricing.type) {
            case 'STATIC':
                if (!pricing.static?.price) throw new ApiError('Static price missing', 400);
                basePrice = pricing.static.price;
                break;
                
                case 'TIERED':
                    if (!context.durationHours) {
                        throw new ApiError('durationHours is required for tiered pricing', 400);
                    }
                    if (!pricing.tiered?.length) {
                        throw new ApiError('Tiered pricing tiers missing', 400);
                    }
                    const tier = pricing.tiered.find(t => context.durationHours! <= t.uptoHours);
                    if (!tier) throw new ApiError('No tier matches given duration', 400);
                    basePrice = tier.price;
                    break;
                    
                    case 'COMPLIMENTARY':
                        basePrice = 0;
                        break;
                        
                        case 'DISCOUNTED':
                            if (!pricing.discounted?.basePrice) {
                                throw new ApiError('Base price missing for discounted pricing', 400);
                            }
                            basePrice = pricing.discounted.basePrice;
                            
                            if (pricing.discounted.percent) {
                                discount = (basePrice * pricing.discounted.percent) / 100;
                            } else if (pricing.discounted.flat) {
                                discount = pricing.discounted.flat;
                            }
                            
                            discount = Math.max(discount, 0);
                            basePrice = Math.max(basePrice - discount, 0);
                            break;
                            
                            case 'DYNAMIC':
                                if (!context.time) throw new ApiError('time is required for dynamic pricing', 400);
                                if (!pricing.dynamic?.length) throw new ApiError('Dynamic pricing windows missing', 400);
                                
                                const slot = pricing.dynamic.find(
                                    w => context.time! >= w.startTime && context.time! < w.endTime
                                );
                                if (!slot) throw new ApiError('Item not available at this time', 400);
                                basePrice = slot.price;
                                break;
                                
                                default:
                                    throw new ApiError('Unknown pricing type', 400);
                                }
                                
                                /**
                                * Add addon costs if provided.
                                */
                                let addonTotal = 0;
                                const addonDetails: PricingResult['addons'] = [];
                                
                                if (context.addons?.length) {
                                    const addons = await AddonModel.find({
                                        _id: { $in: context.addons },
                                        is_active: true,
                                    });
                                    
                                    for (const a of addons) {
                                        addonTotal += a.price;
                                        addonDetails.push({
                                            id: a._id,
                                            name: a.name,
                                            price: a.price,
                                        });
                                    }
                                }
                                
                                /**
                                * Resolve tax based on item → subcategory → category inheritance chain.
                                */
                                const taxRule = resolveTax(item, subcategory, category);
                                const taxableAmount = basePrice + addonTotal;
                                const taxAmount = taxRule.applicable && taxRule.percentage
                                ? (taxableAmount * taxRule.percentage) / 100
                                : 0;
                                
                                const finalPayable = taxableAmount + taxAmount;
                                
                                return {
                                    itemId,
                                    pricingType: pricing.type,
                                    basePrice,
                                    discount,
                                    addons: addonDetails,
                                    tax: {
                                        applicable: taxRule.applicable,
                                        percentage: taxRule.percentage,
                                        amount: taxAmount,
                                    },
                                    finalPayable,
                                };
                            },
};

/**
 * Tax inheritance logic:
 * item overrides > subcategory overrides > category default
 */
function resolveTax(item: any, subcategory: any, category: any) {
    if (item.tax_applicable != null) {
        return { applicable: item.tax_applicable, percentage: item.tax_percentage || 0 };
    }
    if (subcategory?.tax_applicable != null) {
        return { applicable: subcategory.tax_applicable, percentage: subcategory.tax_percentage || 0 };
    }
    return { applicable: category.tax_applicable, percentage: category.tax_percentage || 0 };
}
