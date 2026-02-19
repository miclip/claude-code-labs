<script lang="ts">
	import LabHeader from '$lib/components/workshop/LabHeader.svelte';
	import ProgressBar from '$lib/components/workshop/ProgressBar.svelte';
	import ReferenceCard from '$lib/components/workshop/ReferenceCard.svelte';
	import StepCard from '$lib/components/workshop/StepCard.svelte';
	import { base } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const lab = data.lab;

	let coreSteps = $derived(lab.steps.filter((s) => s.category === 'core'));
	let bonusSteps = $derived(lab.steps.filter((s) => s.category === 'bonus'));
</script>

<svelte:head>
	<title>Preview: {lab.title}</title>
</svelte:head>

<div class="preview-layout">
	<aside class="preview-sidebar">
		<a href="{base}/" class="brand">
			<span class="brand-mark">✦</span>
			<div>
				<div class="brand-name">Claude Code</div>
				<div class="brand-sub">Labs</div>
			</div>
		</a>
		<div class="preview-badge">Preview Mode</div>
		<p class="preview-hint">Viewing lab content without a live session. Step completion is local only.</p>
	</aside>

	<main class="preview-main">
		<LabHeader {lab} />
		<ProgressBar {lab} />
		<ReferenceCard />

		{#if coreSteps.length > 0}
			<section class="step-section">
				<h3 class="section-label">Core Steps</h3>
				{#each coreSteps as step, i}
					<StepCard {step} index={i + 1} sessionId="preview" />
				{/each}
			</section>
		{/if}

		{#if bonusSteps.length > 0}
			<section class="step-section">
				<h3 class="section-label">Bonus Challenges</h3>
				{#each bonusSteps as step, i}
					<StepCard {step} index={coreSteps.length + i + 1} sessionId="preview" />
				{/each}
			</section>
		{/if}
	</main>
</div>

<style>
	.preview-layout {
		min-height: 100vh;
	}

	.preview-sidebar {
		position: fixed;
		top: 0;
		left: 0;
		width: var(--sidebar-width);
		height: 100vh;
		background: var(--dark);
		color: var(--light);
		padding: 1.25rem 1rem;
		display: flex;
		flex-direction: column;
		border-right: 1px solid var(--dark-border);
		z-index: 100;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		text-decoration: none;
		color: var(--light);
		margin-bottom: 1.5rem;
	}

	.brand-mark {
		font-size: 1.5rem;
		color: var(--orange);
	}

	.brand-name {
		font-size: 0.9rem;
		font-weight: 600;
	}

	.brand-sub {
		font-size: 0.7rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.preview-badge {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.3rem 0.6rem;
		background: rgba(255, 152, 0, 0.15);
		color: #ff9800;
		border-radius: 4px;
		text-align: center;
		margin-bottom: 0.75rem;
	}

	.preview-hint {
		font-size: 0.8rem;
		color: var(--text-muted);
		line-height: 1.5;
	}

	.preview-main {
		margin-left: var(--sidebar-width);
		padding: 2rem 3rem;
		max-width: calc(900px + var(--sidebar-width));
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

	@media (max-width: 768px) {
		.preview-sidebar {
			display: none;
		}

		.preview-main {
			margin-left: 0;
			padding: 1.5rem 1rem;
			max-width: none;
		}
	}
</style>
