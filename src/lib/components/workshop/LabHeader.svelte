<script lang="ts">
	import type { ParsedLab } from '$lib/types';

	let { lab }: { lab: ParsedLab } = $props();
</script>

<div class="lab-header">
	<h1>{lab.title}</h1>
	{#if lab.description}
		<p class="description">{lab.description}</p>
	{/if}

	{#if lab.prerequisites.length > 0}
		<div class="prerequisites">
			<h3>Prerequisites</h3>
			<ul>
				{#each lab.prerequisites as prereq}
					<li>
						<span class="bullet">✦</span>
						{@html prereq}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if lab.intro_html}
		<div class="intro step-content">
			{@html lab.intro_html}
		</div>
	{/if}

	<div class="welcome-banner">
		<strong>Welcome to the workshop!</strong> Complete each step, work through the instructions, then click the "I'm done" button to earn points and climb the leaderboard.
	</div>
</div>

<style>
	.lab-header {
		margin-bottom: 1.5rem;
	}

	h1 {
		margin-bottom: 0.375rem;
	}

	.description {
		color: var(--text-secondary);
		margin-bottom: 1.25rem;
	}

	.prerequisites {
		background: var(--light-surface);
		border-radius: var(--radius);
		padding: 1.25rem;
		margin-bottom: 1.25rem;
	}

	.prerequisites h3 {
		margin-bottom: 0.5rem;
		font-size: 1rem;
	}

	.prerequisites ul {
		list-style: none;
		padding: 0;
	}

	.prerequisites li {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
		font-size: 0.9rem;
	}

	.bullet {
		color: var(--orange);
		font-size: 0.7rem;
		flex-shrink: 0;
	}

	.intro {
		margin-bottom: 1.25rem;
	}

	.welcome-banner {
		background: linear-gradient(135deg, rgba(217, 119, 87, 0.08), rgba(217, 119, 87, 0.03));
		border: 1px solid rgba(217, 119, 87, 0.2);
		border-radius: var(--radius);
		padding: 1rem 1.25rem;
		font-size: 0.9rem;
		color: var(--text-primary);
	}
</style>
