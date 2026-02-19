import type { PageLoad } from './$types';
import { labs } from 'virtual:labs';
import { fetchSession } from '$lib/stores/session';

export const load: PageLoad = async ({ params }) => {
	const session = await fetchSession(params.id);
	const lab = session ? labs.find((l) => l.slug === session.lab_slug) : null;
	return { sessionId: params.id, session, lab };
};
