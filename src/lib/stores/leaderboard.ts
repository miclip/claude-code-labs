import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import type { LeaderboardEntry } from '$lib/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

export const leaderboard = writable<LeaderboardEntry[]>([]);
export const leaderboardLoading = writable(false);

let channel: RealtimeChannel | null = null;

export async function fetchLeaderboard(sessionId: string) {
	if (!supabase) return;
	leaderboardLoading.set(true);
	const { data, error } = await supabase
		.from('leaderboard')
		.select('*')
		.eq('session_id', sessionId)
		.order('total_points', { ascending: false });

	if (error) {
		console.error('Failed to fetch leaderboard:', error);
	} else {
		leaderboard.set(data as LeaderboardEntry[]);
	}
	leaderboardLoading.set(false);
}

export function subscribeToProgress(sessionId: string) {
	if (!supabase) return;
	unsubscribeFromProgress();

	channel = supabase
		.channel(`progress:${sessionId}`)
		.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: 'progress',
				filter: `session_id=eq.${sessionId}`
			},
			() => {
				fetchLeaderboard(sessionId);
			}
		)
		.subscribe();
}

export function unsubscribeFromProgress() {
	if (channel) {
		channel.unsubscribe();
		channel = null;
	}
}
