export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6')
];

export const server_loads = [2];

export const dictionary = {
		"/": [~4],
		"/(withNavBar)/courses/[slug]": [~5,[2],[3]],
		"/(withNavBar)/courses/[slug]/[slug]": [~6,[2],[3]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';