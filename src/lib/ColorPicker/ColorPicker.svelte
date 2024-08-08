<script lang="ts">
	import ColorArea from './subComponents/ColorArea.svelte';
	import ColorAlpha from './subComponents/ColorAlpha.svelte';
	import ColorHue from './subComponents/ColorHue.svelte';
	import MetalnessSlider from '$lib/MetalnessSlider/MetalnessSlider.svelte';
	import RoughnessSlider from '$lib/RoughnessSlider/RoughnessSlider.svelte';
	import OpenMenuBtn from './subComponents/OpenMenuBtn.svelte';
	import OpenSubmenuBtn from './subComponents/OpenSubmenuBtn.svelte';
	import ColorInput from './subComponents/ColorInput.svelte';
	import ColorSwatches from './subComponents/ColorSwatches.svelte';
	import { hsv, selectedUUID } from '$stores/material';
	import type { HSVColor } from '$lib/colorFunctions';
	import type { SvelteComponent } from 'svelte';

	//used to track if menus are open or not
	let isMenuOpen = false,
		isSecondaryMenuOpen = false;

	/**Used to update the hue slider*/
	let hueInput = $hsv.h;

	// we will bind these components to call their child functions as needed
	let colorArea: SvelteComponent | null = null;
	let colorTextInput: SvelteComponent | null = null;

	/**
	 * Toggles the primary menu. If the primary menu is closing,
	 * the secondary menu will also be closed.
	 * @void toggles primary and secondary booleans
	 */
	const onMenuToggle = () => {
		if (isMenuOpen) isSecondaryMenuOpen = false;
		isMenuOpen = !isMenuOpen;
	};

	/**
	 * Runs on dispatch [hueChange]
	 *
	 * triggers the ColorText component to update it's text based one the current store value.
	 * @void triggers ColorInput.setOption
	 */
	const onHueChange = (hue: number) => {
		hsv.setHue(hue);
		colorTextInput?.update();
	};

	/**
	 * Runs on dispatch [colorAreaChange]
	 *
	 * Sets the hsv store value and triggers an update on Color text so it will show updated input.
	 * @param {HSVColor} hsvValue an HSVColor value
	 * @void sets hsv store and triggers ColorText update function
	 */
	const onColorAreaChange = (hsvValue: HSVColor) => {
		hsv.set(hsvValue);
		colorTextInput?.update();
	};

	/**
	 * Runs on dispatch [textChange]
	 *
	 * - triggers color area to update it's marker offset based on the current saturation and value of hsv store
	 * - triggers hueInput to match the current hsv/hsl hue value
	 * @void updates marker offset in ColorArea and value in Hue Slider
	 */
	const onTextInputChange = () => {
		colorArea?.updateOffset(null, $hsv.s, $hsv.v);
		hueInput = $hsv.h;
	};

	/**
	 * Runs when selectedUUID changes
	 *
	 * triggers updates on these components to reflect current object material:
	 * - ColorArea
	 * - ColorTextInput
	 * - HueSlider
	 * @param _trigger the current uuid of selected object
	 * @void updates Components to match current store values
	 */
	function onMaterialChange(_trigger: typeof $selectedUUID) {
		colorTextInput?.update();
		colorArea?.updateOffset();
		hueInput = $hsv.h;
	}

	$: onMaterialChange($selectedUUID);
</script>

<div class={`colorPicker ${isMenuOpen ? 'open' : ''}`}>
	<OpenMenuBtn isOpen={isMenuOpen} on:click={onMenuToggle} />
	<div class="colorPickerSubMenu">
		<div class={`colorPickerSub ${isSecondaryMenuOpen ? 'open' : ''}`}>
			<div class="colorPickerSubContent">
				<ColorInput on:textChange={onTextInputChange} bind:this={colorTextInput} />
				<ColorSwatches />
			</div>
		</div>
	</div>
	<span class="colorPickerBackground" />
	<div class="colorPickerContent">
		<ColorArea
			on:colorAreaChange={(e) => onColorAreaChange(e?.detail?.value)}
			bind:this={colorArea}
		/>
		<ColorHue value={hueInput} on:hueChange={(e) => onHueChange(e?.detail?.value)} />
		<ColorAlpha />
		<MetalnessSlider />
		<RoughnessSlider />
		<OpenSubmenuBtn
			isOpen={isSecondaryMenuOpen}
			on:click={() => (isSecondaryMenuOpen = !isSecondaryMenuOpen)}
		/>
	</div>
</div>

<style>
	.colorPicker {
		width: 250px;
		height: 320px;
		background-color: var(--color-bg-primary);
		position: absolute;
		bottom: 2%;
		left: 0%;
		padding-bottom: 10px;
		border-radius: 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: end;
		transform: translateX(-100%);
		transition: transform 1.1s;
	}

	.colorPicker.open {
		transform: translateX(10%);
	}

	.colorPickerBackground {
		width: 100%;
		background-color: var(--color-bg-primary);
		height: 100%;
		position: absolute;
		border-radius: 16px;
	}
	.colorPickerContent {
		width: 200px;
		background-color: var(--color-bg-primary);
	}

	.colorPickerSubMenu {
		position: absolute;
		left: 0;
		width: 200%;
		height: 100%;
		overflow: hidden;
		/* pointer-events: none; */
	}

	.colorPickerSub {
		position: absolute;
		bottom: 0;

		width: 50%;
		height: calc(100% - 40px);
		background-color: var(--color-bg-primary);
		border-radius: 0 16px 16px 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transform: translateX(0);
		transition: transform 1.1s;
		pointer-events: all;
	}

	.colorPickerSub.open {
		transform: translateX(100%);
	}

	.colorPickerSubContent {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-rows: 10px auto 10px auto 30px;
	}
</style>
