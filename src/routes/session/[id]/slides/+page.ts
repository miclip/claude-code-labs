import type { PageLoad } from './$types';
import { decks } from 'virtual:slides';
import { fetchSession } from '$lib/stores/session';
import { error } from '@sveltejs/kit';

export const prerender = false;

export const load: PageLoad = async ({ params }) => {
	const session = await fetchSession(params.id);
	if (!session) error(404, 'Session not found');

	const deck = session.slide_deck ? decks.find((d) => d.slug === session.slide_deck) : null;
	if (!deck) error(404, 'No slide deck configured for this session');

	const placeholders: Record<string, string> = {
		speakers: session.speaker_names ?? '',
		speaker_names: session.speaker_names ?? '',
		event_name: session.event_name ?? '',
		company_name: session.company_name ?? '',
		wifi_ssid: session.wifi_ssid ?? '',
		wifi_password: session.wifi_password ?? '',
		api_credit_url: session.api_credit_url ?? '',
		lab_title: session.lab_title ?? ''
	};

	return { session, deck, placeholders };
};
