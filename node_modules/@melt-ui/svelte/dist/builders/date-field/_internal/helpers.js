import { getPlaceholder, toDate, isZonedDateTime, hasTime, getSegments, } from '../../../internal/helpers/date/index.js';
import { ALL_SEGMENT_PARTS, DATE_SEGMENT_PARTS, EDITABLE_SEGMENT_PARTS, TIME_SEGMENT_PARTS, } from './parts.js';
import { isBrowser, isNull, generateId, kbd, isNumberString, styleToString, } from '../../../internal/helpers/index.js';
import { get } from 'svelte/store';
export function initializeSegmentValues(granularity) {
    const calendarDateTimeGranularities = ['hour', 'minute', 'second'];
    const initialParts = EDITABLE_SEGMENT_PARTS.map((part) => {
        if (part === 'dayPeriod') {
            return [part, 'AM'];
        }
        return [part, null];
    }).filter(([key]) => {
        if (key === 'literal' || key === null)
            return false;
        if (granularity === 'day') {
            return !calendarDateTimeGranularities.includes(key);
        }
        else {
            return true;
        }
    });
    return Object.fromEntries(initialParts);
}
function createContentObj(props) {
    const { segmentValues, formatter, locale, dateRef } = props;
    const content = Object.keys(segmentValues).reduce((obj, part) => {
        if (!isSegmentPart(part))
            return obj;
        if ('hour' in segmentValues && part === 'dayPeriod') {
            const value = segmentValues[part];
            if (!isNull(value)) {
                obj[part] = value;
            }
            else {
                obj[part] = getPlaceholder(part, 'AM', locale);
            }
        }
        else {
            obj[part] = getPartContent(part);
        }
        return obj;
    }, {});
    function getPartContent(part) {
        if ('hour' in segmentValues) {
            const value = segmentValues[part];
            if (!isNull(value)) {
                return formatter.part(dateRef.set({ [part]: value }), part, {
                    hourCycle: props.hourCycle === 24 ? 'h24' : undefined,
                });
            }
            else {
                return getPlaceholder(part, '', locale);
            }
        }
        else {
            if (isDateSegmentPart(part)) {
                const value = segmentValues[part];
                if (!isNull(value)) {
                    return formatter.part(dateRef.set({ [part]: value }), part);
                }
                else {
                    return getPlaceholder(part, '', locale);
                }
            }
            return '';
        }
    }
    return content;
}
function createContentArr(props) {
    const { granularity, dateRef, formatter, contentObj, hideTimeZone, hourCycle } = props;
    const parts = formatter.toParts(dateRef, getOptsByGranularity(granularity, hourCycle));
    const segmentContentArr = parts
        .map((part) => {
        const defaultParts = ['literal', 'dayPeriod', 'timeZoneName', null];
        if (defaultParts.includes(part.type) || !isSegmentPart(part.type)) {
            return {
                part: part.type,
                value: part.value,
            };
        }
        return {
            part: part.type,
            value: contentObj[part.type],
        };
    })
        .filter((segment) => {
        if (isNull(segment.part) || isNull(segment.value))
            return false;
        if (segment.part === 'timeZoneName' && (!isZonedDateTime(dateRef) || hideTimeZone)) {
            return false;
        }
        return true;
    });
    return segmentContentArr;
}
export function createContent(props) {
    const contentObj = createContentObj(props);
    const contentArr = createContentArr({
        contentObj,
        ...props,
    });
    return {
        obj: contentObj,
        arr: contentArr,
    };
}
function getOptsByGranularity(granularity, hourCycle) {
    const opts = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
        hourCycle: hourCycle === 24 ? 'h24' : undefined,
        hour12: hourCycle === 24 ? false : undefined,
    };
    if (granularity === 'day') {
        delete opts.second;
        delete opts.hour;
        delete opts.minute;
        delete opts.timeZoneName;
    }
    if (granularity === 'hour') {
        delete opts.minute;
    }
    if (granularity === 'minute') {
        delete opts.second;
    }
    return opts;
}
export function initSegmentStates() {
    return EDITABLE_SEGMENT_PARTS.reduce((acc, key) => {
        acc[key] = {
            lastKeyZero: false,
            hasLeftFocus: true,
            hasTouched: false,
        };
        return acc;
    }, {});
}
export function initSegmentIds() {
    return Object.fromEntries(ALL_SEGMENT_PARTS.map((part) => {
        return [part, generateId()];
    }).filter(([key]) => key !== 'literal'));
}
export function isDateSegmentPart(part) {
    return DATE_SEGMENT_PARTS.includes(part);
}
export function isSegmentPart(part) {
    return EDITABLE_SEGMENT_PARTS.includes(part);
}
export function isAnySegmentPart(part) {
    return ALL_SEGMENT_PARTS.includes(part);
}
/**
 * Get the segments being used/ are rendered in the DOM.
 * We're using this to determine when to set the value of
 * the date picker, which is when all the segments have
 * been filled.
 */
function getUsedSegments(id) {
    if (!isBrowser)
        return [];
    const usedSegments = getSegments(id)
        .map((el) => el.dataset.segment)
        .filter((part) => {
        return EDITABLE_SEGMENT_PARTS.includes(part);
    });
    return usedSegments;
}
export function getValueFromSegments(props) {
    const { segmentObj, id, dateRef } = props;
    const usedSegments = getUsedSegments(id);
    let date = dateRef;
    usedSegments.forEach((part) => {
        if ('hour' in segmentObj) {
            const value = segmentObj[part];
            if (isNull(value))
                return;
            date = date.set({ [part]: segmentObj[part] });
            return;
        }
        else if (isDateSegmentPart(part)) {
            const value = segmentObj[part];
            if (isNull(value))
                return;
            date = date.set({ [part]: segmentObj[part] });
            return;
        }
    });
    return date;
}
/**
 * Check if all the segments being used have been filled.
 * We use this to determine when we should set the value
 * store of the date field(s).
 *
 * @param segmentValues - The current `SegmentValueObj`
 * @param id  - The id of the date field
 */
export function areAllSegmentsFilled(segmentValues, id) {
    const usedSegments = getUsedSegments(id);
    return usedSegments.every((part) => {
        if ('hour' in segmentValues) {
            return segmentValues[part] !== null;
        }
        else if (isDateSegmentPart(part)) {
            return segmentValues[part] !== null;
        }
    });
}
/**
 * Extracts the segment part from the provided node,
 * if it exists, otherwise returns null.
 */
export function getPartFromNode(node) {
    const part = node.dataset.segment;
    if (!isAnySegmentPart(part))
        return null;
    return part;
}
/**
 * Determines if the provided object is a valid `DateAndTimeSegmentObj`
 * by checking if it has the correct keys and values for each key.
 */
export function isDateAndTimeSegmentObj(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    return Object.entries(obj).every(([key, value]) => {
        const validKey = TIME_SEGMENT_PARTS.includes(key) ||
            DATE_SEGMENT_PARTS.includes(key);
        const validValue = key === 'dayPeriod'
            ? value === 'AM' || value === 'PM' || value === null
            : typeof value === 'number' || value === null;
        return validKey && validValue;
    });
}
/**
 * Infer the granularity to use based on the
 * value and granularity props.
 */
export function inferGranularity(value, granularity) {
    if (granularity) {
        return granularity;
    }
    if (hasTime(value)) {
        return 'minute';
    }
    return 'day';
}
export function isAcceptableSegmentKey(key) {
    const acceptableSegmentKeys = [
        kbd.ENTER,
        kbd.ARROW_UP,
        kbd.ARROW_DOWN,
        kbd.ARROW_LEFT,
        kbd.ARROW_RIGHT,
        kbd.BACKSPACE,
        kbd.SPACE,
    ];
    if (acceptableSegmentKeys.includes(key))
        return true;
    if (isNumberString(key))
        return true;
    return false;
}
/**
 * Sets the individual segment values based on the current
 * value of the date picker. This is used to initialize the
 * segment values if a default value is provided, and to
 * keep it in sync as the value changes outside the builder.
 */
export function syncSegmentValues(props) {
    const { value, updatingDayPeriod, segmentValues, formatter } = props;
    const dateValues = DATE_SEGMENT_PARTS.map((part) => {
        return [part, value[part]];
    });
    if ('hour' in value) {
        const timeValues = TIME_SEGMENT_PARTS.map((part) => {
            if (part === 'dayPeriod') {
                const $updatingDayPeriod = get(updatingDayPeriod);
                if ($updatingDayPeriod) {
                    return [part, $updatingDayPeriod];
                }
                else {
                    return [part, formatter.dayPeriod(toDate(value))];
                }
            }
            return [part, value[part]];
        });
        const mergedSegmentValues = [...dateValues, ...timeValues];
        segmentValues.set(Object.fromEntries(mergedSegmentValues));
        updatingDayPeriod.set(null);
        return;
    }
    segmentValues.set(Object.fromEntries(dateValues));
}
/**
 * Determines if the element with the provided id is the first focusable
 * segment in the date field with the provided fieldId.
 *
 * @param id - The id of the element to check if it's the first segment
 * @param fieldId - The id of the date field associated with the segment
 */
export function isFirstSegment(id, fieldId) {
    if (!isBrowser)
        return false;
    const segments = getSegments(fieldId);
    return segments.length ? segments[0].id === id : false;
}
/**
 * Creates or updates a description element for a date field
 * which enables screen readers to read the date field's value.
 *
 * This element is hidden from view, and is portalled to the body
 * so it can be associated via `aria-describedby` and read by
 * screen readers as the user interacts with the date field.
 */
export function setDescription(id, formatter, value) {
    if (!isBrowser)
        return;
    const valueString = formatter.selectedDate(value);
    const el = document.getElementById(id);
    if (!el) {
        const div = document.createElement('div');
        div.style.cssText = styleToString({
            display: 'none',
        });
        div.id = id;
        div.innerText = `Selected Date: ${valueString}`;
        document.body.appendChild(div);
    }
    else {
        el.innerText = `Selected Date: ${valueString}`;
    }
}
/**
 * Removes the description element for the date field with
 * the provided ID. This function should be called when the
 * date field is unmounted.
 */
export function removeDescriptionElement(id) {
    if (!isBrowser)
        return;
    const el = document.getElementById(id);
    if (!el)
        return;
    document.body.removeChild(el);
}
