<script lang="ts">
	import { currentSession, currentParticipant } from '$lib/stores/session';
	import { loadProgress } from '$lib/stores/progress';
	import { subscribeToProgress, unsubscribeFromProgress, fetchLeaderboard } from '$lib/stores/leaderboard';
	import { activeView } from '$lib/stores/ui';
	import JoinForm from '$lib/components/session/JoinForm.svelte';
	import Workshop from '$lib/components/workshop/Workshop.svelte';
	import LeaderboardPage from '$lib/components/leaderboard/LeaderboardPage.svelte';
	import AdminPage from '$lib/components/admin/AdminPage.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import type { PageData } from './$types';
	import { onMount, onDestroy } from 'svelte';

	let { data }: { data: PageData } = $props();

	let mounted = $state(false);

	onMount(async () => {
		if (data.session) {
			currentSession.set(data.session);
			subscribeToProgress(data.session.id);
			fetchLeaderboard(data.session.id);

			// If participant exists in localStorage, reload their progress
			const participant = $currentParticipant;
			if (participant && participant.session_id === data.session.id) {
				await loadProgress(participant.id);
			}
		}
		mounted = true;
	});

	onDestroy(() => {
		unsubscribeFromProgress();
	});

	function handleJoined() {
		const participant = $currentParticipant;
		if (participant) {
			loadProgress(participant.id);
		}
	}
</script>

<svelte:head>
	<title>{data.session?.lab_title ?? 'Session'} - Claude Code Labs</title>
</svelte:head>

{#if !mounted}
	<div class="loading">Loading...</div>
{:else if !data.session}
	<div class="error-page dark-theme">
		<div class="error-content">
			<div class="logo-mark">✦</div>
			<h1>Session Not Found</h1>
			<p>This session doesn't exist or has expired.</p>
			<a href="/" class="btn btn-primary">Back to Labs</a>
		</div>
	</div>
{:else if !$currentParticipant || $currentParticipant.session_id !== data.session.id}
	<JoinForm session={data.session} onJoined={handleJoined} />
{:else if data.lab}
	<div class="workshop-layout">
		<Header />
		<Sidebar session={data.session} />
		<main class="workshop-main">
			{#if $activeView === 'workshop'}
				<Workshop lab={data.lab} session={data.session} />
			{:else if $activeView === 'leaderboard'}
				<LeaderboardPage session={data.session} lab={data.lab} />
			{:else if $activeView === 'admin'}
				<AdminPage session={data.session} lab={data.lab} />
			{/if}
		</main>
	</div>
{:else}
	<div class="error-page">
		<div class="error-content">
			<h1>Lab Not Found</h1>
			<p>The lab "{data.session.lab_slug}" is not available in this build.</p>
		</div>
	</div>
{/if}

<style>
	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		color: var(--text-muted);
	}

	.error-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.error-content {
		text-align: center;
	}

	.error-content .logo-mark {
		font-size: 2.5rem;
		color: var(--orange);
		margin-bottom: 1rem;
	}

	.error-content h1 {
		margin-bottom: 0.5rem;
	}

	.error-content p {
		color: var(--text-muted);
		margin-bottom: 1.5rem;
	}

	.workshop-layout {
		min-height: 100vh;
	}

	.workshop-main {
		margin-left: var(--sidebar-width);
		padding: 2rem 3rem;
		max-width: calc(900px + var(--sidebar-width));
		overflow-y: auto;
	}

	@media (max-width: 768px) {
		.workshop-layout {
			padding-top: var(--header-height);
		}

		.workshop-main {
			margin-left: 0;
			max-width: none;
		}

		.workshop-main {
			padding: 1.5rem 1rem;
		}
	}
</style>
