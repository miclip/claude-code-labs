<script lang="ts">
	import LabHeader from './LabHeader.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import ReferenceCard from './ReferenceCard.svelte';
	import StepCard from './StepCard.svelte';
	import type { ParsedLab, Session } from '$lib/types';

	let { lab, session }: { lab: ParsedLab; session: Session } = $props();

	let coreSteps = $derived(lab.steps.filter((s) => s.category === 'core'));
	let bonusSteps = $derived(lab.steps.filter((s) => s.category === 'bonus'));
</script>

<div class="workshop">
	<LabHeader {lab} />
	<ProgressBar {lab} />
	<ReferenceCard />

	{#if coreSteps.length > 0}
		<section class="step-section">
			<h3 class="section-label">Core Steps</h3>
			{#each coreSteps as step, i}
				<StepCard {step} index={i + 1} sessionId={session.id} />
			{/each}
		</section>
	{/if}

	{#if bonusSteps.length > 0}
		<section class="step-section">
			<h3 class="section-label">Bonus Challenges</h3>
			{#each bonusSteps as step, i}
				<StepCard {step} index={coreSteps.length + i + 1} sessionId={session.id} />
			{/each}
		</section>
	{/if}
</div>

<style>
	.workshop {
		animation: taskSlideIn 0.3s ease;
	}

	.step-section {
		margin-top: 2rem;
	}

	.section-label {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		margin-bottom: 0.75rem;
	}
</style>
