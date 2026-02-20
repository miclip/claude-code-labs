import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { labParserPlugin } from './src/build/parse-labs';
import { slidesParserPlugin } from './src/build/parse-slides';

export default defineConfig({
	plugins: [labParserPlugin(), slidesParserPlugin(), sveltekit()]
});
