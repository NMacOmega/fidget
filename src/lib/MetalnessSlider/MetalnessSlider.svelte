<script>
	import { metalness } from '$lib/stores';
	export let max = 1;
	export let min = 0;
	export let step = 0.01;

	let value = $metalness,
		element;

	//CSS Variables
	let left, color, borderShape, markerShape, markerColor, markerBorder, hslBackground;

	const clamp = (num, max, min) => Math.min(max, Math.max(min, num));

	const generateStyle = (metalness) => {
		const leftPercent = metalness * 100 || 0;
		left = `${leftPercent}%`;

		const height = element?.offsetHeight || 0;
		const width = element?.offsetWidth || 0;
		const angle = Math.atan(height / width);

		let a = metalness - 0.1;
		let b = width * a * Math.tan(angle);
		let c = metalness + 0.2;
		let d = width * c * Math.tan(angle);
		a = clamp(100 - a * 100, 100, -1);
		b = clamp(110 - (b / height) * 100, 83, 1);
		c = clamp(110 - c * 100, 75, 10);
		d = clamp(100 - (d / height) * 100, 65, 0);

		borderShape = `0% 100%, 0% ${a}%, 100% ${d}%, 100% 100%`;
		markerShape = `5% 93%, 5% ${b}%, 93% ${c}%, 90% 93%`;

		const stop = metalness * 100;
		const shade = 100 - stop > 50 ? 100 : 0;
		markerColor = `hsl(0, 0%, ${stop}%)`;
		markerBorder = `hsl(1, 0%, ${shade}%)`;
		hslBackground = `linear-gradient(90deg, 
		hsl(1, 1%, 10%) 0%,  
		hsl(1, 1%, 50%) ${stop}%,  
		hsl(1, 1%, 90%) 100%,  
		hsl(1, 1%, 90%) 100%)`;
	};
	$: generateStyle($metalness);
	$: $metalness = value;
</script>

<div
	class="metalness"
	style:--left={left}
	style:--color={color}
	style:--markerShape={markerShape}
	style:--borderShape={borderShape}
	style:--markerColor={markerColor}
	style:--markerBorder={markerBorder}
	style:--hsl-background={hslBackground}
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
