<script lang="ts">
	export let min = 0,
		max = 1,
		step = 0.1,
		value = 0.5,
		vertical = false;

	let progress = 0;
	$: progress = (value / max) * 100;
</script>

<input
	class={`slider ${vertical ? 'vertical' : ''}`}
	type="range"
	{step}
	{value}
	{min}
	{max}
	on:input
	{...$$restProps}
/>

<style type="postcss">
	@define-mixin crossBrowserStyle {
		/*Basic test style*/
		/* cursor: pointer;
		height: var(--thumb-size);
		width: var(--thumb-size);
		border-radius: 50%;
		border: none;
		outline: 1px solid var(--thumb-outline);
		margin-top: calc((var(--thumb-size) / -2 + var(--track-width) / 2) - 1px);
		background-color: var(--thumb-color); */
	}

	.slider {
		--thumb-border: rgb(80, 80, 80);
		--thumb-color: rgb(80, 80, 80);
		--thumb-size: 16px;

		/* Allows us to style the slider our own way */
		-webkit-appearance: none;
		appearance: none;
	}

	.slider.vertical {
		transform: rotate(-90deg);
		transform-origin: center;
	}

	/* https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/ */
	/* Special styling for WebKit/Blink */
	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		@mixin crossBrowserStyle;
	}

	/* All the same stuff for Firefox */
	.slider::-moz-range-thumb {
		@mixin crossBrowserStyle;
	}

	/* All the same stuff for IE */
	.slider::-ms-thumb {
		@mixin crossBrowserStyle;
	}
</style>
