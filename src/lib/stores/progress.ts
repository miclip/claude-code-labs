import { writable, derived, get } from 'svelte/store';
import { supabase } from '$lib/supabase';
import type { Progress } from '$lib/types';

export const completedSteps = writable<Map<string, Progress>>(new Map());

export const completedStepIds = derived(completedSteps, ($steps) => new Set($steps.keys()));

export async function loadProgress(participantId: string) {
	if (!supabase) return;
	const { data, error } = await supabase
		.from('progress')
		.select('*')
		.eq('participant_id', participantId);
	if (error) {
		console.error('Failed to load progress:', error);
		return;
	}
	const map = new Map<string, Progress>();
	for (const row of data as Progress[]) {
		map.set(row.step_id, row);
	}
	completedSteps.set(map);
}

export async function completeStep(
	participantId: string,
	sessionId: string,
	stepId: string,
	points: number
): Promise<boolean> {
	// Optimistic update
	const prev = new Map(get(completedSteps));
	const optimistic: Progress = {
		id: crypto.randomUUID(),
		participant_id: participantId,
		session_id: sessionId,
		step_id: stepId,
		points,
		completed_at: new Date().toISOString()
	};
	const next = new Map(prev);
	next.set(stepId, optimistic);
	completedSteps.set(next);

	if (!supabase) return true;

	const { data, error } = await supabase
		.from('progress')
		.upsert(
			{
				participant_id: participantId,
				session_id: sessionId,
				step_id: stepId,
				points
			},
			{ onConflict: 'participant_id,step_id' }
		)
		.select()
		.single();

	if (error) {
		console.error('Failed to complete step:', error);
		completedSteps.set(prev);
		return false;
	}

	const updated = new Map(get(completedSteps));
	updated.set(stepId, data as Progress);
	completedSteps.set(updated);
	return true;
}

export async function uncompleteStep(participantId: string, stepId: string): Promise<boolean> {
	const prev = new Map(get(completedSteps));
	const next = new Map(prev);
	next.delete(stepId);
	completedSteps.set(next);

	if (!supabase) return true;

	const { error } = await supabase
		.from('progress')
		.delete()
		.eq('participant_id', participantId)
		.eq('step_id', stepId);

	if (error) {
		console.error('Failed to uncomplete step:', error);
		completedSteps.set(prev);
		return false;
	}
	return true;
}
