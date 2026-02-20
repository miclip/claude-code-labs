import type { PageLoad } from './$types';
import { decks } from 'virtual:slides';
import { error } from '@sveltejs/kit';

export const load: PageLoad = ({ params }) => {
	const deck = decks.find((d) => d.slug === params.slug);
	if (!deck) error(404, `Slide deck "${params.slug}" not found`);
	return { deck };
};
