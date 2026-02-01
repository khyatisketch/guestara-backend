import type { Document, Types } from 'mongoose';

export type BookingAttributes = {
    item_id: Types.ObjectId;
    date: string;     
    startTime: string;
    endTime: string;
    user?: {
        name?: string;
        email?: string;
    };
};

export type CreateBookingDTO = {
    item_id: string;
    date: string;
    startTime: string;
    endTime: string;
    user?: {
        name?: string;
        email?: string;
    };
};

export interface BookingDocument extends BookingAttributes, Document {
    createdAt: Date;
}
