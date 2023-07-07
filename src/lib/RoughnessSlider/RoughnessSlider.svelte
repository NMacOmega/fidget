<script>
	import { roughnessStore, colorStore, selectedUUIDStore } from '$lib/stores';

	export let max = 1,
		min = 0,
		step = 0.01;

	let glossiness = 0;

	//CSS Variablss
	let left,
		height = 100,
		color,
		hslBackground;

	const setValuesOnMaterialChange = (UUID_trigger) => {
		glossiness = 1 - $roughnessStore;
	};
	const updateRoughness = (e) => {
		const val = e?.target?.value;
		glossiness = val;
		let roughness = 1 - glossiness;
		if (roughness <= 0) roughness = 0.0001;
		roughnessStore.setMaterial(roughness);
	};
	const updateMarkerPosition = (leftPercent = 0) => {
		const minDisplay = 20;
		const heightPercent = leftPercent < minDisplay ? minDisplay : leftPercent;
		left = `${leftPercent}%`;
		height = `${heightPercent}%`;
	};

	const updateMarkerColor = (hue = 0, stop = 0) => {
		color = `hsl(${hue}, 100%, 60%)`;
		hslBackground = `linear-gradient(90deg, 
		hsl(${hue}, 1%, 90%) 0%,  
		hsl(${hue}, 40%, 50%) ${stop}%,  
		hsl(${hue}, 100%, 50%) 100%,  
		hsl(${hue}, 100%, 50%) 100%)`;
	};

	$: setValuesOnMaterialChange($selectedUUIDStore);
	$: updateMarkerPosition(glossiness * 100);
	$: updateMarkerColor($colorStore?.hsl?.h, glossiness * 100);
</script>

<div
	class="roughness"
	style:--left={left}
	style:--height={height}
	style:--color={color}
	style:--hsl-color={hslBackground}
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
		bind:value={glossiness}
		on:input={(e) => updateRoughness(e)}
	/>
	<div id="roughnessMarker" class="roughnessMarker" />
</div>

<style>
	.roughness {
		direction: ltr;
		margin: 20px auto;
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
