<script lang="ts">
	import SlideViewer from '$lib/components/slides/SlideViewer.svelte';
	import { base } from '$app/paths';

	let { data } = $props();
	const { session, deck, placeholders } = data;
</script>

<svelte:head>
	<title>{deck.title}</title>
</svelte:head>

<div class="slides-page">
	<header class="slides-header">
		<div class="header-inner">
			<a href="{base}/session/{session.id}" class="back-link">← Back to session</a>
			<div class="deck-meta">
				<span class="deck-title">{deck.title}</span>
				{#if session.event_name}
					<span class="event-name">{session.event_name}</span>
				{/if}
			</div>
		</div>
	</header>

	<main class="viewer-wrap">
		<SlideViewer slides={deck.slides} {placeholders} />
	</main>
</div>

<style>
	.slides-page {
		min-height: 100vh;
		background: var(--dark);
		display: flex;
		flex-direction: column;
	}

	.slides-header {
		padding: 0.75rem 1.5rem;
		border-bottom: 1px solid var(--dark-border);
		flex-shrink: 0;
	}

	.header-inner {
		display: flex;
		align-items: center;
		gap: 1rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.back-link {
		color: var(--text-muted);
		font-size: 0.85rem;
		text-decoration: none;
		white-space: nowrap;
	}

	.back-link:hover {
		color: var(--orange);
	}

	.deck-meta {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.deck-title {
		color: var(--light);
		font-weight: 600;
		font-size: 0.95rem;
	}

	.event-name {
		color: var(--orange);
		font-size: 0.85rem;
	}

	.viewer-wrap {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.viewer-wrap :global(.slide-viewer) {
		max-width: min(1200px, calc(100vh * 16 / 9));
		width: 100%;
	}
</style>
