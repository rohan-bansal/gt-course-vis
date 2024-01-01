import type { GroupedEvents } from '../../internal/types.js';
export declare const dateRangeFieldEvents: {
    startSegment: readonly ["keydown", "focusout", "click"];
    endSegment: readonly ["keydown", "focusout", "click"];
};
export type DateRangeFieldEvents = GroupedEvents<typeof dateRangeFieldEvents>;
