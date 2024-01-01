import type { GroupedEvents, MeltComponentEvents } from '../../internal/types.js';
export declare const popoverEvents: {
    readonly trigger: readonly ["click", "keydown"];
    readonly close: readonly ["click", "keydown"];
};
export type PopoverEvents = GroupedEvents<typeof popoverEvents>;
export type PopoverComponentEvents = MeltComponentEvents<PopoverEvents>;
