<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let max = 100,
		min = 0,
		step = 0.1,
		value = 0;

	//CSS Variabls
	/**How tall to make the leading edge of the slider*/
	let height = 100;
	/**The color hue for the slider to match the color of the option*/
	export let hue = 0;
	// The minimum height to show the slider so it does not disapear
	const minDisplay = 20;

	const onInput = (str: string) => dispatch('roughnessChange', { value: Number(str) });
	$: height = value < minDisplay ? minDisplay : value;
</script>

<div
	class="roughness"
	style:--left={`${value}%`}
	style:--height={`${height}%`}
	style:--color={`hsl(${hue}, 100%, 60%)`}
	style:--hsl-color={`linear-gradient(90deg, 
						hsl(${hue}, 1%, 90%) 0%,  
						hsl(${hue}, 40%, 50%) ${value}%,  
						hsl(${hue}, 100%, 50%) 100%,  
						hsl(${hue}, 100%, 50%) 100%)`}
>
	<span class="roughnessSpan" id="roughnessSpan" />
	<input
		id="roughnessSlider"
		name="roughnessSlider"
		class="roughnessSlider"
		type="range"
		{min}
		{max}
		{step}
		aria-label="roughness slider"
		bind:value
		on:input={(e) => onInput(e.currentTarget.value)}
	/>
	<div id="roughnessMarker" class="roughnessMarker" />
</div>

<style>
	.roughness {
		direction: ltr;
		margin: auto;
		border-radius: 5px;
		position: relative;
		width: calc(100% - 30px);
		height: 30px;
		background-position: 0 0, 4px 4px;
		background-size: 8px 8px;
	}
	.roughnessSlider {
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

	.roughnessMarker {
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
		position: absolute;
		width: 16px;
		height: var(--height, 100%);
		left: var(--left);
		bottom: 0%;
		margin-left: -8px;
		border: 2px solid #fff;
		background-color: var(--color);
		box-shadow: 0 0 1px #888;
		pointer-events: none;
	}

	.roughnessSpan {
		display: block;
		width: 100%;
		height: 100%;
		background: var(--hsl-color);
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
