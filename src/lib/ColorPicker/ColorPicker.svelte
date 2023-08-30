<script lang="ts">
	import ColorArea from './subComponents/ColorArea.svelte';
	import ColorAlpha from './subComponents/ColorAlpha.svelte';
	import ColorHue from './subComponents/ColorHue.svelte';
	import ColorPulloutButton from './subComponents/ColorPulloutButton.svelte';
	import MetalnessSlider from '$lib/MetalnessSlider/MetalnessSlider.svelte';
	import RoughnessSlider from '$lib/RoughnessSlider/RoughnessSlider.svelte';
	import ColorOpenSecondaryButton from './subComponents/ColorOpenSecondaryButton.svelte';
	import ColorInput from './subComponents/ColorInput.svelte';
	import ColorSwatches from './subComponents/ColorSwatches.svelte';

	let isMenuOpen = false,
		isSecondaryMenuOpen = false;

	const onMenuToggle = () => {
		if (isMenuOpen) isSecondaryMenuOpen = false;
		isMenuOpen = !isMenuOpen;
	};

	// Nice Idea Functions

	// /**
	//  * Update the color marker's accessibility label.
	//  * @param {number} saturation
	//  * @param {number} value
	//  */
	// function updateMarkerA11yLabel(saturation, value) {
	// 	let label = settings.a11y.marker;

	// 	saturation = saturation.toFixed(1) * 1;
	// 	value = value.toFixed(1) * 1;
	// 	label = label.replace('{s}', saturation);
	// 	label = label.replace('{v}', value);
	// 	colorMarker.setAttribute('aria-label', label);
	// }

	// /**
	//  * Move the color marker when the arrow keys are pressed.
	//  * @param {number} offsetX The horizontal amount to move.
	//  * @param {number} offsetY The vertical amount to move.
	//  */
	// function moveMarkerOnKeydown(offsetX, offsetY) {
	// 	let x = colorMarker.style.left.replace('px', '') * 1 + offsetX;
	// 	let y = colorMarker.style.top.replace('px', '') * 1 + offsetY;

	// 	setMarkerPosition(x, y);
	// }
</script>

<div class={`colorPicker ${isMenuOpen ? 'open' : ''}`}>
	<ColorPulloutButton isOpen={isMenuOpen} on:click={onMenuToggle} />
	<div class="colorPickerSubMenu">
		<div class={`colorPickerSub ${isSecondaryMenuOpen ? 'open' : ''}`}>
			<div class="colorPickerSubContent">
				<ColorInput />
				<ColorSwatches />
			</div>
		</div>
	</div>
	<span class="colorPickerBackground" />
	<div class="colorPickerContent">
		<ColorArea />
		<ColorHue />
		<ColorAlpha />
		<MetalnessSlider />
		<RoughnessSlider />
		<ColorOpenSecondaryButton
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
		pointer-events: none;
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
