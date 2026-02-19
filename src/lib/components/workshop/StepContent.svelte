<script lang="ts">
	import { onMount } from 'svelte';

	let { html }: { html: string } = $props();

	let contentEl: HTMLDivElement;

	onMount(() => {
		if (!contentEl) return;
		// Add copy buttons to code blocks
		const pres = contentEl.querySelectorAll('pre');
		pres.forEach((pre) => {
			const wrapper = document.createElement('div');
			wrapper.className = 'code-block-wrapper';
			pre.parentNode?.insertBefore(wrapper, pre);
			wrapper.appendChild(pre);

			const btn = document.createElement('button');
			btn.className = 'copy-btn';
			btn.textContent = 'Copy';
			btn.addEventListener('click', async () => {
				const code = pre.querySelector('code')?.textContent ?? pre.textContent ?? '';
				await navigator.clipboard.writeText(code);
				btn.textContent = '✓';
				btn.classList.add('copied');
				setTimeout(() => {
					btn.textContent = 'Copy';
					btn.classList.remove('copied');
				}, 1500);
			});
			wrapper.appendChild(btn);
		});
	});
</script>

<div class="step-content" bind:this={contentEl}>
	{@html html}
</div>

<style>
	.step-content {
		padding-top: 1rem;
	}

	.step-content :global(.code-block-wrapper) {
		position: relative;
	}

	.step-content :global(.copy-btn) {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		padding: 0.25rem 0.625rem;
		font-size: 0.7rem;
		font-family: inherit;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 4px;
		color: rgba(255, 255, 255, 0.6);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.step-content :global(.copy-btn:hover) {
		background: rgba(255, 255, 255, 0.2);
		color: white;
	}

	.step-content :global(.copy-btn.copied) {
		color: var(--success);
		border-color: var(--success);
	}
</style>
