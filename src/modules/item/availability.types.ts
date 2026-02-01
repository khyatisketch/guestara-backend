export type AvailableSlot = {
    startTime: string;
    endTime: string;
};

export type AvailabilityResult = {
    date: string;
    availableSlots: AvailableSlot[];
};
