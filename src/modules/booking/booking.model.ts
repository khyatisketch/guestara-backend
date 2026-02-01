import { Schema, model } from 'mongoose';
import type { BookingDocument } from './booking.types.js';

const BookingSchema = new Schema<BookingDocument>(
    {
        item_id: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
        date: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
    },
    { timestamps: true, collection: 'bookings' }
);

export const BookingModel = model<BookingDocument>('Booking', BookingSchema);
