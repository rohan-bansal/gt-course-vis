import { nanoid } from 'nanoid/non-secure';
/**
 * A function that generates a random id
 * @returns An id
 */
export function generateId() {
    return nanoid(10);
}
export function generateIds(args) {
    return args.reduce((acc, curr) => {
        acc[curr] = generateId();
        return acc;
    }, {});
}
export function stringifiedIdObjType(args) {
    return `Record<${args.map((arg) => `"${arg}"`).join(' | ')}, string>`;
}
