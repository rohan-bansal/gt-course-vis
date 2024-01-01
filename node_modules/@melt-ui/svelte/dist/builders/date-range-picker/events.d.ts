import type { GroupedEvents } from '../../internal/types.js';
export declare const dateRangePickerEvents: {
    calendar: readonly ["keydown"];
    prevButton: readonly ["click"];
    nextButton: readonly ["click"];
    cell: readonly ["click", "mouseenter", "focusin"];
    trigger: readonly ["click", "keydown"];
    close: readonly ["click", "keydown"];
    startSegment: readonly ["keydown", "focusout", "click"];
    endSegment: readonly ["keydown", "focusout", "click"];
};
export type DateRangePickerEvents = GroupedEvents<typeof dateRangePickerEvents>;
