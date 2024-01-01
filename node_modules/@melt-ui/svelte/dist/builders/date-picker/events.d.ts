import type { GroupedEvents } from '../../internal/types.js';
export declare const datePickerEvents: {
    calendar: readonly ["keydown"];
    prevButton: readonly ["click"];
    nextButton: readonly ["click"];
    cell: readonly ["click"];
    trigger: readonly ["click", "keydown"];
    close: readonly ["click", "keydown"];
    segment: readonly ["keydown", "focusout", "click"];
};
export type DatePickerEvents = GroupedEvents<typeof datePickerEvents>;
