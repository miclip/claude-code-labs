<script lang="ts">
	import { sidebarOpen } from '$lib/stores/ui';
</script>

<header class="mobile-header">
	<button class="hamburger" onclick={() => sidebarOpen.update((v) => !v)} aria-label="Toggle menu">
		<span class="hamburger-line"></span>
		<span class="hamburger-line"></span>
		<span class="hamburger-line"></span>
	</button>
</header>

<style>
	.mobile-header {
		display: none;
	}

	@media (max-width: 768px) {
		.mobile-header {
			display: flex;
			align-items: center;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			height: var(--header-height);
			background: white;
			border-bottom: 1px solid var(--light-border);
			padding: 0 1rem;
			z-index: 50;
		}

		.hamburger {
			display: flex;
			flex-direction: column;
			gap: 4px;
			padding: 0.5rem;
			background: none;
			border: none;
			cursor: pointer;
		}

		.hamburger-line {
			width: 20px;
			height: 2px;
			background: var(--text-primary);
			border-radius: 1px;
		}
	}
</style>
