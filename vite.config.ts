import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { labParserPlugin } from './src/build/parse-labs.js';

export default defineConfig({
	plugins: [labParserPlugin(), sveltekit()]
});
