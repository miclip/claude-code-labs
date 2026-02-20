import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import type { Plugin } from 'vite';
import type { ParsedDeck, ParsedSlide } from '../lib/types.js';

const VIRTUAL_MODULE_ID = 'virtual:slides';
const RESOLVED_ID = '\0virtual:slides';

async function markdownToHtml(md: string): Promise<string> {
	const result = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(md);
	return String(result);
}

interface SlideMeta {
	type?: ParsedSlide['type'];
	theme?: ParsedSlide['theme'];
}

function parseSlideMeta(content: string): SlideMeta {
	const match = content.match(/<!--\s*slide:\s*(\{[^}]+\})\s*-->/);
	if (!match) return {};
	try {
		return JSON.parse(match[1]);
	} catch {
		return {};
	}
}

async function parseDeck(filePath: string): Promise<ParsedDeck> {
	const raw = readFileSync(filePath, 'utf-8');
	const { data: frontmatter, content } = matter(raw);

	// Split on `\n---\n` to get individual slides
	const rawSlides = content.split(/\n---\n/);

	const slides: ParsedSlide[] = [];
	for (let i = 0; i < rawSlides.length; i++) {
		const raw = rawSlides[i].trim();
		if (!raw) continue;

		const meta = parseSlideMeta(raw);
		const bodyMd = raw
			.replace(/<!--\s*slide:\s*\{[^}]+\}\s*-->/, '')
			.trim();
		const html = await markdownToHtml(bodyMd);

		slides.push({
			index: slides.length,
			type: meta.type ?? 'content',
			theme: meta.theme ?? 'light',
			html
		});
	}

	return {
		slug: frontmatter.slug ?? filePath.split('/').pop()?.replace('.md', '') ?? 'unknown',
		title: frontmatter.title ?? 'Untitled Deck',
		description: frontmatter.description ?? '',
		slides
	};
}

export function slidesParserPlugin(): Plugin {
	let slidesDir: string;

	return {
		name: 'vite-plugin-slides-parser',
		configResolved(config) {
			slidesDir = join(config.root, 'slides');
		},
		resolveId(id) {
			if (id === VIRTUAL_MODULE_ID) return RESOLVED_ID;
		},
		async load(id) {
			if (id !== RESOLVED_ID) return;

			let files: string[];
			try {
				files = readdirSync(slidesDir).filter((f) => f.endsWith('.md'));
			} catch {
				files = [];
			}

			const decks: ParsedDeck[] = [];
			for (const file of files) {
				const deck = await parseDeck(join(slidesDir, file));
				decks.push(deck);
			}

			return `export const decks = ${JSON.stringify(decks)};`;
		},
		handleHotUpdate({ file, server }) {
			if (file.includes('/slides/') && file.endsWith('.md')) {
				const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
				if (mod) {
					server.moduleGraph.invalidateModule(mod);
					server.ws.send({ type: 'full-reload' });
				}
			}
		}
	};
}
