/**
 * Resolves weekday code (SUN..SAT) from a date string.
 */
export function getDayOfWeek(dateString: string): string {
    const date = new Date(dateString);
    
    if (Number.isNaN(date.getTime())) {
        throw new Error(`Invalid date string: ${dateString}`);
    }

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const day = days[date.getDay()];
    if (!day) {
        throw new Error('Invalid day index');
    }
    return day;
}

/**
 * Converts HH:mm → minutes since midnight.
 * Validates format to avoid undefined destructuring.
 */
export function toMinutes(time: string): number {
    const parts = time.split(':');
    
    if (parts.length !== 2) {
        throw new Error(`Invalid time format: ${time}. Expected HH:mm`);
    }
    
    const h = Number(parts[0]);
    const m = Number(parts[1]);
    
    if (Number.isNaN(h) || Number.isNaN(m)) {
        throw new Error(`Invalid time value: ${time}`);
    }
    
    return h * 60 + m;
}

/**
 * Returns true if two half-open time ranges overlap.
 * Range format: [start, end)
 */
export function overlaps(
    start1: string,
    end1: string,
    start2: string,
    end2: string
): boolean {
    const s1 = toMinutes(start1);
    const e1 = toMinutes(end1);
    const s2 = toMinutes(start2);
    const e2 = toMinutes(end2);
    
    return s1 < e2 && s2 < e1;
}
