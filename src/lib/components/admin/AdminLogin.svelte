<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { addToast } from '$lib/stores/ui';

	let { sessionId, onAuth }: { sessionId: string; onAuth: () => void } = $props();

	let passphrase = $state('');
	let verifying = $state(false);

	async function handleVerify() {
		if (!passphrase.trim() || !supabase) return;
		verifying = true;

		const { data, error } = await supabase.rpc('verify_trainer_passphrase', {
			p_session_id: sessionId,
			p_passphrase: passphrase
		});

		if (error || !data) {
			addToast('Invalid passphrase.', 'error');
		} else {
			addToast('Admin access granted.', 'success');
			onAuth();
		}
		verifying = false;
	}
</script>

<div class="admin-login">
	<div class="login-card">
		<h2>Admin Access</h2>
		<p>Enter the trainer passphrase to access the admin dashboard.</p>
		<form onsubmit={(e) => { e.preventDefault(); handleVerify(); }}>
			<div class="field">
				<label for="admin-pass">Passphrase</label>
				<input
					id="admin-pass"
					type="password"
					bind:value={passphrase}
					placeholder="Enter trainer passphrase"
					autofocus
				/>
			</div>
			<button class="btn btn-primary full-width" type="submit" disabled={verifying || !passphrase.trim()}>
				{verifying ? 'Verifying...' : 'Unlock'}
			</button>
		</form>
	</div>
</div>

<style>
	.admin-login {
		display: flex;
		justify-content: center;
		padding-top: 3rem;
	}

	.login-card {
		width: 100%;
		max-width: 400px;
		background: var(--light-surface);
		border: 1px solid var(--light-border);
		border-radius: var(--radius-lg);
		padding: 2rem;
	}

	h2 {
		margin-bottom: 0.375rem;
	}

	p {
		color: var(--text-secondary);
		font-size: 0.9rem;
		margin-bottom: 1.5rem;
	}

	.field {
		margin-bottom: 1.25rem;
	}

	.full-width {
		width: 100%;
	}
</style>
