<script lang="ts">
	import { completedStepIds } from '$lib/stores/progress';
	import { completeStep, uncompleteStep } from '$lib/stores/progress';
	import { currentParticipant } from '$lib/stores/session';
	import { toggleStep, expandedSteps, triggerClawd, addToast } from '$lib/stores/ui';
	import StepContent from './StepContent.svelte';
	import type { LabStep } from '$lib/types';

	let { step, index, sessionId }: { step: LabStep; index: number; sessionId: string } = $props();

	let isCompleted = $derived($completedStepIds.has(step.id));
	let isExpanded = $derived($expandedSteps.has(step.id));

	let isPreview = $derived(sessionId === 'preview');

	async function handleComplete() {
		const participantId = isPreview ? 'preview' : $currentParticipant?.id;
		if (!participantId) return;

		const ok = await completeStep(participantId, sessionId, step.id, step.points);
		if (ok) {
			addToast(`+${step.points} pts — Step completed!`, 'success');
			triggerClawd();
		} else {
			addToast('Failed to save progress.', 'error');
		}
	}

	async function handleUndo() {
		const participantId = isPreview ? 'preview' : $currentParticipant?.id;
		if (!participantId) return;

		const ok = await uncompleteStep(participantId, step.id);
		if (ok) {
			addToast('Step uncompleted.', 'info');
		}
	}
</script>

<div class="step-card" class:completed={isCompleted} class:expanded={isExpanded}>
	<button class="step-header" onclick={() => toggleStep(step.id)}>
		<div class="step-status">
			{#if isCompleted}
				<span class="status-icon done">✓</span>
			{:else}
				<span class="status-icon pending">{index}</span>
			{/if}
		</div>
		<div class="step-info">
			<h3 class="step-title">{step.title}</h3>
		</div>
		<div class="step-meta-right">
			<span class="points-badge">{step.points} pts</span>
			<span class="chevron" class:open={isExpanded}>▸</span>
		</div>
	</button>

	{#if isExpanded}
		<div class="step-body">
			<StepContent html={step.html} />
			<div class="step-actions">
				{#if isCompleted}
					<button class="btn btn-secondary btn-sm" onclick={handleUndo}>Undo</button>
				{:else}
					<button class="btn btn-primary" onclick={handleComplete}>I'm done!</button>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.step-card {
		border: 1px solid var(--light-border);
		border-radius: var(--radius);
		margin-bottom: 0.625rem;
		overflow: hidden;
		animation: taskSlideIn 0.25s ease;
		transition: border-color 0.15s ease;
	}

	.step-card.completed {
		border-color: rgba(76, 175, 80, 0.3);
	}

	.step-card.expanded {
		border-color: var(--orange);
	}

	.step-header {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		background: white;
		border: none;
		cursor: pointer;
		font-family: inherit;
		text-align: left;
	}

	.step-card.completed .step-header {
		background: rgba(76, 175, 80, 0.03);
	}

	.step-header:hover {
		background: var(--light-surface);
	}

	.status-icon {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
		font-weight: 600;
		flex-shrink: 0;
	}

	.status-icon.pending {
		background: var(--light-surface);
		color: var(--text-secondary);
		border: 1px solid var(--light-border);
	}

	.status-icon.done {
		background: var(--success);
		color: white;
	}

	.step-info {
		flex: 1;
		min-width: 0;
	}

	.step-title {
		font-size: 0.925rem;
		font-weight: 500;
		color: var(--text-primary);
	}

	.step-card.completed .step-title {
		color: var(--text-secondary);
	}

	.step-meta-right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-shrink: 0;
	}

	.points-badge {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--orange);
		background: rgba(217, 119, 87, 0.08);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
	}

	.chevron {
		color: var(--text-muted);
		transition: transform 0.2s ease;
		font-size: 0.85rem;
	}

	.chevron.open {
		transform: rotate(90deg);
	}

	.step-body {
		padding: 0 1.25rem 1.25rem;
		border-top: 1px solid var(--light-border);
		animation: taskSlideIn 0.2s ease;
	}

	.step-actions {
		margin-top: 1.25rem;
		display: flex;
		gap: 0.5rem;
	}

	@media (max-width: 768px) {
		.step-body {
			padding: 0 0.875rem 1rem;
		}
	}
</style>
