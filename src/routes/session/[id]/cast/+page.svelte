<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { leaderboard, fetchLeaderboard, subscribeToProgress, unsubscribeFromProgress } from '$lib/stores/leaderboard';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let refreshInterval: ReturnType<typeof setInterval>;

	onMount(() => {
		if (data.session) {
			fetchLeaderboard(data.session.id);
			subscribeToProgress(data.session.id);
			refreshInterval = setInterval(() => fetchLeaderboard(data.session!.id), 10000);
		}
	});

	onDestroy(() => {
		unsubscribeFromProgress();
		clearInterval(refreshInterval);
	});

	function getMedal(rank: number): string {
		if (rank === 1) return '🥇';
		if (rank === 2) return '🥈';
		if (rank === 3) return '🥉';
		return `${rank}`;
	}
</script>

<svelte:head>
	<title>Cast Mode - {data.session?.lab_title ?? 'Workshop'}</title>
</svelte:head>

<div class="cast-mode">
	<div class="cast-header">
		<div class="cast-title">
			<h1>Leaderboard</h1>
			<span class="live-badge">● LIVE</span>
		</div>
		<p class="cast-subtitle">
			{data.session?.lab_title ?? 'Workshop'} — {$leaderboard.length} participants
		</p>
	</div>

	{#if $leaderboard.length === 0}
		<div class="cast-empty">
			<p>Waiting for participants...</p>
		</div>
	{:else}
		<table class="cast-table">
			<thead>
				<tr>
					<th class="col-rank">Rank</th>
					<th class="col-name">Participant</th>
					<th class="col-points">Points</th>
					<th class="col-steps">Steps</th>
					<th class="col-progress">Progress</th>
				</tr>
			</thead>
			<tbody>
				{#each $leaderboard as entry, i}
					{@const totalPts = data.lab?.total_points ?? 1}
					{@const pct = (entry.total_points / totalPts) * 100}
					<tr>
						<td class="col-rank">
							<span class="rank" class:top3={i < 3}>{getMedal(i + 1)}</span>
						</td>
						<td class="col-name">{entry.name}</td>
						<td class="col-points">{entry.total_points}</td>
						<td class="col-steps">{entry.steps_completed}</td>
						<td class="col-progress">
							<div class="progress-track">
								<div class="progress-fill" style="width: {pct}%"></div>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
	.cast-mode {
		min-height: 100vh;
		background: var(--dark);
		color: var(--light);
		padding: 3rem 4rem;
	}

	.cast-header {
		margin-bottom: 3rem;
	}

	.cast-title {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	h1 {
		font-size: 2.5rem;
		color: var(--light);
	}

	.live-badge {
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--error);
		animation: livePulse 2s ease infinite;
	}

	.cast-subtitle {
		color: var(--text-muted);
		font-size: 1.125rem;
		margin-top: 0.5rem;
	}

	.cast-empty {
		text-align: center;
		padding: 6rem 0;
		color: var(--text-muted);
		font-size: 1.5rem;
	}

	.cast-table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		padding: 1rem 1.25rem;
		text-align: left;
		font-size: 0.85rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
		border-bottom: 2px solid var(--dark-border);
	}

	td {
		padding: 1.25rem;
		border-bottom: 1px solid var(--dark-border);
		font-size: 1.25rem;
	}

	.col-rank { width: 80px; text-align: center; }
	.col-points, .col-steps { width: 100px; text-align: center; }
	.col-progress { width: 250px; }

	.rank {
		font-weight: 600;
	}

	.rank.top3 {
		font-size: 2rem;
	}

	.progress-track {
		height: 12px;
		background: var(--dark-surface);
		border-radius: 6px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--orange), var(--orange-light));
		border-radius: 6px;
		transition: width 0.4s ease;
	}
</style>
