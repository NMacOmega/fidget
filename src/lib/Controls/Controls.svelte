<script>
	import ColorIcon from './ColorIcon/ColorIcon.svelte';
	import FidgetIcon from './FidgetIcon/FidgetIcon.svelte';
	import Slider from './../Slider/Slider.svelte';
	import FidgetChoiceMenu from './FidgetChoiceMenu.svelte';
	import ColorChoiceMenu from './ColorChoiceMenu/ColorChoiceMenu.svelte';
	import { zoom } from '$stores/camera';
	// import { currentFidgetName } from '$stores/activeMaterialOLD';

	let zoombarOpen = false;
	let choosingFidget = false;
	let choosingColor = false;
	const onZoomBarChange = (e) => zoom.setFromValue(Number(e.currentTarget.value));
</script>

<svelte:window
	on:click={(e) => {
		let targetClass = e?.target?.className || '';
		if (targetClass.includes == undefined) targetClass = '';
		if (targetClass.includes('zoomButton') || targetClass.includes('zoomButtonIcon')) return;
		zoombarOpen = false;
	}}
/>

<div class="controls">
	<div class="bg" />
	{#if choosingFidget}
		<FidgetChoiceMenu on:close={() => (choosingFidget = false)} />
	{:else if choosingColor}
		<ColorChoiceMenu on:close={() => (choosingColor = false)} />
	{:else}
		<div class="colorIcon" on:click={() => (choosingColor = true)}>
			<ColorIcon hexColor={'blue'} />
		</div>
		<div class="fidgetIcon">
			<FidgetIcon icon={$currentFidgetName} on:click={() => (choosingFidget = true)} />
		</div>
		<div class="zoom">
			<div
				class="zoomBar"
				style:transform={`translateX(${zoombarOpen ? 'calc(var(--ts) * 0.4)' : '210px'})`}
			>
				<div class="zoomIcons">
					<i class="fa-solid fa-magnifying-glass-plus" />
					<i class="fa-solid fa-magnifying-glass-minus" />
				</div>
				<Slider vertical value={$zoom} on:input={onZoomBarChange} min={1} max={99} step={5} />
			</div>
			<button
				class="zoomButton"
				style:transform={`translateX(${!zoombarOpen ? '8px' : '-8px'})`}
				on:click={() => (zoombarOpen = !zoombarOpen)}
				><i class="fa-solid fa-magnifying-glass-minus zoomButtonIcon" /></button
			>
		</div>
	{/if}
</div>

<style type="postcss">
	.controls {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		display: grid;
		grid-template-columns: 10px min(35vw, 10rem) min(25vw, 15rem) 1fr 80px 10px;
		grid-template-rows: 1fr 6rem 10px min(35vw, 10rem) 10px;
		grid-template-areas:
			'. . . . . .'
			'colormenu colormenu colormenu colormenu colormenu colormenu'
			'. . . . . .'
			'. color fidget . zoom .'
			'. . . . . .';
		pointer-events: none;
	}

	.controls > * {
		pointer-events: auto;
	}

	.bg {
		background-color: hsla(1, 100%, 0%, 0.2);
		grid-column: 1/ -2;
		grid-row: -4 / -1;
		border-radius: 0 80px 30px 0;
	}

	.colorIcon {
		grid-area: color;
		width: min(100%, 10rem);
		height: min(100%, 10rem);
	}

	.fidgetIcon {
		grid-area: fidget;
		width: min(25vw, 7rem);
		height: min(25vw, 7rem);
		align-self: end;
		margin-left: 20px;
	}

	.zoom {
		--l: 50px; /* line thickness*/
		--s: 80px; /* thumb size*/
		--w: 50px; /* thumb width */
		--ts: 250px; /*track size*/
		--b: transparent; /*track color*/
		--tc: #ababab; /*thumb color*/
		--tb: black; /*thumb border color*/

		grid-area: zoom;
		position: absolute;
		bottom: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
		padding-right: 30px;
		padding-bottom: 20px;
		pointer-events: none;
	}

	.zoom > * {
		pointer-events: auto;
	}

	.zoomBar {
		--offset: 100vw;
		display: flex;
		align-items: center;
		justify-content: center;

		height: var(--ts);
		width: var(--ts); /*Needed so thumb can cover both ends of the slider*/
		transform: translateX(var(--offset)); /*Needed to move slider to side of the screen*/
		transition: transform 0.4s;
		margin: 30px 0;
	}

	.zoomButton {
		color: white;
		border: 1px solid white;
		border-radius: 10px;
		width: 4rem;
		height: 6rem;
		transform: translateX(-8px);
		transition: transform 0.4s;
	}

	.zoomIcons {
		position: absolute;
		background-color: white;
		width: 50px;
		height: 250px;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		border-radius: 20px;
		align-items: center;
		justify-content: space-between;
		padding: 20px 0;
	}

	.zoomIcons > i {
		color: black;
		font-size: 2rem;
	}

	:global(.zoomBar > .slider) {
		width: 100%;
		height: var(--l);
		-webkit-appearance: none;
		-moz-appearance: none;
		background: var(--b);
		appearance: none;
		cursor: pointer;
	}

	@define-mixin zoomThumbStyle {
		height: var(--s);
		width: var(--w);
		aspect-ratio: 1;
		border-radius: 10px;
		background-color: var(--tc);
		border: 1px solid var(--tb);
	}

	/* THUMBS */
	/* horizontal */
	:global(.zoomBar > .slider::-webkit-slider-thumb) {
		@mixin zoomThumbStyle;
	}
	:global(.zoomBar > .slider::-moz-range-thumb) {
		@mixin zoomThumbStyle;
	}
	:global(.zoomBar > .slider::-ms-thumb) {
		@mixin zoomThumbStyle;
	}
	/* vertical */
	:global(.zoomBar > .slider.vertical::-webkit-slider-thumb) {
		@mixin zoomThumbStyle;
	}
	:global(.zoomBar > .slider.vertical::-moz-range-thumb) {
		@mixin zoomThumbStyle;
	}
	:global(.zoomBar > .slider.vertical::-ms-thumb) {
		@mixin zoomThumbStyle;
	}
</style>
