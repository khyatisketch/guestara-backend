import { Schema, model } from 'mongoose';
import type { BookingDocument } from './booking.types.js';

const BookingSchema = new Schema<BookingDocument>(
    {
        item_id: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        user: {
            name: { type: String },
            email: { type: String },
        },
    },
    {
        /**
        * Bookings are append-only records.
        * We only track creation time, not updates.
        */
        timestamps: { createdAt: true, updatedAt: false },
        collection: 'bookings',
    }
);

/**
 * Index to optimize availability and conflict checks.
 */
BookingSchema.index({ item_id: 1, date: 1 });

export const BookingModel = model<BookingDocument>('Booking', BookingSchema);
