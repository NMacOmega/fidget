<script>
	import { createEventDispatcher } from 'svelte';
	import { currentFidgetName, highlightFidget } from '$stores/material';
	import FidgetIcon from './FidgetIcon/FidgetIcon.svelte';
	const dispatch = createEventDispatcher();

	const options = { cube: 'focus1', sphere: 'focus2', discs: 'focus3' };
</script>

<div class="container">
	<button class="close" on:click={() => dispatch('close')}><i class="fa-solid fa-close" /></button>
	<div class="options">
		{#each Object.entries(options) as [option, focus]}
			<div class="option" on:click={() => highlightFidget(focus)}>
				<FidgetIcon icon={option} isIconActive={option === $currentFidgetName} />
			</div>
		{/each}
	</div>
</div>

<style>
	.container {
		--closeButtonSize: 40px;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: black;
		display: grid;
		grid-template-columns: 1fr var(--closeButtonSize) 30vw;
		grid-template-rows: 5px var(--closeButtonSize) 10px auto calc(var(--closeButtonSize) + 10px);
		grid-template-areas:
			'. . .'
			'. close .'
			'. . .'
			'options options options'
			'. . .';
	}

	.close {
		border: 1px solid white;
		border-radius: 100%;
		--size: 40px;
		width: var(--closeButtonSize);
		height: var(--closeButtonSize);
		grid-area: close;
	}

	.options {
		grid-area: options;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		padding: 20px 0;
		background-color: hsla(1, 0%, 100%, 0.6);
	}

	.option {
		--size: 100px;
		width: var(--size);
		height: var(--size);
		stroke: blue;
	}

	.option > * {
	}
</style>
