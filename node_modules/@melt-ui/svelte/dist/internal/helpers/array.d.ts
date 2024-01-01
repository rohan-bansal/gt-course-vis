/**
 * Returns the element some number before the given index. If the target index is out of bounds:
 *   - If looping is disabled, the first element will be returned.
 *   - If looping is enabled, the last element will be returned.
 * @param array the array.
 * @param currentIndex the index of the current element.
 * @param increment the number of elements to move forward.
 * @param loop loop to the beginning of the array if the target index is out of bounds?
 */
export declare function back<T>(array: T[], index: number, increment: number, loop?: boolean): T;
/**
 * Returns the element some number after the given index. If the target index is out of bounds:
 *   - If looping is disabled, the last element will be returned.
 *   - If looping is enabled, the first element will be returned.
 * @param array the array.
 * @param currentIndex the index of the current element.
 * @param increment the number of elements to move forward.
 * @param loop loop to the beginning of the array if the target index is out of bounds?
 */
export declare function forward<T>(array: T[], index: number, increment: number, loop?: boolean): T;
/**
 * Returns the array element after to the given index.
 * @param array the array.
 * @param currentIndex the index of the current element.
 * @param loop loop to the beginning of the array if the next index is out of bounds?
 */
export declare function next<T>(array: T[], index: number, loop?: boolean): T;
/**
 * Returns the array element prior to the given index.
 * @param array the array.
 * @param currentIndex the index of the current element.
 * @param loop loop to the end of the array if the previous index is out of bounds?
 */
export declare function prev<T>(array: T[], currentIndex: number, loop?: boolean): T;
/**
 * Returns the last element in an array.
 * @param array the array.
 */
export declare function last<T>(array: T[]): T;
/**
 * Wraps an array around itself at a given starting index.
 * @example ```ts
 * wrapArray(['a', 'b', 'c', 'd'], 2);
 * // ['c', 'd', 'a', 'b']
 * ```
 * @see https://github.com/radix-ui/primitives
 */
export declare function wrapArray<T>(array: T[], startIndex: number): T[];
/**
 * Toggles an item in an array. If the item is already in the array,
 * it is removed. Otherwise, it is added.
 * @param item The item to toggle.
 * @param array The array to toggle the item in.
 * @returns The updated array with the item toggled.
 * @template T The type of the items in the array.
 * @example ```typescript
 * const arr = [1, 2, 3];
 * const newArr = toggle(2, arr);
 * // newArr = [1, 3]
 * ```
 */
export declare function toggle<T>(item: T, array: T[], compare?: (itemA: T, itemB: T) => boolean): T[];
/**
 * Splits an array into chunks of a given size.
 * @param arr The array to split.
 * @param size The size of each chunk.
 * @returns An array of arrays, where each sub-array has `size` elements from the original array.
 * @example ```ts
 * const arr = [1, 2, 3, 4, 5, 6, 7, 8];
 * const chunks = chunk(arr, 3);
 * // chunks = [[1, 2, 3], [4, 5, 6], [7, 8]]
 * ```
 */
export declare function chunk<T>(arr: T[], size: number): T[][];
/**
 * Checks if the given index is valid for the given array.
 *
 * @param index - The index to check
 * @param arr - The array to check
 */
export declare function isValidIndex(index: number, arr: unknown[]): boolean;
