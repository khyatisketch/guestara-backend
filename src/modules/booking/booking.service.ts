import { Types } from 'mongoose';
import { BookingModel } from './booking.model.js';
import { ItemModel } from '../item/item.model.js';
import type {
    BookingAttributes,
    BookingDocument,
    CreateBookingDTO
} from './booking.types.js';
import { getDayOfWeek, overlaps } from '../../core/utils/time.js';
import { ApiError } from '../../core/errors/ApiError.js';

export const BookingService = {
    async create(data: CreateBookingDTO): Promise<BookingDocument> {
        const item = await ItemModel.findById(data.item_id);
        if (!item || !item.is_active) {
            throw new ApiError('Item not found or inactive', 404);
        }
        
        if (!item.availability) {
            throw new ApiError('Item is not bookable', 400);
        }
        
        const day = getDayOfWeek(data.date);
        if (!item.availability.days.includes(day)) {
            throw new ApiError('Item not available on this day', 400);
        }
        
        /**
        * Requested slot must fit entirely within at least one availability window.
        */
        const slotAllowed = item.availability.slots.some((slot) => {
            return (
                data.startTime >= slot.startTime &&
                data.endTime <= slot.endTime
            );
        });
        
        if (!slotAllowed) {
            throw new ApiError(
                'Requested time outside availability slots',
                400
            );
        }
        
        /**
        * Conflict check against existing bookings for the same item and date.
        */
        const existingBookings = await BookingModel.find({
            item_id: data.item_id,
            date: data.date,
        }).lean<BookingAttributes[]>();
        
        const hasConflict = existingBookings.some((booking) =>
            overlaps(
                data.startTime,
                data.endTime,
                booking.startTime,
                booking.endTime
            )
        );
        
        if (hasConflict) {
            throw new ApiError('Time slot already booked', 409);
        }
        
        /**
        * Persist booking.
        * Bookings are append-only records.
        */
        const booking = await BookingModel.create({
            item_id: new Types.ObjectId(data.item_id),
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            ...(data.user && { user: data.user }),
        });
        
        return booking;
    },
};
