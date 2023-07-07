<script>
	export let value = 0,
		color,
		min = 0,
		max = 360;
	let left, style, flatColor;

	$: flatColor = `hsl(${color?.hsl?.h || '0'}, 100%, 50%)`;
	$: left = (value / max) * 100;
	$: style = `--left: ${left}%; --color:${flatColor};`;
</script>

<div class="colorHue" {style}>
	<input
		id="colorHueSlider"
		name="colorHueSlider"
		class="colorHueSlider"
		type="range"
		{min}
		{max}
		step="1"
		aria-label="Hue slider"
		bind:value
	/>
	<div id="colorHueMarker" class="colorHueMarker" />
</div>

<style>
	.colorHue {
		direction: ltr;
		margin: 20px auto;
		border-radius: 5px;
		position: relative;
		width: calc(100% - 30px);
		height: 10px;
		background-image: linear-gradient(
			to right,
			red 0,
			#ff0 16.66%,
			#0f0 33.33%,
			#0ff 50%,
			#00f 66.66%,
			#f0f 83.33%,
			red 100%
		);
	}
	.colorHueSlider {
		position: absolute;
		width: calc(100% + 16px);
		height: 8px;
		left: -8px;
		top: -4px;
		margin: 0;
		background-color: transparent;
		opacity: 0;
		cursor: pointer;
		appearance: none;
		-webkit-appearance: none;
	}

	.colorHueMarker {
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
		background-color: var(--color);
		box-shadow: 0 0 1px #888;
		pointer-events: none;
	}

	input[type='range']::-moz-range-thumb {
		width: 8px;
		height: 8px;
		border: 0;
		background-color: var(--color);
	}
	input[type='range']::-moz-range-track {
		width: 100%;
		height: 8px;
		border: 0;
	}
</style>
