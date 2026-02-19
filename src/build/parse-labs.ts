import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import type { Plugin } from 'vite';
import type { ParsedLab, LabStep, LabStepMeta } from '../lib/types.js';

const VIRTUAL_MODULE_ID = 'virtual:labs';
const RESOLVED_ID = '\0virtual:labs';

async function markdownToHtml(md: string): Promise<string> {
	const result = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(md);
	return String(result);
}

function parseStepMeta(content: string): LabStepMeta | null {
	const match = content.match(/<!--\s*step:\s*(\{[^}]+\})\s*-->/);
	if (!match) return null;
	try {
		return JSON.parse(match[1]);
	} catch {
		return null;
	}
}

async function parseLab(filePath: string): Promise<ParsedLab> {
	const raw = readFileSync(filePath, 'utf-8');
	const { data: frontmatter, content } = matter(raw);

	// Split on ## headings
	const sections = content.split(/^## /m);
	const introMd = sections[0].trim();
	const intro_html = await markdownToHtml(introMd);

	const steps: LabStep[] = [];
	for (let i = 1; i < sections.length; i++) {
		const section = sections[i];
		const titleMatch = section.match(/^(.+)\n/);
		const title = titleMatch ? titleMatch[1].trim() : `Step ${i}`;
		const meta = parseStepMeta(section);
		const stepMd = section
			.replace(/^.+\n/, '')
			.replace(/<!--\s*step:\s*\{[^}]+\}\s*-->/, '')
			.trim();
		const html = await markdownToHtml(stepMd);

		steps.push({
			id: meta?.id ?? `step-${i}`,
			title,
			points: meta?.points ?? 10,
			category: meta?.category ?? 'core',
			html
		});
	}

	const total_points = steps.reduce((sum, s) => sum + s.points, 0);

	return {
		slug: frontmatter.slug ?? filePath.split('/').pop()?.replace('.md', '') ?? 'unknown',
		title: frontmatter.title ?? 'Untitled Lab',
		description: frontmatter.description ?? '',
		difficulty: frontmatter.difficulty ?? 'beginner',
		estimated_duration: frontmatter.estimated_duration ?? '',
		prerequisites: frontmatter.prerequisites ?? [],
		tags: frontmatter.tags ?? [],
		intro_html,
		steps,
		total_points
	};
}

export function labParserPlugin(): Plugin {
	let labsDir: string;

	return {
		name: 'vite-plugin-lab-parser',
		configResolved(config) {
			labsDir = join(config.root, 'labs');
		},
		resolveId(id) {
			if (id === VIRTUAL_MODULE_ID) return RESOLVED_ID;
		},
		async load(id) {
			if (id !== RESOLVED_ID) return;

			let files: string[];
			try {
				files = readdirSync(labsDir).filter((f) => f.endsWith('.md'));
			} catch {
				files = [];
			}

			const labs: ParsedLab[] = [];
			for (const file of files) {
				const lab = await parseLab(join(labsDir, file));
				labs.push(lab);
			}

			return `export const labs = ${JSON.stringify(labs)};`;
		},
		handleHotUpdate({ file, server }) {
			if (file.includes('/labs/') && file.endsWith('.md')) {
				const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
				if (mod) {
					server.moduleGraph.invalidateModule(mod);
					server.ws.send({ type: 'full-reload' });
				}
			}
		}
	};
}
