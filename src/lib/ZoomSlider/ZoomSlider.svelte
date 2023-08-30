<script lang="ts">
	import { zoom } from '$stores/camera';
	//TODO: Maybe put a span over the center of the screen to catch zoom scrolls, otherwise, the page should scroll
	export let min = 0,
		max = 100,
		step = 1;

	//CSS Variables
	let left = `0%`,
		markerColor = '#000',
		markerBorder = `2px solid #fff`,
		backgroundColor = 'transparent',
		trackColor = '#eaeaea';
	$: left = `${$zoom}%`;
</script>

<div
	class="zoom"
	style:--left={left}
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
		on:input={(e) => zoom.setFromValue(Number(e.currentTarget.value))}
	/>
	<div id="zoomMarker" class="zoomMarker" />
</div>

<style>
	.zoom {
		--width: 280px;
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
