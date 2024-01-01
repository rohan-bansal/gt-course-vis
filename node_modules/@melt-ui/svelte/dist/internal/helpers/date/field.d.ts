/**
 * Handles segment navigation based on the provided keyboard event and field ID.
 *
 * @param e - The keyboard event
 * @param fieldId - The ID of the field we're navigating within
 */
export declare function handleSegmentNavigation(e: KeyboardEvent, fieldId: string): void;
/**
 * Retrieves the next segment in the list of segments relative to the provided node.
 *
 * @param node - The node we're starting from
 * @param segments - The list of candidate segments to navigate through
 */
export declare function getNextSegment(node: HTMLElement, segments: HTMLElement[]): HTMLElement | null;
/**
 * Retrieves the previous segment in the list of segments relative to the provided node.
 *
 * @param node - The node we're starting from
 * @param segments - The list of candidate segments to navigate through
 */
export declare function getPrevSegment(node: HTMLElement, segments: HTMLElement[]): HTMLElement | null;
/**
 * Retrieves an object containing the next and previous segments relative to the current node.
 *
 * @param node - The node we're starting from
 * @param fieldId - The ID of the field we're navigating within
 */
export declare function getPrevNextSegments(node: HTMLElement, fieldId: string): {
    next: HTMLElement | null;
    prev: HTMLElement | null;
};
/**
 * Shifts the focus to the next segment in the list of segments
 * within the field identified by the provided ID.
 */
export declare function moveToNextSegment(e: KeyboardEvent, fieldId: string): void;
export declare function isSegmentNavigationKey(key: string): boolean;
/**
 * Retrieves all the interactive segments within the field identified by the provided ID.
 */
export declare function getSegments(id: string): HTMLElement[];
/**
 * Get the first interactive segment within the field identified by the provided ID.
 */
export declare function getFirstSegment(id: string): HTMLElement;
