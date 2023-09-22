<script lang="ts">
	import { metalness, selectedUUID } from '$stores/material';

	type EventWithVal = Event & {
		currentTarget: EventTarget & HTMLInputElement;
	};

	export let max = 100;
	export let min = 0;
	export let step = 0.1;

	let value = $metalness || 0;
	/**Height of this bar*/
	let height = 0;
	/**Width of this bar*/
	let width = 0;

	//CSS Variables
	/**The top point of the border leading edge*/
	let a = 0;
	/**The top point of the marker leading edge*/
	let b = 0;
	/**The bottom point of the marker leading edge*/
	let c = 0;
	/**The bottom point of the border leading edge*/
	let d = 0;
	/** stopping point for marker gradient*/
	let stop = 0;
	/** stopping point for border gradient*/
	let shade = 0;

	/** Clamps provided number between max and min values*/
	const clamp = (num: number, max: number, min: number) => Math.min(max, Math.max(min, num));

	/**For some reason I cannot calculate these reactively or compress the calculateions. My head hurts
	 * @void updates the 4 points used for the marker shape
	 */
	const generateStyle = (metalness: number) => {
		const angle = Math.atan(height / width);
		a = metalness - 0.1;
		b = width * a * Math.tan(angle);
		c = metalness + 0.2;
		d = width * c * Math.tan(angle);
		a = clamp(100 - a, 100, -1);
		b = clamp(110 - b / height, 83, 1);
		c = clamp(110 - c, 75, 10);
		d = clamp(100 - d / height, 65, 0);
	};

	const onMaterialChange = (_trigger: typeof $selectedUUID) => (value = $metalness);
	const onInput = (e: EventWithVal) => metalness.set(Number(e.currentTarget.value));

	$: onMaterialChange($selectedUUID);

	$: stop = value;
	$: shade = 100 - stop > 50 ? 100 : 0;
	$: generateStyle(value);
</script>

<div
	class="metalness"
	style:--left={`${value}%`}
	style:--markerShape={`5% 93%, 5% ${b}%, 93% ${c}%, 90% 93%`}
	style:--borderShape={`0% 100%, 0% ${a}%, 100% ${d}%, 100% 100%`}
	style:--markerColor={`hsl(0, 0%, ${stop}%)`}
	style:--markerBorder={`hsl(1, 0%, ${shade}%)`}
	style:--hsl-background={`linear-gradient(90deg, 
							hsl(1, 1%, 10%) 0%,  
							hsl(1, 1%, 50%) ${stop}%,  
							hsl(1, 1%, 90%) 100%,  
							hsl(1, 1%, 90%) 100%)`}
>
	<span class="metalnessSpan" id="metalnessSpan" />
	<div class="metalnessSlider" bind:offsetHeight={height} bind:offsetWidth={width}>
		<input
			id="metalnessSlider"
			name="metalnessSlider"
			class="metalnessSliderInput"
			type="range"
			{min}
			{max}
			{step}
			aria-label="metalic slider"
			bind:value
			on:input={onInput}
		/>
	</div>
	<div id="metalnessMarker" class="metalnessMarker" />
</div>

<style>
	.metalness {
		direction: ltr;
		margin: 20px auto;
		border-radius: 5px;
		position: relative;
		width: calc(100% - 30px);
		height: 30px;
	}
	.metalnessSlider {
		position: absolute;
		width: calc(100% + 16px);
		height: 100%;
		left: -8px;
		top: -2px;
		margin: 0;
		background-color: transparent;
		opacity: 0;
		cursor: pointer;
		appearance: none;
		-webkit-appearance: none;
	}

	.metalnessSliderInput {
		width: 100%;
		height: 100%;
	}

	.metalnessMarker {
		position: absolute;
		width: 16px;
		height: 120%;
		left: var(--left);
		clip-path: polygon(var(--borderShape));
		bottom: 0%;
		margin-left: -8px;
		background-color: var(--markerBorder);
		box-shadow: 0 0 1px #888;
		pointer-events: none;
	}

	.metalnessMarker::after {
		content: '';
		display: block;
		width: 100%;
		height: 100%;
		margin: auto;
		clip-path: polygon(var(--markerShape));
		background-color: var(--markerColor);
		pointer-events: none;
	}
	.metalnessSpan {
		display: block;
		width: 100%;
		height: 100%;
		background: var(--hsl-background);
		clip-path: polygon(0% 100%, 0% 80%, 100% 0%, 100% 100%);
	}
	input[type='range']::-moz-range-thumb {
		width: 8px;
		height: 100%;
		border: 0;
	}
	input[type='range']::-moz-range-track {
		width: 100%;
		height: 100%;
		border: 0;
	}
</style>
