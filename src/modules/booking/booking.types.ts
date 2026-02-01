import type { Document, Types } from 'mongoose';

export type BookingAttributes = {
    item_id: Types.ObjectId;
    date: string;
    startTime: string;
    endTime: string;
};

export interface BookingDocument extends BookingAttributes, Document {
    createdAt: Date;
    updatedAt: Date;
}
