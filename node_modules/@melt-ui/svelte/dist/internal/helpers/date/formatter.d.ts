import { type DateValue } from '@internationalized/date';
export type Formatter = ReturnType<typeof createFormatter>;
/**
 * Creates a wrapper around the `DateFormatter`, which is
 * an improved version of the {@link Intl.DateTimeFormat} API,
 * that is used internally by the various date builders to
 * easily format dates in a consistent way.
 *
 * @see [DateFormatter](https://react-spectrum.adobe.com/internationalized/date/DateFormatter.html)
 */
export declare function createFormatter(initialLocale: string): {
    setLocale: (newLocale: string) => void;
    getLocale: () => string;
    fullMonth: (date: Date) => string;
    fullYear: (date: Date) => string;
    fullMonthAndYear: (date: Date) => string;
    toParts: (date: DateValue, options?: Intl.DateTimeFormatOptions) => Intl.DateTimeFormatPart[];
    custom: (date: Date, options: Intl.DateTimeFormatOptions) => string;
    part: (dateObj: DateValue, type: Intl.DateTimeFormatPartTypes, options?: Intl.DateTimeFormatOptions) => string;
    dayPeriod: (date: Date) => "PM" | "AM";
    selectedDate: (date: DateValue, includeTime?: boolean) => string;
    dayOfWeek: (date: Date, length?: Intl.DateTimeFormatOptions['weekday']) => string;
};
