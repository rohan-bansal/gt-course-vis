export type FocusTarget = string | HTMLElement | SVGElement | null;
export type FocusProp = FocusTarget | ((defaultEl?: HTMLElement | null) => FocusTarget);
type HandleFocusArgs = {
    prop?: FocusProp;
    defaultEl: HTMLElement | null;
};
export declare function handleFocus(args: HandleFocusArgs): Promise<void>;
export {};
