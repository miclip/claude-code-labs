<script lang="ts">
	import { completedSteps } from '$lib/stores/progress';
	import type { ParsedLab } from '$lib/types';

	let { lab }: { lab: ParsedLab } = $props();

	let stepsCompleted = $derived($completedSteps.size);
	let totalSteps = $derived(lab.steps.length);
	let pointsEarned = $derived(
		Array.from($completedSteps.values()).reduce((sum, p) => sum + p.points, 0)
	);
	let percentage = $derived(totalSteps > 0 ? (stepsCompleted / totalSteps) * 100 : 0);
</script>

<div class="progress-bar-wrapper">
	<div class="progress-info">
		<span class="step-count">{stepsCompleted} of {totalSteps} steps</span>
		<span class="point-count">{pointsEarned}/{lab.total_points} pts</span>
	</div>
	<div class="progress-track">
		<div class="progress-fill" style="width: {percentage}%"></div>
	</div>
</div>

<style>
	.progress-bar-wrapper {
		margin: 1.25rem 0;
	}

	.progress-info {
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		color: var(--text-secondary);
		margin-bottom: 0.375rem;
	}

	.point-count {
		font-weight: 600;
	}

	.progress-track {
		height: 6px;
		background: var(--light-surface);
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--orange), var(--orange-light));
		border-radius: 3px;
		transition: width 0.4s ease;
		background-size: 200% 100%;
		animation: gradientShift 3s ease infinite;
	}
</style>
