import type { GroupedEvents } from '../../internal/types.js';
export declare const rangeCalendarEvents: {
    calendar: readonly ["keydown"];
    prevButton: readonly ["click"];
    nextButton: readonly ["click"];
    cell: readonly ["click", "mouseenter", "focusin"];
};
export type RangeCalendarEvents = GroupedEvents<typeof rangeCalendarEvents>;
