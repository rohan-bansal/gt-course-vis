import { type DateValue } from '@internationalized/date';
import type { Month } from './types.js';
import { type Writable } from 'svelte/store';
/**
 * Checks if a given node is a calendar cell element.
 *
 * @param node - The node to check.
 */
export declare function isCalendarCell(node: unknown): node is HTMLElement;
/**
 * Retrieves an array of date values representing the days between
 * the provided start and end dates.
 */
export declare function getDaysBetween(start: DateValue, end: DateValue): DateValue[];
export type CreateMonthProps = {
    /**
     * The date object representing the month's date (usually the first day of the month).
     */
    dateObj: DateValue;
    /**
     * The day of the week to start the calendar on (0 for Sunday, 1 for Monday, etc.).
     */
    weekStartsOn: number;
    /**
     * Whether to always render 6 weeks in the calendar, even if the month doesn't
     * span 6 weeks.
     */
    fixedWeeks: boolean;
    /**
     * The locale to use when creating the calendar month.
     */
    locale: string;
};
type SetMonthProps = CreateMonthProps & {
    numberOfMonths: number | undefined;
    currentMonths?: Month<DateValue>[];
};
export declare function createMonths(props: SetMonthProps): Month<DateValue>[];
export declare function getSelectableCells(calendarId: string): HTMLElement[];
/**
 * A helper function to extract the date from the `data-value`
 * attribute of a date cell and set it as the placeholder value.
 *
 * Shared between the calendar and range calendar builders.
 *
 * @param node - The node to extract the date from.
 * @param placeholder - The placeholder value store which will be set to the extracted date.
 */
export declare function setPlaceholderToNodeValue(node: HTMLElement, placeholder: Writable<DateValue>): void;
export {};
