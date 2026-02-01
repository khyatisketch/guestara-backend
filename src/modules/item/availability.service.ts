import { ItemModel } from './item.model.js';
import { BookingModel } from '../booking/booking.model.js';
import type { BookingAttributes } from '../booking/booking.types.js';
import { getDayOfWeek, overlaps } from '../../core/utils/time.js';
import type { AvailabilityResult } from './availability.types.js';
import { ApiError } from '../../core/errors/ApiError.js';

export const AvailabilityService = {
    async getAvailableSlots(
        itemId: string,
        date: string
    ): Promise<AvailabilityResult> {
        /**
        * Only active items can expose availability.
        */
        const item = await ItemModel.findById(itemId);
        if (!item || !item.is_active) {
            throw new ApiError('Item not found or inactive', 404);
        }
        
        /**
        * Items without configured availability are not bookable.
        */
        if (!item.availability) {
            throw new ApiError('Item is not bookable (no availability set)', 400);
        }
        
        const day = getDayOfWeek(date);
        
        /**
        * If the weekday is not enabled, no slots are available.
        */
        if (!item.availability.days?.includes(day)) {
            return { date, availableSlots: [] };
        }
        
        const baseSlots = item.availability.slots ?? [];
        
        /**
        * Existing bookings for the same item and date are loaded
        * to eliminate overlapping time windows.
        */
        const bookings = await BookingModel.find({
            item_id: itemId,
            date,
        }).lean<BookingAttributes[]>();
        
        const availableSlots = baseSlots.filter((slot) => {
            const hasConflict = bookings.some((booking) =>
                overlaps(
                    slot.startTime,
                    slot.endTime,
                    booking.startTime,
                    booking.endTime
                )
            );
            
            return !hasConflict;
        });
        
        return {
            date,
            availableSlots,
        };
    },
};
