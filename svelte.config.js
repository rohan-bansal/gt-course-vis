import { preprocessMeltUI, sequence } from '@melt-ui/pp';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
/** @type {import('@sveltejs/kit').Config}*/
const config = {
	kit: {
		// Deployed on Vercel. The function runtime follows the build's Node version (.nvmrc).
		adapter: adapter()
	},
	preprocess: sequence([vitePreprocess(), preprocessMeltUI()])
};
export default config;
