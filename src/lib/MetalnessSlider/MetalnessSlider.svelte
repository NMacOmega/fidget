<script lang="ts">
	import { metalness } from '$stores/material';
	export let max = 1;
	export let min = 0;
	export let step = 0.01;

	let value = $metalness,
		element: HTMLElement;

	//CSS Variables
	let a = 0,
		b = 0,
		c = 0,
		d = 0,
		stop = 0,
		shade = 0,
		left = 0;

	const clamp = (num: number, max: number, min: number) => Math.min(max, Math.max(min, num));

	const calcStyleValues = (metalness: number, width: number, height: number) => {
		const left = metalness * 100 || 0;
		const angle = Math.atan(height / width);

		const a = metalness - 0.1;
		const b = width * a * Math.tan(angle);
		const c = metalness + 0.2;
		const d = width * c * Math.tan(angle);

		const stop = metalness * 100;
		const shade = 100 - stop > 50 ? 100 : 0;

		return {
			a: clamp(100 - a * 100, 100, -1),
			b: clamp(110 - (b / height) * 100, 83, 1),
			c: clamp(110 - c * 100, 75, 10),
			d: clamp(100 - (d / height) * 100, 65, 0),
			stop,
			shade,
			left
		};
	};

	$: ({ a, b, c, d, stop, shade, left } = calcStyleValues(
		$metalness,
		element?.offsetHeight || 0,
		element?.offsetWidth || 0
	));
</script>

<div
	class="metalness"
	style:--left={`${left}%`}
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
	<input
		id="metalnessSlider"
		name="metalnessSlider"
		class="metalnessSlider"
		type="range"
		{min}
		{max}
		{step}
		aria-label="metalic slider"
		bind:value
		bind:this={element}
	/>
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
