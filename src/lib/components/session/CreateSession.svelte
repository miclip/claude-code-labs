<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { createSession } from '$lib/stores/session';
	import { addToast } from '$lib/stores/ui';
	import type { ParsedLab } from '$lib/types';
	import { decks } from 'virtual:slides';

	let { lab, onBack }: { lab: ParsedLab; onBack: () => void } = $props();

	let alias = $state('');
	let passphrase = $state('');
	let joinPassword = $state('');
	let creating = $state(false);
	let createdUrl = $state<string | null>(null);
	let showPresentation = $state(false);

	// Presentation fields
	let slideDeck = $state('');
	let speakerNames = $state('');
	let eventName = $state('');
	let companyName = $state('');
	let wifiSsid = $state('');
	let wifiPassword = $state('');
	let apiCreditUrl = $state('');

	async function handleCreate() {
		creating = true;
		const sessionId = await createSession(lab.slug, lab.title, {
			alias: alias || undefined,
			passphrase: passphrase || undefined,
			joinPassword: joinPassword || undefined,
			slideDeck: slideDeck || undefined,
			speakerNames: speakerNames || undefined,
			eventName: eventName || undefined,
			companyName: companyName || undefined,
			wifiSsid: wifiSsid || undefined,
			wifiPassword: wifiPassword || undefined,
			apiCreditUrl: apiCreditUrl || undefined
		});

		if (sessionId) {
			createdUrl = `${window.location.origin}${base}/session/${sessionId}`;
			addToast('Session created!', 'success');
		} else {
			addToast('Failed to create session. Check Supabase configuration.', 'error');
		}
		creating = false;
	}

	async function copyUrl() {
		if (!createdUrl) return;
		await navigator.clipboard.writeText(createdUrl);
		addToast('URL copied to clipboard!', 'success');
	}

	function goToSession() {
		if (!createdUrl) return;
		const id = createdUrl.split('/session/')[1];
		goto(`${base}/session/${id}`);
	}
</script>

<div class="create-session">
	{#if createdUrl}
		<div class="created">
			<h2>Session Ready!</h2>
			<p class="created-lab">{lab.title}</p>
			<div class="url-box">
				<input type="text" readonly value={createdUrl} />
				<button class="btn btn-primary btn-sm" onclick={copyUrl}>Copy</button>
			</div>
			<p class="share-hint">Share this URL with your workshop participants</p>
			<div class="actions">
				<button class="btn btn-primary" onclick={goToSession}>Open Workshop</button>
				<button class="btn btn-ghost" onclick={onBack} style="color: var(--text-muted);">Create Another</button>
			</div>
		</div>
	{:else}
		<div class="form-wrapper">
			<button class="back-btn" onclick={onBack}>← Back to labs</button>
			<h2>Create Session</h2>
			<p class="lab-name">{lab.title}</p>

			<form onsubmit={(e) => { e.preventDefault(); handleCreate(); }}>
				<div class="field">
					<label for="alias">Session Alias (optional)</label>
					<input
						id="alias"
						type="text"
						bind:value={alias}
						placeholder="e.g. spring-workshop-jan-2026"
					/>
				</div>

				<div class="field">
					<label for="join-password">Participant Password (optional)</label>
					<span class="field-hint">If set, participants will need this to join</span>
					<input
						id="join-password"
						type="text"
						bind:value={joinPassword}
						placeholder="Leave blank for open access"
					/>
				</div>

				<div class="field">
					<label for="passphrase">Trainer Passphrase (optional)</label>
					<input
						id="passphrase"
						type="password"
						bind:value={passphrase}
						placeholder="Protects the admin panel"
					/>
				</div>

				<!-- Presentation Settings (collapsible) -->
				<div class="section-toggle">
					<button
						type="button"
						class="toggle-btn"
						onclick={() => { showPresentation = !showPresentation; }}
					>
						<span class="toggle-icon">{showPresentation ? '▾' : '▸'}</span>
						Presentation Settings
						{#if decks.length === 0}
							<span class="no-decks">(no decks available)</span>
						{/if}
					</button>
				</div>

				{#if showPresentation}
					<div class="presentation-fields">
						<div class="field">
							<label for="slide-deck">Slide Deck</label>
							<select id="slide-deck" bind:value={slideDeck} class="select-input">
								<option value="">— none —</option>
								{#each decks as deck}
									<option value={deck.slug}>{deck.title}</option>
								{/each}
							</select>
						</div>

						<div class="field">
							<label for="speaker-names">Speaker Name(s)</label>
							<input
								id="speaker-names"
								type="text"
								bind:value={speakerNames}
								placeholder="e.g. Jane Smith, Bob Jones"
							/>
						</div>

						<div class="field-row">
							<div class="field">
								<label for="event-name">Event Name</label>
								<input
									id="event-name"
									type="text"
									bind:value={eventName}
									placeholder="e.g. AWS Summit 2026"
								/>
							</div>
							<div class="field">
								<label for="company-name">Company</label>
								<input
									id="company-name"
									type="text"
									bind:value={companyName}
									placeholder="e.g. Acme Corp"
								/>
							</div>
						</div>

						<div class="field-row">
							<div class="field">
								<label for="wifi-ssid">WiFi SSID</label>
								<input
									id="wifi-ssid"
									type="text"
									bind:value={wifiSsid}
									placeholder="Network name"
								/>
							</div>
							<div class="field">
								<label for="wifi-password">WiFi Password</label>
								<input
									id="wifi-password"
									type="text"
									bind:value={wifiPassword}
									placeholder="Password"
								/>
							</div>
						</div>

						<div class="field">
							<label for="api-credit-url">API Credit URL</label>
							<input
								id="api-credit-url"
								type="text"
								bind:value={apiCreditUrl}
								placeholder="e.g. https://tinyurl.com/..."
							/>
						</div>
					</div>
				{/if}

				<button class="btn btn-primary full-width" type="submit" disabled={creating}>
					{creating ? 'Creating...' : 'Create Session'}
				</button>
			</form>
		</div>
	{/if}
</div>

<style>
	.create-session {
		width: 100%;
		max-width: 480px;
	}

	.form-wrapper, .created {
		background: var(--dark-surface);
		border: 1px solid var(--dark-border);
		border-radius: var(--radius-lg);
		padding: 2rem;
	}

	.back-btn {
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		font-size: 0.85rem;
		padding: 0;
		margin-bottom: 1.25rem;
		font-family: inherit;
	}

	.back-btn:hover {
		color: var(--orange);
	}

	h2 {
		color: var(--light);
		margin-bottom: 0.25rem;
	}

	.lab-name, .created-lab {
		color: var(--orange);
		font-size: 0.9rem;
		margin-bottom: 1.5rem;
	}

	.field {
		margin-bottom: 1.25rem;
	}

	.field label {
		color: var(--text-muted);
	}

	.field-hint {
		display: block;
		color: var(--text-muted);
		font-size: 0.8rem;
		margin-bottom: 0.25rem;
	}

	.field input {
		background: var(--dark);
		border-color: var(--dark-border);
		color: var(--light);
	}

	.field input:focus {
		border-color: var(--orange);
	}

	.full-width {
		width: 100%;
	}

	.created {
		text-align: center;
	}

	.url-box {
		display: flex;
		gap: 0.5rem;
		margin: 1rem 0;
	}

	.url-box input {
		background: var(--dark);
		border-color: var(--dark-border);
		color: var(--orange-light);
		font-family: var(--font-mono);
		font-size: 0.8rem;
	}

	.share-hint {
		color: var(--text-muted);
		font-size: 0.85rem;
		margin-bottom: 1.5rem;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	/* Presentation Settings */
	.section-toggle {
		margin-bottom: 1rem;
	}

	.toggle-btn {
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		font-size: 0.85rem;
		padding: 0.4rem 0;
		font-family: inherit;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		width: 100%;
		text-align: left;
	}

	.toggle-btn:hover {
		color: var(--orange);
	}

	.toggle-icon {
		font-size: 0.7rem;
	}

	.no-decks {
		color: var(--text-muted);
		font-size: 0.8rem;
		opacity: 0.6;
	}

	.presentation-fields {
		background: var(--dark);
		border: 1px solid var(--dark-border);
		border-radius: var(--radius);
		padding: 1.25rem;
		margin-bottom: 1.25rem;
	}

	.presentation-fields .field {
		margin-bottom: 1rem;
	}

	.presentation-fields .field:last-child {
		margin-bottom: 0;
	}

	.field-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.field-row .field {
		margin-bottom: 0;
	}

	.select-input {
		font-family: inherit;
		font-size: 0.9rem;
		padding: 0.625rem 0.875rem;
		border: 1px solid var(--dark-border);
		border-radius: var(--radius);
		background: var(--dark-surface);
		color: var(--light);
		width: 100%;
		transition: border-color 0.15s ease;
		cursor: pointer;
	}

	.select-input:focus {
		outline: none;
		border-color: var(--orange);
		box-shadow: 0 0 0 3px rgba(217, 119, 87, 0.15);
	}
</style>
