<script lang="ts">
	import FidgetIcon from '../MenuComponents/FidgetIcon/FidgetIcon.svelte';
	import { fidgetReference, sceneHighlights, highlightFidget } from '$stores/threeJSObjectStores';
	import { camera } from '$stores/camera';
	import type { FidgetName } from '$stores/threeJSObjectStores';
	import Icon from '../MenuComponents/Icon/Icon.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	const DIRECTION = Object.freeze({
		FORWARD: 'FORWARD',
		REVERSE: 'REVERSE'
	});
	type Direction = keyof typeof DIRECTION;

	//@todo next: create Fidget menu
	//indexes to show specific fidget in each place, mandatory at least three elements
	let previ = 2;
	let curri = 0;
	let nexti = 1;

	//used to track touchmove events and determine which direction to rotate carousel
	// set as -1 so first event will set the index, not move the carousel
	let lastSwipeX = -1;

	// on swipe, maybe advance the carousel
	//on scroll, advance the carousel too

	const moveIndex = (n = 0, max = 0, direction: Direction) =>
		direction === DIRECTION.FORWARD ? (n >= max ? 0 : n + 1) : n <= 0 ? max : n - 1;

	function advanceGallery(direction: Direction) {
		previ = moveIndex(previ, fidgetReference.list.length - 1, direction);
		curri = moveIndex(curri, fidgetReference.list.length - 1, direction);
		nexti = moveIndex(nexti, fidgetReference.list.length - 1, direction);
	}

	function onFidgetClick(name: FidgetName) {
		//Highlight this object and make it the center of the carousel
		camera.move(fidgetReference.map[name].camera, fidgetReference.map[name].focusPoint);
		highlightFidget(name);
		dispatch('close');
		//@todo: Changing Fidgets does not update current color/material selection. If the UUID changed on fidget change, could we harness that to update the color icon for currentmaterial options?
	}

	function onSwipe(clientX = -1) {
		//May want to add a timer to pause this event so we do not overtrigger
		if (clientX < 0) return;
		if (lastSwipeX < 0) return (lastSwipeX = clientX);
		if (clientX > lastSwipeX) advanceGallery(DIRECTION.FORWARD);
		else if (clientX < lastSwipeX) advanceGallery(DIRECTION.REVERSE);
		lastSwipeX = clientX;
	}

	function onWheel(x = 0) {
		if (x > 0) advanceGallery(DIRECTION.FORWARD);
		else if (x < 0) advanceGallery(DIRECTION.REVERSE);
	}

	//@todo : can We animate the transition and add a carousel motion? (research)
</script>

<div
	class="fidgetMenu"
	on:wheel|preventDefault|stopPropagation={(e) => onWheel(e.wheelDelta || 0)}
	on:touchmove={(e) => onSwipe(e.touches[0].clientX)}
>
	<div class="fidgetChoiceMenu">
		<div class="fidgetGallery">
			<div class="prevFidget" on:click={() => onFidgetClick(fidgetReference.list[previ].name)}>
				<FidgetIcon icon={fidgetReference.list[previ].name} />
			</div>
			<div class="currFidget" on:click={() => onFidgetClick(fidgetReference.list[curri].name)}>
				<FidgetIcon icon={fidgetReference.list[curri].name} />
			</div>
			<div class="nextFidget" on:click={() => onFidgetClick(fidgetReference.list[nexti].name)}>
				<FidgetIcon icon={fidgetReference.list[nexti].name} />
			</div>
		</div>

		<button class="prev" on:click={() => advanceGallery(DIRECTION.REVERSE)}
			><Icon class="fa-solid fa-angle-left" /></button
		>
		<button class="next" on:click={() => advanceGallery(DIRECTION.FORWARD)}
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
