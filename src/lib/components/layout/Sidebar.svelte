<script lang="ts">
	import { currentParticipant, leaveSession } from '$lib/stores/session';
	import { activeView, sidebarOpen } from '$lib/stores/ui';
	import { base } from '$app/paths';
	import type { Session } from '$lib/types';

	let { session }: { session: Session } = $props();

	function navigate(view: 'workshop' | 'leaderboard' | 'admin') {
		activeView.set(view);
		sidebarOpen.set(false);
	}
</script>

<aside class="sidebar" class:open={$sidebarOpen}>
	<div class="sidebar-header">
		<a href="{base}/" class="brand">
			<span class="brand-mark">✦</span>
			<div>
				<div class="brand-name">Claude Code</div>
				<div class="brand-sub">Labs</div>
			</div>
		</a>
	</div>

	{#if session.alias}
		<div class="session-alias">{session.alias}</div>
	{/if}

	<nav class="sidebar-nav">
		<button
			class="nav-item"
			class:active={$activeView === 'workshop'}
			onclick={() => navigate('workshop')}
		>
			<span class="nav-icon">📋</span>
			Workshop
		</button>
		<button
			class="nav-item"
			class:active={$activeView === 'leaderboard'}
			onclick={() => navigate('leaderboard')}
		>
			<span class="nav-icon">🏆</span>
			Leaderboard
		</button>
		<button
			class="nav-item"
			class:active={$activeView === 'admin'}
			onclick={() => navigate('admin')}
		>
			<span class="nav-icon">⚙️</span>
			Admin
		</button>
		{#if session.slide_deck}
			<a
				class="nav-item"
				href="{base}/session/{session.id}/slides"
				target="_blank"
			>
				<span class="nav-icon">🎞️</span>
				Slides
			</a>
		{/if}
	</nav>

	<div class="sidebar-footer">
		{#if $currentParticipant}
			<div class="user-info">
				<div class="user-avatar">{$currentParticipant.name.charAt(0).toUpperCase()}</div>
				<div class="user-details">
					<span class="user-name">{$currentParticipant.name}</span>
					<button class="leave-btn" onclick={leaveSession}>Leave</button>
				</div>
			</div>
		{/if}
	</div>
</aside>

{#if $sidebarOpen}
	<button class="sidebar-backdrop" onclick={() => sidebarOpen.set(false)} aria-label="Close menu"></button>
{/if}

<style>
	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		width: var(--sidebar-width);
		height: 100vh;
		background: var(--dark);
		color: var(--light);
		display: flex;
		flex-direction: column;
		z-index: 100;
		border-right: 1px solid var(--dark-border);
	}

	.sidebar-header {
		padding: 1.25rem 1rem;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		text-decoration: none;
		color: var(--light);
	}

	.brand-mark {
		font-size: 1.5rem;
		color: var(--orange);
	}

	.brand-name {
		font-size: 0.9rem;
		font-weight: 600;
	}

	.brand-sub {
		font-size: 0.7rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.session-alias {
		padding: 0 1rem 0.75rem;
		font-size: 0.75rem;
		color: var(--text-muted);
		font-family: var(--font-mono);
	}

	.sidebar-nav {
		flex: 1;
		padding: 0.5rem 0.5rem;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		width: 100%;
		padding: 0.625rem 0.75rem;
		border: none;
		background: transparent;
		color: var(--text-muted);
		font-size: 0.875rem;
		font-family: inherit;
		cursor: pointer;
		border-radius: var(--radius);
		transition: all 0.15s ease;
	}

	.nav-item:hover {
		background: var(--dark-hover);
		color: var(--light);
	}

	.nav-item.active {
		background: var(--dark-hover);
		color: var(--orange);
	}

	.nav-icon {
		font-size: 1rem;
	}

	.sidebar-footer {
		padding: 1rem;
		border-top: 1px solid var(--dark-border);
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}

	.user-avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--orange);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 0.85rem;
		flex-shrink: 0;
	}

	.user-details {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.user-name {
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--light);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.leave-btn {
		background: none;
		border: none;
		color: var(--text-muted);
		font-size: 0.75rem;
		cursor: pointer;
		padding: 0;
		text-align: left;
		font-family: inherit;
	}

	.leave-btn:hover {
		color: var(--error);
	}

	.sidebar-backdrop {
		display: none;
	}

	@media (max-width: 768px) {
		.sidebar {
			transform: translateX(-100%);
			transition: transform 0.25s ease;
		}

		.sidebar.open {
			transform: translateX(0);
		}

		.sidebar-backdrop {
			display: block;
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.5);
			z-index: 99;
			border: none;
			cursor: default;
		}
	}
</style>
