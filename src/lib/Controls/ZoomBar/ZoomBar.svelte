<script lang="ts">
	import { zoom } from '$stores/camera';

	// export let horizontal;
	// export let vertical;

	// const mode = vertical && !horizontal ? 'vertical' : 'horizontal';

	//TODO: Maybe put a span over the center of the screen to catch zoom scrolls, otherwise, the page should scroll
	//TODO: Make it horizontal as needed to fit on screen
	//TODO: Make working for touch
	export let min = 0,
		max = 100,
		step = 1;

	//CSS Variables
	let left = 0,
		markerColor = '#000',
		markerBorder = `2px solid #fff`,
		backgroundColor = 'transparent',
		trackColor = '#eaeaea';
	let dragging = false;

	const onInput = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		zoom.setFromValue(Number(e.currentTarget.value));
	};

	const onDrag = (y: number) => {
		console.log(y);
	};

	$: left = $zoom;
</script>

<svelte:window
	on:touchmove|nonpassive={(e) => {
		if (dragging) e.preventDefault();
	}}
/>
<div
	class="container"
	style:--left={`${left}%`}
	style:--marker-color={markerColor}
	style:--marker-border={markerBorder}
	style:--track-background-color={trackColor}
	style:--background-color={backgroundColor}
>
	<span class="zoomSpan" id="zoomSpan" />
	<input
		id="zoomSlider"
		name="zoom"
		class="zoomSlider"
		type="range"
		{min}
		{max}
		{step}
		aria-label="Zoom slider"
		value={$zoom}
		on:input={onInput}
		on:touchstart={() => (dragging = true)}
		on:touchend={() => (dragging = false)}
		on:touchmove={(e) => onDrag(e.touches[0].pageY)}
	/>
	<div id="zoomMarker" class="zoomMarker" />
</div>

<style>
	.container {
		--width: 100%;
		--right: -50px;
		transform: rotateZ(270deg);
		direction: ltr;
		position: absolute;
		border-radius: 5px;
		bottom: 15%;
		width: var(--width);
		right: var(--right);
		max-width: 180px;
		height: 40px;
		background-color: var(--background-color);
	}
	.zoomSlider {
		position: absolute;
		width: calc(100% + 16px);
		height: 100%;
		left: -8px;
		top: -2px;
		margin: 0;
		background-color: transparent;
		cursor: pointer;
		opacity: 0;
		appearance: none;
		-webkit-appearance: none;
	}

	.zoomSpan {
		display: block;
		width: 100%;
		height: 100%;
		background: var(--track-background-color);
		border-radius: 5px;
	}

	.zoomMarker {
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
		position: absolute;
		width: 24px;
		height: 110%;
		left: var(--left);
		top: 50%;
		margin-left: -8px;
		transform: translateY(-50%);
		border: var(--marker-border);
		border-radius: 10px;
		background-color: var(--marker-color);
		box-shadow: 0 0 1px #888;
		pointer-events: none;
	}

	input[type='range']::-moz-range-thumb {
		width: 8px;
		height: 8px;
		border: 0;
		background-color: var(--marker-color);
	}
	input[type='range']::-moz-range-track {
		width: 100%;
		height: 8px;
		border: 0;
	}
</style>
