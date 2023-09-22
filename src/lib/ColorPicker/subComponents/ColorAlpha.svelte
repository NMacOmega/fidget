<script lang="ts">
	import { hsl, opacity, selectedUUID } from '$stores/material';

	export let min = 0.0,
		max = 100,
		step = 0.1;

	//CSS values
	let value = $opacity || 0;
	let h = 0,
		s = 0,
		l = 0;
	//@TODO: Maybe on lighter hues change the border to black?

	const onMaterialChange = (_trigger: typeof $selectedUUID) => (value = $opacity);
	const onInput = (str: string) => opacity.set(Number(str));

	$: onMaterialChange($selectedUUID);
	$: ({ h, s, l } = $hsl);
</script>

<div
	class="colorAlpha"
	style:--left={`${$opacity}%`}
	style:--color={`hsl(${h},${100}%,${50}%)`}
	style:--opacity-color={`hsla(${h}, ${s}%, ${l}%, ${opacity})`}
>
	<input
		id="colorAlphaSlider"
		name="colorAlphaSlider"
		class="colorAlphaSlider"
		type="range"
		{min}
		{max}
		{step}
		aria-label="Alpha slider"
		bind:value
		on:input={(e) => onInput(e.currentTarget.value)}
	/>
	<div id="colorAlpaMarker" class="colorAlphaMarker" />
	<span class="colorAlphaSpan" id="colorAlphaSpan" />
</div>

<style>
	.colorAlpha {
		direction: ltr;
		margin: 20px auto;
		border-radius: 5px;
		position: relative;
		width: calc(100% - 30px);
		height: 10px;
		background-image: repeating-linear-gradient(
				45deg,
				#aaa 25%,
				transparent 25%,
				transparent 75%,
				#aaa 75%,
				#aaa
			),
			repeating-linear-gradient(45deg, #aaa 25%, #fff 25%, #fff 75%, #aaa 75%, #aaa);
		background-position: 0 0, 4px 4px;
		background-size: 8px 8px;
	}
	.colorAlphaSlider {
		position: absolute;
		width: calc(100% + 16px);
		height: 8px;
		left: -8px;
		top: -2px;
		margin: 0;
		background-color: transparent;
		opacity: 0;
		cursor: pointer;
		appearance: none;
		-webkit-appearance: none;
	}

	.colorAlphaMarker {
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
		position: absolute;
		width: 16px;
		height: 16px;
		left: var(--left);
		top: 50%;
		margin-left: -8px;
		transform: translateY(-50%);
		border: 2px solid #fff;
		border-radius: 50%;
		background-color: var(--opacity-color);
		box-shadow: 0 0 1px #888;
		pointer-events: none;
	}

	.colorAlphaSpan {
		display: block;
		height: 100%;
		width: 100%;
		border-radius: inherit;
		background-image: linear-gradient(90deg, rgba(0, 0, 0, 0), var(--color));
	}

	input[type='range']::-moz-range-thumb {
		width: 8px;
		height: 8px;
		border: 0;
		background-color: var(--opacity-color);
	}
	input[type='range']::-moz-range-track {
		width: 100%;
		height: 8px;
		border: 0;
	}
</style>
