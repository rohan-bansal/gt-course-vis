import type { GroupedEvents } from '../../internal/types.js';
export declare const calendarEvents: {
    calendar: readonly ["keydown"];
    prevButton: readonly ["click"];
    nextButton: readonly ["click"];
    cell: readonly ["click"];
};
export type CalendarEvents = GroupedEvents<typeof calendarEvents>;
