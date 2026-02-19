<script lang="ts">
	import '../app.css';
	import ToastContainer from '$lib/components/shared/ToastContainer.svelte';
	import ClawdCelebration from '$lib/components/shared/ClawdCelebration.svelte';

	let { children } = $props();
</script>

{@render children()}
<ToastContainer />
<ClawdCelebration />
<div class="grain-overlay"></div>
