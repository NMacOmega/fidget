<script lang="ts">
	import Slider from '$lib/Slider/Slider.svelte';
	import type { ColorObject, HueNumberType } from '$lib/colorFunctions';
	import ColorIcon from './ColorIcon/ColorIcon.svelte';
	import { createEventDispatcher } from 'svelte';
	import { Color } from '$lib/colorFunctions';
	import { writable } from 'svelte/store';
	export let color: Color = new Color();
	let colorObj = writable<Color>(color);
	export let metalness = 0.33,
		glossiness = 75,
		opacity = 1,
		type = null;
	const dispatch = createEventDispatcher();

	//Used to get grid size for marker position calculations
	let colorArea: HTMLElement;
	let isMouseCaptured = false;
	let markerOffset = {
		left: $colorObj.hsl.s,
		top: 100 - $colorObj.hsl.l
	};
	let activeTab: 'color' | 'material' | 'all' = 'color';
	let colorMode: 'hex' | 'hsl' | 'hsv' | 'rgb' = 'hsl';

	let flatColor: string,
		buttonColor: string,
		buttonOutlineColor: string,
		thumbColor: string,
		iconOpacityGradient: string,
		glossinessSliderBG: string,
		glossinessSliderThumb: string,
		colorText: string;
	generateColorVariables(color, opacity, metalness, glossiness);
	generateColorText(color, colorMode);

	function generateColorVariables(
		newColor: Color,
		opacity: number,
		metalness: number,
		glossiness: number
	) {
		color = { ...newColor };
		flatColor = `hsl(${newColor.hsl.h}, 100%, 50%)`;
		buttonColor = `#${newColor.hex}`;
		buttonOutlineColor = newColor.hsl.s < 50 && color.hsl.l > 50 ? 'black' : 'white';
		thumbColor = `hsl(${newColor.hsl.h}deg, ${newColor.hsl.s}%, ${newColor.hsl.l}%, ${opacity})`;
		iconOpacityGradient = `linear-gradient(0deg, #${newColor.hex} ${opacity * 100}%, black ${
			opacity * 100
		}%)`;
		let { h, s } = newColor.hsl;
		let lowGlossySliderColor = `hsl(${h}, ${s}%, 20%)`;
		let HighGlossySliderColor = `hsl(${h}, ${s}%, 60%)`;
		glossinessSliderBG = `linear-gradient(90deg, ${lowGlossySliderColor}, ${HighGlossySliderColor})`;
		glossinessSliderThumb = flatColor;
	}

	function generateColorText(color: Color, mode: typeof colorMode) {
		//TODO: Round color numbers and capitalize hex characters
		if (['hsl', 'hsv', 'hex', 'rgb'].indexOf(mode) < 0) return;
		let result;
		if (mode === 'hex') result = `#${color.hex?.toLocaleUpperCase()}`;
		if (mode === 'hsl') {
			let { h, s, l } = color.hsl;
			result = `hsl(${h}, ${s}%, ${l}%)`;
		}
		if (mode === 'hsv') {
			let { h, s, v } = color.hsv;
			result = `hsv(${h}, ${s}%, ${v}%)`;
		}
		if (mode === 'rgb') {
			let { r, g, b } = color.rgb;
			result = `R: ${r}, G:${g}, B:${b}`;
		}
		colorText = result;
		colorMode = mode;
	}

	function parseTextInput(text: string, mode: typeof colorMode) {
		//TODO: Make this parse in real time and update Color
	}

	//Needed for bug that prevents setting range value above 100
	let hueSliderVal: HueNumberType;
	setTimeout(() => (hueSliderVal = $colorObj.hsl.h), 1);

	const onColorChange = (newColor: Color) => {
		if (!newColor.isValidColor) return;
		colorObj.set({ ...newColor });
		dispatch('change', {
			color: { ...newColor },
			metalness,
			opacity,
			glossiness
		});
		generateColorVariables(newColor, opacity, metalness, glossiness);
		generateColorText(newColor, colorMode);
	};

	const onMaterialChange = (m: number, g: number, o: number) => {
		metalness = m;
		glossiness = g;
		opacity = o;
		dispatch('change', {
			color: { ...color },
			metalness,
			glossiness,
			opacity
		});
		generateColorVariables(color, opacity, metalness, glossiness);
	};

	const clamp = (num: number, max: number, min: number) => Math.min(Math.max(num, min), max);

	const onAreaClick = (x: number, y: number, { width, height, top, left }: DOMRect) => {
		let newSaturation = clamp(100 - ((width - (x - left)) / width) * 100, 100, 0);
		let newTop = clamp(((height - (y - top)) / height) * 100, 100, 0);
		let newMaxLum = 100 - (newSaturation * 50) / 100;
		let newLuminosity = (newMaxLum * newTop) / 100;
		markerOffset = {
			left: newSaturation,
			top: 100 - newTop
		};
		let newColor = new Color({ h: $colorObj.hsl.h, s: newSaturation, l: newLuminosity });
		onColorChange(newColor);
		colorObj.set({ ...newColor });
	};

	const activeTabStyle = 'color: black; background-color: white;';
</script>

<svelte:window
	on:mousemove={(e) => {
		if (isMouseCaptured) onAreaClick(e.clientX, e.clientY, colorArea.getBoundingClientRect());
	}}
	on:mouseup={() => (isMouseCaptured = false)}
/>
<div class="container" style:--flatColor={flatColor}>
	<input
		type="text"
		class="textInput"
		value={colorText}
		on:input={(e) => parseTextInput(e.currentTarget.value, colorMode)}
	/>
	<div class="color-mode">
		<button
			class={`color-mode-btn hsl ${colorMode === 'hsl' && 'active'}`}
			on:click={() => generateColorText(color, 'hsl')}>HSL</button
		>
		<button
			class={`color-mode-btn hsv ${colorMode === 'hsv' && 'active'}`}
			on:click={() => generateColorText(color, 'hsv')}>HSV</button
		>
		<button
			class={`color-mode-btn rgb ${colorMode === 'rgb' && 'active'}`}
			on:click={() => generateColorText(color, 'rgb')}>RGB</button
		>
		<button
			class={`color-mode-btn hex ${colorMode === 'hex' && 'active'}`}
			on:click={() => generateColorText(color, 'hex')}>HEX</button
		>
	</div>
	<div class="icon" style:--iconOpacityGradient={iconOpacityGradient}>
		<ColorIcon hexColor={color.hex} {metalness} {glossiness} />
	</div>
	<div class="buttons">
		<button
			class="color"
			on:click={() => (activeTab = 'color')}
			style={activeTab === 'color' ? activeTabStyle : null}>Color</button
		>
		<button
			class="material"
			on:click={() => (activeTab = 'material')}
			style={activeTab === 'material' ? activeTabStyle : null}>Material</button
		>
		<button class="close" on:click={() => dispatch('close')}
			><span class="close-text">DONE</span></button
		>
	</div>
	<div class="colorTab" style:--display={activeTab != 'color' ? 'none' : 'block'}>
		<div class="hueSlider">
			<div class="sliderBarBG" />
			<Slider
				min={1}
				max={360}
				step={1}
				bind:value={hueSliderVal}
				on:input={(e) =>
					onColorChange(new Color({ ...$colorObj.hsl, h: Number(e.currentTarget.value) }))}
			/>
		</div>
		<div
			class="colorGrid"
			bind:this={colorArea}
			on:click={(e) => onAreaClick(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect())}
			on:mousedown={() => (isMouseCaptured = true)}
			on:mouseup={() => (isMouseCaptured = false)}
			on:touchend={() => (isMouseCaptured = false)}
			style:--bgColor={`#${$colorObj.hex}`}
		>
			<span
				class="colorGridMarker"
				style:left={`${markerOffset.left}%`}
				style:top={`${markerOffset.top}%`}
				style:--buttonOutline={buttonOutlineColor}
				style:--fillColor={buttonColor}
			/>
		</div>
	</div>
	<div class="materialTab" style:--display={activeTab != 'material' ? 'none' : 'block'}>
		<div class="opacity">
			<h2>Opacity</h2>
			<div class="opacitySlider" style:--opacityThumbColor={thumbColor}>
				<div class="sliderBarBG" style:--bg={buttonColor} />
				<Slider
					min={0}
					max={1}
					step={0.01}
					bind:value={opacity}
					on:input={(e) => onMaterialChange(metalness, glossiness, Number(e.currentTarget?.value))}
				/>
			</div>
		</div>
		<div class="metalness">
			<h2>Metalness</h2>
			<div class="metalnessSlider">
				<div class="sliderBarBG" />
				<Slider
					min={0}
					max={1}
					step={0.01}
					bind:value={metalness}
					on:input={(e) => onMaterialChange(Number(e.currentTarget?.value), glossiness, opacity)}
				/>
			</div>
		</div>
		<div class="glossiness">
			<h2>Glossiness</h2>
			<div
				class="glossinessSlider"
				style:--glossinessSliderBG={glossinessSliderBG}
				style:--glossinessSliderThumb={glossinessSliderThumb}
			>
				<div class="sliderBarBG" />
				<Slider
					min={0}
					max={1}
					step={0.01}
					bind:value={glossiness}
					on:input={(e) => onMaterialChange(metalness, Number(e.target?.value), opacity)}
				/>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.container {
		--flatColor: hsl(70, 100%, 50%);
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		background-color: hsla(1, 100%, 1%, 0.8);
		display: grid;
		grid-template-rows: repeat(2, max-content) max-content repeat(3, max-content);
		grid-template-areas:
			'text'
			'color-modes'
			'icon'
			'buttons'
			'tabs';
	}

	.textInput {
		color: black;
		border-radius: 5px;
		padding: 6px;
		font-size: 2rem;
		grid-area: text;
	}

	.color-mode {
		display: flex;
		align-items: end;
		justify-content: space-between;
		padding-top: 10px;
		grid-area: color-modes;
	}

	.color-mode-btn {
		/* width: 40px; */
		/* height: 20px; */
		width: min(24vw, 200px);
		padding: 5px;
		border-radius: 5px 5px 0 0;
		background-color: gray;
		font-size: 2rem;
	}

	.color-mode-btn.active {
		background-color: white;
		color: black;
	}

	.icon {
		--size: 200px;
		height: var(--size);
		width: var(--size);
		grid-area: icon;
		margin: auto;
	}

	:global(.icon .color) {
		background: var(--iconOpacityGradient);
	}

	.buttons {
		grid-area: buttons;
		display: flex;
		align-items: start;
		justify-items: start;
	}

	.color,
	.material {
		background-color: grey;
		border-radius: 0 0 5px 5px;
		padding: 5px 10px;
		margin: 0 2px;
	}

	.close {
		background-color: grey;
		border-radius: 10px;
		overflow: hidden;
		padding: 6px;
		margin: 10px 20px 10px auto;
		background-image: linear-gradient(gray, gray),
			linear-gradient(
				to bottom right,
				#b827fc 0%,
				#2c90fc 25%,
				#b8fd33 50%,
				#fec837 75%,
				#fd1892 100%
			);
		background-origin: border-box;
		background-clip: content-box, border-box;
	}

	.close-text {
		display: block;
		padding: 3px 8px;
	}

	.colorTab {
		display: var(--display);
		grid-area: tabs;
	}

	.hueSlider {
		--l: 50px; /* line thickness*/
		--s: 40px; /* thumb size*/
		--b: transparent; /*track color*/
		--tc: #ababab; /*thumb color*/
		--tb: black; /*thumb border color*/
		grid-area: hue-slider;
		position: relative;
		width: 100%;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hueSlider > .sliderBarBG {
		background: linear-gradient(
			90deg,
			rgba(255, 0, 0, 1) 0%,
			rgba(255, 154, 0, 1) 10%,
			rgba(208, 222, 33, 1) 20%,
			rgba(79, 220, 74, 1) 30%,
			rgba(63, 218, 216, 1) 40%,
			rgba(47, 201, 226, 1) 50%,
			rgba(28, 127, 238, 1) 60%,
			rgba(95, 21, 242, 1) 70%,
			rgba(186, 12, 248, 1) 80%,
			rgba(251, 7, 217, 1) 90%,
			rgba(255, 0, 0, 1) 100%
		);
		width: 90%;
		height: 20px;
		border-radius: 10vw;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
	}

	:global(.hueSlider > .slider) {
		width: 95%;
		height: var(--l);
		-webkit-appearance: none;
		-moz-appearance: none;
		background: var(--b);
		appearance: none;
		cursor: pointer;
		z-index: 10;
	}

	@define-mixin hueThumbStyle {
		height: var(--s);
		width: var(--s);
		aspect-ratio: 1;
		border-radius: 100vw;
		background-color: var(--flatColor);
		border: 1px solid var(--tb);
	}
	:global(.hueSlider > .slider::-webkit-slider-thumb) {
		@mixin hueThumbStyle;
	}
	:global(.hueSlider > .slider::-moz-range-thumb) {
		@mixin hueThumbStyle;
	}
	:global(.hueSlider > .slider::-ms-thumb) {
		@mixin hueThumbStyle;
	}
	.colorGrid {
		margin: auto;
		width: 400px;
		height: 400px;
		position: relative;
		background-image: linear-gradient(rgba(0, 0, 0, 0), #000),
			linear-gradient(90deg, #fff, 44%, var(--flatColor));
	}
	.colorGridMarker {
		--fillColor: white;
		--buttonOutline: black;
		--size: 40px;
		width: var(--size);
		height: var(--size);
		border-radius: 100vw;
		position: absolute;
		left: 0;
		top: 0;
		background-color: var(--fillColor);
		border: 3px solid var(--buttonOutline);
		cursor: pointer;
		transform: translate(-50%, -50%);
	}

	.materialTab {
		display: var(--display);
		min-height: 200px;
		grid-area: tabs;
	}

	.opacitySlider,
	.metalnessSlider,
	.glossinessSlider {
		--l: 50px; /* line thickness*/
		--s: 40px; /* thumb size*/
		--b: transparent; /*track color*/
		--tc: #ababab; /*thumb color*/
		--tb: black; /*thumb border color*/
		position: relative;
		width: 100%;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.opacity {
		grid-area: opacity;
	}
	.metalness {
		grid-area: metalness;
	}
	.glossiness {
		grid-area: roughness;
	}

	:global(.opacitySlider > .slider) {
		width: 95%;
		height: var(--l);
		-webkit-appearance: none;
		-moz-appearance: none;
		background: var(--b);
		appearance: none;
		cursor: pointer;
		z-index: 10;
	}

	.opacitySlider > .sliderBarBG {
		width: 90%;
		height: 20px;
		border-radius: 10vw;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;

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

	.opacitySlider > .sliderBarBG::after {
		content: '';
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 10vw;
		background: linear-gradient(90deg, transparent 20%, var(--bg, red) 90%);
	}

	@define-mixin opacityThumbStyle {
		height: var(--s);
		width: var(--s);
		aspect-ratio: 1;
		border-radius: 100vw;
		background-color: var(--opacityThumbColor, red);
		border: 3px solid white;
	}
	:global(.opacitySlider > .slider::-webkit-slider-thumb) {
		@mixin opacityThumbStyle;
	}
	:global(.opacitySlider > .slider::-moz-range-thumb) {
		@mixin opacityThumbStyle;
	}
	:global(.opacitySlider > .slider::-ms-thumb) {
		@mixin opacityThumbStyle;
	}

	:global(.metalnessSlider > .slider) {
		width: 95%;
		height: var(--l);
		-webkit-appearance: none;
		-moz-appearance: none;
		background: var(--b);
		appearance: none;
		cursor: pointer;
		z-index: 10;
	}

	.metalnessSlider > .sliderBarBG {
		background: linear-gradient(90deg, black, white);
		width: 90%;
		height: 20px;
		border-radius: 10vw;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
	}

	@define-mixin metalnessThumbStyle {
		height: var(--s);
		width: var(--s);
		aspect-ratio: 1;
		border-radius: 100vw;
		background-color: grey;
		border: 2px solid white;
	}
	:global(.metalnessSlider > .slider::-webkit-slider-thumb) {
		@mixin metalnessThumbStyle;
	}
	:global(.metalnessSlider > .slider::-moz-range-thumb) {
		@mixin metalnessThumbStyle;
	}
	:global(.metalnessSlider > .slider::-ms-thumb) {
		@mixin metalnessThumbStyle;
	}

	:global(.glossinessSlider > .slider) {
		width: 95%;
		height: var(--l);
		-webkit-appearance: none;
		-moz-appearance: none;
		background: var(--b);
		appearance: none;
		cursor: pointer;
		z-index: 10;
	}

	.glossinessSlider > .sliderBarBG {
		background: var(--glossinessSliderBG, linear-gradient(90deg, red, blue));
		width: 90%;
		height: 20px;
		border-radius: 10vw;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
	}

	@define-mixin glossinessThumbStyle {
		height: var(--s);
		width: var(--s);
		aspect-ratio: 1;
		border-radius: 100vw;
		background-color: var(--glossinessSliderThumb, white);
		border: 2px solid white;
	}
	:global(.glossinessSlider > .slider::-webkit-slider-thumb) {
		@mixin glossinessThumbStyle;
	}
	:global(.glossinessSlider > .slider::-moz-range-thumb) {
		@mixin glossinessThumbStyle;
	}
	:global(.glossinessSlider > .slider::-ms-thumb) {
		@mixin glossinessThumbStyle;
	}
</style>
