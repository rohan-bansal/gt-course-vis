/**
 * A function that generates a random id
 * @returns An id
 */
export declare function generateId(): string;
export type IdObj<T extends readonly string[]> = Expand<{
    [K in T[number]]: string;
}>;
export declare function generateIds<T extends readonly string[]>(args: T): IdObj<T>;
export declare function stringifiedIdObjType<T extends readonly string[]>(args: T): string;
