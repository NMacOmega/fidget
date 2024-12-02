<script lang="ts">
	import FidgetIcon from '../MenuComponents/FidgetIcon/FidgetIcon.svelte';
	import { fidgetsList } from '$stores/materialOld';
	import Icon from '../MenuComponents/Icon/Icon.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	//@todo next: create Fidget menu
	//indexes to show specific fidget in each place, mandatory at least three elements
	let previ = 0;
	let curri = 1;
	let nexti = 2;

	function onFidgetClick(f: number) {
		console.log(f);
	}

	function advanceGallery(forward: boolean) {
		if (forward) {
			previ = previ >= $fidgetsList.length - 1 ? 0 : previ + 1;
			curri = curri >= $fidgetsList.length - 1 ? 0 : curri + 1;
			nexti = nexti >= $fidgetsList.length - 1 ? 0 : nexti + 1;
		} else {
			previ = previ <= 0 ? $fidgetsList.length - 1 : previ - 1;
			curri = curri <= 0 ? $fidgetsList.length - 1 : curri - 1;
			nexti = nexti <= 0 ? $fidgetsList.length - 1 : nexti - 1;
		}
	}

	//@todo : can We animate the transition and add a carousel motion?
</script>

<div class="fidgetMenu">
	<div class="fidgetChoiceMenu">
		<div class="fidgetGallery">
			<div class="prevFidget" on:click={() => onFidgetClick(previ)}>
				<FidgetIcon icon={$fidgetsList[previ]} />
			</div>
			<div class="currFidget" on:click={() => onFidgetClick(curri)}>
				<FidgetIcon icon={$fidgetsList[curri]} />
			</div>
			<div class="nextFidget" on:click={() => onFidgetClick(nexti)}>
				<FidgetIcon icon={$fidgetsList[nexti]} />
			</div>
		</div>

		<button class="prev" on:click={() => advanceGallery(false)}
			><Icon class="fa-solid fa-angle-left" /></button
		>
		<button class="next" on:click={() => advanceGallery(true)}
			><Icon class="fa-solid fa-angle-right" /></button
		>
		<button class="close" on:click={() => dispatch('close')}>Close</button>
	</div>
</div>

<style>
	.fidgetMenu {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 10px min(45vw, 15rem);
		grid-template-areas:
			'.'
			'.'
			'controls';
	}

	.fidgetChoiceMenu {
		border-radius: 30px 30px 0 0;
		background-color: hsla(1, 100%, 0%, 0.2);
		pointer-events: auto;
		grid-area: controls;
		display: grid;
		grid-template-columns: 10px 1fr 1fr 1fr 10px;
		grid-template-rows: 1px 1fr auto;
		grid-template-areas:
			'. . . . .'
			'. gallery gallery gallery .'
			'. prev next close. ';
	}

	.fidgetGallery {
		grid-area: gallery;
		display: grid;
		grid-template-columns: repeat(1fr, 3);
		grid-template-areas: 'prev curr next';
	}

	.prevFidget {
		grid-area: prev;
	}

	.currFidget {
		grid-area: curr;
	}

	.nextFidget {
		grid-area: next;
	}

	.prevFidget,
	.nextFidget {
		width: 75%;
		height: 75%;
		align-self: center;
		justify-self: center;
	}

	.prev {
		grid-area: prev;
	}

	.next {
		grid-area: next;
	}

	.close {
		grid-area: close;
		background-color: hsl(10, 90%, 90%);
		color: black;
		grid-area: close;
		margin: auto 20px 10px auto;
		padding: 10px 20px;
		border-radius: 15px;
	}
</style>
