<script lang="ts">
	let expanded = $state(false);
</script>

<div class="reference-card">
	<button class="reference-toggle" onclick={() => (expanded = !expanded)}>
		<span>🔧 Troubleshooting & Keyboard Shortcuts</span>
		<span class="chevron" class:open={expanded}>▸</span>
	</button>

	{#if expanded}
		<div class="reference-content">
			<div class="ref-section">
				<h4>Troubleshooting</h4>
				<ul>
					<li><strong>Copy error logs directly into Claude</strong> — Paste stack traces from your terminal output.</li>
					<li><strong>Use screenshots</strong> — Paste images directly into Claude (<code>Ctrl+V</code>) to show visual bugs.</li>
					<li><strong>Iterate on prompts</strong> — Refine your request based on what worked or didn't.</li>
					<li>Prompt Claude to <strong>"think harder"</strong> or <strong>"ultrathink"</strong> for complex problems.</li>
				</ul>
			</div>
			<div class="ref-section">
				<h4>Keyboard Shortcuts</h4>
				<ul>
					<li><code>Shift+Tab</code> — Toggle Plan Mode</li>
					<li><code>Ctrl+O</code> — Toggle transcript view</li>
					<li><code>Ctrl+B</code> — Background tasks</li>
					<li><code>#</code> — Memory mode</li>
					<li><code>!</code> — Bash mode</li>
					<li><code>@</code> — File mention</li>
				</ul>
			</div>
		</div>
	{/if}
</div>

<style>
	.reference-card {
		border: 1px solid var(--light-border);
		border-radius: var(--radius);
		margin-bottom: 1.5rem;
		overflow: hidden;
	}

	.reference-toggle {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: var(--light-surface);
		border: none;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-primary);
		font-family: inherit;
	}

	.reference-toggle:hover {
		background: var(--light-border);
	}

	.chevron {
		transition: transform 0.2s ease;
		color: var(--text-muted);
	}

	.chevron.open {
		transform: rotate(90deg);
	}

	.reference-content {
		padding: 1rem 1.25rem;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		animation: taskSlideIn 0.2s ease;
	}

	.ref-section h4 {
		font-size: 0.85rem;
		margin-bottom: 0.5rem;
		color: var(--text-secondary);
	}

	.ref-section ul {
		list-style: none;
		padding: 0;
	}

	.ref-section li {
		font-size: 0.85rem;
		margin-bottom: 0.375rem;
		color: var(--text-primary);
		line-height: 1.4;
	}

	@media (max-width: 768px) {
		.reference-content {
			grid-template-columns: 1fr;
		}
	}
</style>
