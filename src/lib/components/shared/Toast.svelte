<script lang="ts">
	import { removeToast } from '$lib/stores/ui';
	import type { Toast } from '$lib/types';

	let { toast }: { toast: Toast } = $props();
</script>

<div class="toast toast-{toast.type}" role="alert">
	<span class="toast-message">{toast.message}</span>
	<button class="toast-close" onclick={() => removeToast(toast.id)} aria-label="Dismiss">×</button>
</div>

<style>
	.toast {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: var(--dark);
		color: var(--light);
		border-radius: var(--radius);
		box-shadow: var(--shadow-lg);
		animation: toastIn 0.3s ease;
		font-size: 0.875rem;
		border-left: 3px solid;
	}

	.toast-success { border-left-color: var(--success); }
	.toast-error { border-left-color: var(--error); }
	.toast-info { border-left-color: var(--info); }

	.toast-message {
		flex: 1;
	}

	.toast-close {
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		font-size: 1.25rem;
		padding: 0;
		line-height: 1;
	}

	.toast-close:hover {
		color: var(--light);
	}
</style>
