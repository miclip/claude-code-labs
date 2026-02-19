<script lang="ts">
	import { supabase } from '$lib/supabase';
	import AdminLogin from './AdminLogin.svelte';
	import AdminDashboard from './AdminDashboard.svelte';
	import type { Session, ParsedLab } from '$lib/types';

	let { session, lab }: { session: Session; lab: ParsedLab } = $props();

	let isAuthenticated = $state(false);

	function handleAuth() {
		isAuthenticated = true;
	}
</script>

<div class="admin-page">
	{#if !session.trainer_passphrase_hash || isAuthenticated}
		<AdminDashboard {session} {lab} />
	{:else}
		<AdminLogin sessionId={session.id} onAuth={handleAuth} />
	{/if}
</div>

<style>
	.admin-page {
		animation: taskSlideIn 0.3s ease;
	}
</style>
