<script lang="ts">
	import SlideViewer from '$lib/components/slides/SlideViewer.svelte';

	let { data } = $props();
	const { deck } = data;
</script>

<svelte:head>
	<title>{deck.title} — Slide Preview</title>
</svelte:head>

<div class="preview-page">
	<header class="preview-header">
		<div class="header-inner">
			<a href="/" class="back-link">← Back</a>
			<div class="deck-meta">
				<span class="deck-title">{deck.title}</span>
				<span class="deck-count">{deck.slides.length} slides</span>
			</div>
			<span class="preview-badge">Preview — placeholders shown as-is</span>
		</div>
	</header>

	<main class="viewer-wrap">
		<SlideViewer slides={deck.slides} />
	</main>
</div>

<style>
	.preview-page {
		min-height: 100vh;
		background: var(--dark);
		display: flex;
		flex-direction: column;
	}

	.preview-header {
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

	.deck-count {
		color: var(--text-muted);
		font-size: 0.8rem;
	}

	.preview-badge {
		color: var(--orange);
		font-size: 0.75rem;
		font-family: var(--font-mono);
		background: rgba(217, 119, 87, 0.1);
		padding: 0.2rem 0.6rem;
		border-radius: var(--radius);
		border: 1px solid rgba(217, 119, 87, 0.25);
		white-space: nowrap;
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
