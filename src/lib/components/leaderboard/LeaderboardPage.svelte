<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { fetchLeaderboard } from '$lib/stores/leaderboard';
	import LeaderboardTable from './LeaderboardTable.svelte';
	import type { Session, ParsedLab } from '$lib/types';

	let { session, lab }: { session: Session; lab: ParsedLab } = $props();

	function refresh() {
		fetchLeaderboard(session.id);
	}

	function openCast() {
		window.open(`${window.location.origin}${base}/session/${session.id}/cast`, '_blank');
	}
</script>

<div class="leaderboard-page">
	<div class="page-header">
		<div>
			<h1>Leaderboard <span class="live-badge">LIVE</span></h1>
			<p class="subtitle">
				Workshop <strong>{session.alias ?? session.id.slice(0, 8)}</strong> — Top performers — updates every 10 seconds
			</p>
		</div>
		<div class="header-actions">
			<button class="btn btn-secondary btn-sm" onclick={refresh}>Refresh now</button>
			<button class="btn btn-secondary btn-sm" onclick={openCast}>Cast Mode</button>
		</div>
	</div>

	<LeaderboardTable {lab} />
</div>

<style>
	.leaderboard-page {
		animation: taskSlideIn 0.3s ease;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	h1 {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.live-badge {
		font-size: 0.65rem;
		font-weight: 700;
		padding: 0.2rem 0.5rem;
		background: var(--error);
		color: white;
		border-radius: 4px;
		letter-spacing: 0.05em;
		animation: livePulse 2s ease infinite;
	}

	.subtitle {
		color: var(--text-secondary);
		font-size: 0.9rem;
		margin-top: 0.25rem;
	}

	.header-actions {
		display: flex;
		gap: 0.5rem;
	}
</style>
