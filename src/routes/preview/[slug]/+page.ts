import type { PageLoad } from './$types';
import { labs } from 'virtual:labs';
import { error } from '@sveltejs/kit';

export const load: PageLoad = ({ params }) => {
	const lab = labs.find((l) => l.slug === params.slug);
	if (!lab) error(404, `Lab "${params.slug}" not found`);
	return { lab };
};
