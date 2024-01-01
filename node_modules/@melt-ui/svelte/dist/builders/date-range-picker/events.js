import { dateRangeFieldEvents } from '../date-range-field/events.js';
import { popoverEvents } from '../popover/events.js';
import { rangeCalendarEvents } from '../range-calendar/events.js';
export const dateRangePickerEvents = {
    ...dateRangeFieldEvents,
    ...popoverEvents,
    ...rangeCalendarEvents,
};
