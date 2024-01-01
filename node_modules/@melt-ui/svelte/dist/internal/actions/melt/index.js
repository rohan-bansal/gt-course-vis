/**
 * A special action for Melt UI's preprocessor `@melt-ui/pp`.
 *
 * @see https://www.melt-ui.com/docs/preprocessor
 *
 * @example
 * ```svelte
 * <script>
 * 	import { createLabel, melt } from '@melt-ui/svelte';
 * 	const { elements: { root } } = createLabel();
 * </script>
 *
 * <label use:melt={$root} />
 * ```
 */
export function melt(node, params) {
    throw new Error("[MELTUI ERROR]: The `use:melt` action cannot be used without MeltUI's Preprocessor. See: https://www.melt-ui.com/docs/preprocessor");
}
