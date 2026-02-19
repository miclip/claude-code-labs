<script lang="ts">
	import { showClawd } from '$lib/stores/ui';
</script>

{#if $showClawd}
	<div class="clawd-overlay">
		<div class="clawd-character">
			<span class="clawd-emoji">🎉</span>
			<span class="clawd-text">Nice work!</span>
		</div>
	</div>
{/if}

<style>
	.clawd-overlay {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		z-index: 2000;
	}

	.clawd-character {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		animation: clawdBounce 0.6s ease forwards;
	}

	.clawd-emoji {
		font-size: 4rem;
	}

	.clawd-text {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--orange);
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		background: white;
		padding: 0.375rem 1rem;
		border-radius: 20px;
		box-shadow: var(--shadow-lg);
	}
</style>
