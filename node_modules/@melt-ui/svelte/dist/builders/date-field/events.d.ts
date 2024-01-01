import type { GroupedEvents } from '../../internal/types.js';
export declare const dateFieldEvents: {
    segment: readonly ["keydown", "focusout", "click"];
};
export type DateFieldEvents = GroupedEvents<typeof dateFieldEvents>;
