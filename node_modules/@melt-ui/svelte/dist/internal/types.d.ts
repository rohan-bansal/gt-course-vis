import type { ActionReturn } from 'svelte/action';
export type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2 ? Y : N;
export type WrapWithCustomEvent<T> = {
    [K in keyof T]: CustomEvent<T[K]>;
};
export type Nullable<T> = T | null;
export type ValueOf<T> = T[keyof T];
export type Arrayable<T> = T | T[];
export type CreatePaginationProps = {
    count: number;
    perPage?: number;
};
type NullableKeys<T> = {
    [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];
export type Defaults<T> = {
    [K in NullableKeys<T>]?: T[K];
};
export type TextDirection = 'ltr' | 'rtl';
export type Orientation = 'horizontal' | 'vertical';
export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
export type Expand<T> = T extends object ? T extends infer O ? {
    [K in keyof O]: O[K];
} : never : T;
export type ExpandDeep<T> = T extends object ? T extends infer O ? {
    [K in keyof O]: ExpandDeep<O[K]>;
} : never : T;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
export type BuilderReturn<T extends (...args: any) => any> = {
    [P in keyof ReturnType<T>]: ReturnType<T>[P];
};
export type EventHandler<T extends Event = Event> = (event: T) => void;
export type MeltEvent<E extends Event> = CustomEvent<{
    originalEvent: E;
}>;
export type MeltEventHandler<E extends Event> = EventHandler<Expand<Omit<MeltEvent<E>, 'initCustomEvent'>>>;
export type MeltActionReturn<Events extends keyof HTMLElementEventMap> = ActionReturn<undefined, {
    [K in Events as `on:m-${string & K}`]?: K extends keyof HTMLElementEventMap ? MeltEventHandler<HTMLElementEventMap[K]> : never;
}>;
type CustomMeltComponentEvents<Events extends keyof HTMLElementEventMap> = {
    [K in Events as `m-${string & K}`]?: K extends keyof HTMLElementEventMap ? MeltEventHandler<HTMLElementEventMap[K]> : never;
};
export type InternalCustomEvents<Events extends keyof HTMLElementEventMap> = {
    [K in Events as K]?: K extends keyof HTMLElementEventMap ? EventHandler<HTMLElementEventMap[K]> : never;
};
type ElementEvents<T> = T extends ReadonlyArray<infer U> ? U : never;
export type GroupedEvents<T> = {
    [K in keyof T]: ElementEvents<T[K]>;
};
export type MeltComponentEvents<T> = {
    [K in keyof T]: T[K] extends keyof HTMLElementEventMap ? CustomMeltComponentEvents<T[K]> : never;
};
export type WhenTrue<TrueOrFalse, IfTrue, IfFalse, IfNeither = IfTrue | IfFalse> = [
    TrueOrFalse
] extends [true] ? IfTrue : [TrueOrFalse] extends [false] ? IfFalse : IfNeither;
export type RenameProperties<T, NewNames extends Partial<Record<keyof T, string>>> = Expand<{
    [K in keyof T as K extends keyof NewNames ? NewNames[K] extends PropertyKey ? NewNames[K] : K : K]: T[K];
}>;
export type NonEmptyArray<T> = [T, ...T[]];
export {};
