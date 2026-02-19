import { writable } from 'svelte/store';
import type { Toast } from '$lib/types';

export const sidebarOpen = writable(false);
export const castMode = writable(false);
export const expandedSteps = writable<Set<string>>(new Set());
export const showClawd = writable(false);
export const activeView = writable<'workshop' | 'leaderboard' | 'admin'>('workshop');

// Toast management
export const toasts = writable<Toast[]>([]);

let toastCounter = 0;

export function addToast(message: string, type: Toast['type'] = 'info', duration = 3000) {
	const id = `toast-${++toastCounter}`;
	const toast: Toast = { id, message, type };
	toasts.update((t) => [...t, toast]);

	if (duration > 0) {
		setTimeout(() => removeToast(id), duration);
	}
	return id;
}

export function removeToast(id: string) {
	toasts.update((t) => t.filter((toast) => toast.id !== id));
}

export function toggleStep(stepId: string) {
	expandedSteps.update((s) => {
		const next = new Set(s);
		if (next.has(stepId)) {
			next.delete(stepId);
		} else {
			next.add(stepId);
		}
		return next;
	});
}

export function triggerClawd() {
	showClawd.set(true);
	setTimeout(() => showClawd.set(false), 2500);
}
