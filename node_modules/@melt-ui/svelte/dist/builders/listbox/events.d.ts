import type { GroupedEvents, MeltComponentEvents } from '../../internal/types.js';
export declare const listboxEvents: {
    trigger: readonly ["click", "keydown", "input"];
    menu: readonly ["pointerleave"];
    item: readonly ["pointermove", "click"];
};
export type ListboxEvents = GroupedEvents<typeof listboxEvents>;
export type ListboxComponentEvents = MeltComponentEvents<ListboxEvents>;
