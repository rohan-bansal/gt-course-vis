import { dateFieldEvents } from '../date-field/events.js';
import { popoverEvents } from '../popover/events.js';
import { calendarEvents } from '../calendar/events.js';
export const datePickerEvents = {
    ...dateFieldEvents,
    ...popoverEvents,
    ...calendarEvents,
};
