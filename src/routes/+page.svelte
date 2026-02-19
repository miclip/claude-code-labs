<script lang="ts">
	import LabLibrary from '$lib/components/landing/LabLibrary.svelte';
</script>

<svelte:head>
	<title>Claude Code Labs</title>
</svelte:head>

<div class="landing dark-theme">
	<div class="landing-header">
		<div class="logo-mark">✦</div>
		<h1>Claude Code Labs</h1>
		<p class="subtitle">Hands-on workshops for learning Claude Code with real-world projects</p>
	</div>
	<LabLibrary />
</div>

<style>
	.landing {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 3rem 1.5rem;
	}

	.landing-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.logo-mark {
		font-size: 2.5rem;
		color: var(--orange);
		margin-bottom: 0.75rem;
	}

	h1 {
		font-size: 2rem;
		color: var(--orange);
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: var(--text-muted);
		font-size: 1rem;
	}
</style>
