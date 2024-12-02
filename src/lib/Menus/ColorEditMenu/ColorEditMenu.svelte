<script lang="ts">
	import { currentMaterialOptions } from '$stores/materialList';
	import ColorArea from '../MenuComponents/ColorArea/ColorArea.svelte';
	import ColorHueSlider from '../MenuComponents/ColorHueSlider/ColorHueSlider.svelte';
	import MetalnessSlider from '../MenuComponents/MetalnessSlider/MetalnessSlider.svelte';
	import RoughnessSlider from '../MenuComponents/RoughnessSlider/RoughnessSlider.svelte';
	import OpacitySlider from '../MenuComponents/OpacitySlider/OpacitySlider.svelte';
	import PaletteTab from '../MenuComponents/PaletteTab/PaletteTab.svelte';
	import { generateColor, parseColorFromText, generateColorAsText } from './textFunctions';
	import type { ColorMode } from './textFunctions';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let activeTab = 'color';
	const colorModeOptions: ColorMode[] = ['hex', 'hsv', 'hsl', 'rgb'];
	let colorMode: ColorMode = 'hex';
	const materialIndex = $currentMaterialOptions.activeOption;

	//used to store and modify color data form the controls before application
	let color = parseColorFromText($currentMaterialOptions.options[materialIndex].color, 'hex').color;

	//used to revert to original props if we cancel
	let original = { color: { ...color }, metalness: 0, roughness: 0, opacity: 0 };
	original.metalness = $currentMaterialOptions.options[materialIndex].metalness;
	original.roughness = $currentMaterialOptions.options[materialIndex].roughness;
	original.opacity = $currentMaterialOptions.options[materialIndex].opacity;

	//Bound to ColorArea for updates in real time;
	let h = color.hsv.h;
	let s = color.hsv.s;
	let v = color.hsv.v;

	//used to keep track of properties tab values
	let metalness = original.metalness;
	let roughness = original.roughness;
	let opacity = original.opacity;

	//Used to control what shows in the text field
	let colorFieldText = `${color.hex}`;
	let colorFieldMarquis: string;
	$: colorFieldMarquis = `#${color.hex}`;

	//@todo: I also wonder if changing the color preview icon to be a button to edit color and the
	//button next to it to show props and allow an edit operation would be more intuitive. Make
	//clipboard icons first

	function onColorAreaChange(newH = -1, newS = -1, newV = -1) {
		const newColor = generateColor.fromHSV([newH, newS, newV]);
		if (!newColor.isValid) return;
		color = { ...newColor };
		currentMaterialOptions.updateColor(materialIndex, newColor.hex);
		h = newColor.hsv.h;
		s = newColor.hsv.s;
		v = newColor.hsv.v;
		colorFieldText = generateColorAsText(newColor, colorMode);
	}
	const onHueChange = (newH = -1) => onColorAreaChange(newH, s, v);

	function onColorModeChange(newMode: ColorMode) {
		colorMode = newMode;
		colorFieldText = generateColorAsText(color, newMode);
	}
	function onTextChange(textInput: string) {
		const parseResult = parseColorFromText(textInput, colorMode);
		if (parseResult.color.isValid) {
			color = { ...parseResult.color };
			currentMaterialOptions.updateColor(materialIndex, parseResult.color.hex);
			h = parseResult.color.hsv.h;
			s = parseResult.color.hsv.s;
			v = parseResult.color.hsv.v;
		}
	}

	function onPaletteApply(color: string, metalness: number, roughness: number, opacity: number) {
		currentMaterialOptions.updateAll(materialIndex, color, metalness, roughness, opacity);
	}

	function onApplyButtonClick() {
		dispatch('close');
	}
	function onCancelButtonClick() {
		currentMaterialOptions.updateAll(
			materialIndex,
			original.color.hex,
			original.metalness,
			original.roughness,
			original.opacity
		);
		dispatch('close');
	}
	function onMetalnessChange(m = -1) {
		if (m < 0) return;
		currentMaterialOptions.updateMetalness(materialIndex, m);
		metalness = m;
	}
	function onRoughnessChange(r = -1) {
		if (r < 0) return;
		currentMaterialOptions.updateRoughness(materialIndex, r);
		roughness = r;
	}
	function onOpacityChange(o = -1) {
		if (o < 0) return;
		currentMaterialOptions.updateOpacity(materialIndex, o);
		opacity = o;
	}
</script>

<div class="colorEditMenu">
	<div class="colorEditControls">
		<div class="colorEditTabs">
			<div
				class={`colorEditTab ${activeTab === 'color' ? 'activeTab' : ''}`}
				on:click={() => (activeTab = 'color')}
			>
				Color
			</div>
			<div
				class={`colorEditTab ${activeTab === 'properties' ? 'activeTab' : ''}`}
				on:click={() => (activeTab = 'properties')}
			>
				properties
			</div>
			<div
				class={`colorEditTab ${activeTab === 'clipboard' ? 'activeTab' : ''}`}
				on:click={() => (activeTab = 'clipboard')}
			>
				Pallete
			</div>
			<div class="closeTab">
				<button class="cancelButton" on:click={onCancelButtonClick}>Cancel</button>
			</div>
		</div>
		{#if activeTab === 'color'}
			<div class="editColor">
				<div class="colorText">
					<div class="activeColorMode">
						<div class="activeColorModeTag">
							{colorMode}
						</div>
					</div>
					<div class="colorTextField">
						<div class="colorTextBG" />
						<button class="textEditClose">Close</button>
						<div style:--marquisColor={colorFieldMarquis} class="colorTextInputMarquis" />
						<input
							type="text"
							class="colorTextInput"
							bind:value={colorFieldText}
							on:input={(e) => onTextChange(e.currentTarget.value)}
						/>
					</div>
				</div>
				<div class="colorModes" style:--numItems={colorModeOptions.length}>
					{#each colorModeOptions as mode}
						<button
							class={`colorModeButton ${mode === colorMode ? 'active' : ''}`}
							on:click={() => onColorModeChange(mode)}>{mode}</button
						>
					{/each}
				</div>
				<div class="colorArea">
					<ColorArea
						{h}
						{s}
						{v}
						on:newHSV={(e) =>
							onColorAreaChange(e.detail.value.h, e.detail.value.s, e.detail.value.v)}
					/>
				</div>
				<div class="colorHue">
					<ColorHueSlider value={h} on:hueChange={(e) => onHueChange(e.detail.value)} />
				</div>
				<button class="applyButton" on:click={onApplyButtonClick}>Apply</button>
			</div>
		{:else if activeTab === 'properties'}
			<div class="editProperties">
				<h3 class="propertyTitle metalnessTitle">Metalness</h3>
				<div class="metalnessSlider">
					<MetalnessSlider
						value={metalness}
						on:metalnessChange={(e) => onMetalnessChange(e.detail.value)}
					/>
				</div>
				<h3 class="propertyTitle roughnessTitle">Roughness</h3>
				<div class="roughnessSlider">
					<RoughnessSlider
						value={roughness}
						hue={h}
						on:roughnessChange={(e) => onRoughnessChange(e.detail.value)}
					/>
				</div>
				<h3 class="propertyTitle opacityTitle">Opacity</h3>
				<div class="opacitySlider">
					<OpacitySlider
						value={opacity}
						{h}
						{s}
						l={color.hsl.l}
						on:opacityChange={(e) => onOpacityChange(e.detail.value)}
					/>
				</div>
				<button class="applyButton" on:click={onApplyButtonClick}>Apply</button>
			</div>
		{:else if activeTab === 'clipboard'}
			<PaletteTab
				on:applyPaletteOption={(e) =>
					onPaletteApply(e.detail.color, e.detail.metalness, e.detail.roughness, e.detail.opacity)}
				on:applyToMaterial={onApplyButtonClick}
			/>
		{/if}
	</div>
</div>

<style>
	.colorEditMenu {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-rows: 1fr 30rem;
		grid-template-areas: '.' 'controls';
	}

	.colorEditControls {
		pointer-events: auto;
		grid-area: controls;
		background-color: hsla(1, 100%, 0%, 0.2);
		display: grid;
		grid-template-columns: 1rem 1fr 1rem;
		grid-template-rows: 3rem auto 10px;
		grid-template-areas: 'tabs tabs tabs' '. control .' '. . .';
	}

	.colorEditTabs {
		grid-area: tabs;
		display: flex;
		flex-grow: 1;
	}

	.colorEditTab {
		font-size: 1rem;
		background-color: grey;
		color: black;
		border-radius: 10px 10px 0px 0px;
		margin: 0 0.2rem;
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.activeTab {
		background-color: white;
	}

	.closeTab {
		justify-self: center;
		align-self: center;
		display: grid;
		grid-template-columns: 0.5rem 5.5rem 1rem;
		grid-template-rows: 0.8rem 1fr 0.8rem;
		grid-template-areas: '. . .' '. cancelButton .' '. . .';
	}

	.copyPasteButton {
		font-size: 1.5rem;
		background-color: hsl(1deg, 0%, 10%);
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
	}

	.copyPasteIcon {
		background: linear-gradient(
			to right,
			#ef5350,
			#f48fb1,
			#7e57c2,
			#2196f3,
			#26c6da,
			#43a047,
			#eeff41,
			#f9a825,
			#ff5722
		);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.editColor {
		grid-area: control;
		display: grid;
		grid-template-rows: 1rem auto 1rem auto 1rem auto 0.1rem auto 0.1rem 10px 0.1rem;
		grid-template-areas: '.' 'colorText' '.' 'colorModes' '.' 'colorArea' '.' 'colorHue' '.' 'apply' '.';
	}

	.colorText {
		grid-area: colorText;
		display: grid;
		grid-template-columns: 0.3rem 1fr 0.3rem 3fr 4rem;
		grid-template-areas: '. activeColorMode . text .';
	}

	.activeColorMode {
		grid-area: activeColorMode;
	}
	.activeColorModeTag {
		background-color: white;
		color: blue;
		padding: 0.1rem 1rem;
		text-transform: uppercase;
		border-radius: 1rem 0 0 1rem;
		height: 100%;
		width: 80%;
		margin-left: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		transform: translate(0, 0);
		transition: all 0.8s;
		z-index: 150;
	}

	.colorTextField {
		grid-area: text;
		grid-template-columns: 1fr;
		grid-template-areas: 'input';
	}

	.colorTextInput {
		grid-area: input;
		color: black;
		position: relative;
		display: block;
		height: 4rem;
		transform: translate(0, 0);
		transition: all 0.8s;
		z-index: 150;
	}

	.colorTextInputMarquis {
		--marquisColor: green;
		grid-area: input;
		position: relative;
		background-color: var(--marquisColor);
		border-radius: 0.9rem;
		transform: translate(0, 0) scale(100%, 100%);
		opacity: 0;
		height: 0;
		z-index: 145;
		transition: all 0.8s;
	}

	.colorTextBG {
		background-color: hsla(0, 0%, 0%, 90%);
		display: none;
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 100;
		opacity: 0;
		transition: all 0.3s;
	}

	.textEditClose {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background-color: gray;
		width: 6rem;
		border-radius: 1.2rem;
		color: black;
		padding: auto;
		pointer-events: none;
		z-index: 150;
		visibility: hidden;
		opacity: 0;
	}

	.colorText:focus-within .activeColorModeTag {
		transform: translate(0, -15rem);
	}

	.colorTextField:focus-within > .colorTextBG {
		display: block;
		opacity: 1;
		transition: all 0.8s;
	}

	.colorTextField:focus-within > .textEditClose {
		visibility: visible;
		opacity: 1;
		transition: all 2s;
	}

	.colorTextInput:focus {
		transform: translate(0, -19rem);
		z-index: 150;
		position: relative;
	}

	.colorTextField:focus-within .colorTextInputMarquis {
		height: 100%;
		transform: translate(0, -15rem) scale(110%, 150%);
		z-index: 145;
		opacity: 1;
		transition: all 0.8s;
	}

	.colorModes {
		--numItems: 4;
		grid-area: colorModes;
		display: grid;
		grid-template-columns: repeat(var(--numItems), 1fr);
		padding: 0 10px;
	}

	.colorModeButton {
		background-color: white;
		color: blue;
		text-transform: uppercase;
		font-size: 1.3rem;
	}

	.colorModeButton.active {
		background-color: grey;
	}

	.colorModeButton:first-child {
		border-radius: 10px 0 0 10px;
	}
	.colorModeButton:not(:last-child) {
		border-right: 2px solid grey;
	}
	.colorModeButton:last-child {
		border-radius: 0 10px 10px 0;
	}
	.cancelButton {
		grid-area: cancelButton;
		background-color: white;
		border-radius: 1rem 1rem;
		color: black;
		font-size: 1.4rem;
	}

	.applyButton {
		grid-area: apply;
		background-color: white;
		border-radius: 1rem;
		color: blue;
		font-size: 1.4rem;
		width: 80%;
		margin: auto;
	}

	.colorArea {
		grid-area: colorArea;
	}
	.colorHue {
		grid-area: colorHue;
	}

	.editProperties {
		grid-area: control;
		display: grid;
		grid-template-rows: 3px auto auto auto auto auto auto 10px;
		grid-template-columns: 1px 1fr 1px;
		grid-template-areas:
			'. . .'
			'. metalnessTitle .'
			'. metalnessSlider .'
			'. roughnessTitle .'
			'. roughnessSlider .'
			'. opacityTitle .'
			'. opacitySlider .'
			'. . .'
			'. apply .'
			'. . .';
	}

	.metalnessTitle {
		grid-area: metalnessTitle;
	}
	.metalnessSlider {
		grid-area: metalnessSlider;
	}
	.roughnessTitle {
		grid-area: roughnessTitle;
	}
	.roughnessSlider {
		grid-area: roughnessSlider;
	}
	.opacityTitle {
		grid-area: opacityTitle;
	}
	.opacitySlider {
		grid-area: opacitySlider;
	}
	.metalnessSlider,
	.roughnessSlider,
	.opacitySlider {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.propertyTitle {
		font-size: 1.25rem;
		display: flex;
		align-items: flex-end;
	}

	.editText {
		grid-area: control;
	}
	.editClipboard {
		grid-area: control;
	}

	.editColorHue {
		grid-area: slider;
	}

	.closeMenuButton {
		background-color: white;
		color: black;
		border-radius: 25px;
		grid-area: button;
	}

	:global(.paletteTab) {
		grid-area: control;
	}
</style>
