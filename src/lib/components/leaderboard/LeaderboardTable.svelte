<script lang="ts">
	import { leaderboard, leaderboardLoading } from '$lib/stores/leaderboard';
	import type { ParsedLab } from '$lib/types';

	let { lab }: { lab: ParsedLab } = $props();

	function getMedal(rank: number): string {
		if (rank === 1) return '🥇';
		if (rank === 2) return '🥈';
		if (rank === 3) return '🥉';
		return `${rank}`;
	}
</script>

<div class="leaderboard-table-wrapper">
	{#if $leaderboardLoading && $leaderboard.length === 0}
		<p class="empty">Loading leaderboard...</p>
	{:else if $leaderboard.length === 0}
		<p class="empty">No participants yet. Share the session URL to get started!</p>
	{:else}
		<table class="leaderboard-table">
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
					{@const progressPct = lab.total_points > 0 ? (entry.total_points / lab.total_points) * 100 : 0}
					<tr>
						<td class="col-rank">
							<span class="rank" class:top3={i < 3}>{getMedal(i + 1)}</span>
						</td>
						<td class="col-name">
							<span class="name">{entry.name}</span>
						</td>
						<td class="col-points">{entry.total_points}</td>
						<td class="col-steps">{entry.steps_completed}</td>
						<td class="col-progress">
							<div class="progress-track">
								<div class="progress-fill" style="width: {progressPct}%"></div>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
	.leaderboard-table {
		width: 100%;
		border-collapse: collapse;
	}

	thead {
		border-bottom: 2px solid var(--light-border);
	}

	th {
		padding: 0.75rem 1rem;
		text-align: left;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
	}

	td {
		padding: 0.875rem 1rem;
		border-bottom: 1px solid var(--light-border);
	}

	.col-rank { width: 60px; text-align: center; }
	.col-points, .col-steps { width: 80px; text-align: center; }
	.col-progress { width: 200px; }

	.rank {
		font-weight: 600;
		color: var(--text-secondary);
	}

	.rank.top3 {
		font-size: 1.25rem;
	}

	.name {
		font-weight: 500;
	}

	.progress-track {
		height: 8px;
		background: var(--light-surface);
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--orange), var(--orange-light));
		border-radius: 4px;
		transition: width 0.4s ease;
	}

	.empty {
		text-align: center;
		color: var(--text-muted);
		padding: 3rem 0;
	}

	@media (max-width: 768px) {
		.col-progress {
			display: none;
		}

		th, td {
			padding: 0.625rem 0.5rem;
		}
	}
</style>
