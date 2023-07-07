<script>
	import ColorArea from './subComponents/ColorArea.svelte';
	import ColorAlpha from './subComponents/ColorAlpha.svelte';
	import ColorHue from './subComponents/ColorHue.svelte';
	import ColorSwatches from './subComponents/ColorSwatches.svelte';
	import ColorInput from './subComponents/ColorInput.svelte';
	import ColorPulloutButton from './subComponents/ColorPulloutButton.svelte';
	import { colorStore, activeMaterialStore, opacityStore } from '$lib/stores';
	import MetalnessSlider from '$lib/MetalnessSlider/MetalnessSlider.svelte';
	import RoughnessSlider from '$lib/RoughnessSlider/RoughnessSlider.svelte';

	let hue, saturation, value, opacity, colorAreaElement;
	let isOpen = false,
		openClass;

	const setValuesOnMaterialChange = (activeMaterial_trigger) => {
		opacity = $opacityStore;
		let { h, s, v } = $colorStore.hsv;
		hue = h;
		saturation = s;
		value = v;
		colorAreaElement?.setMarkPos(s, v);
	};
	const updateColor = (h, s, v) => {
		colorStore.setMaterial({ h, s, v });
	};
	const updateOpacity = (opacity) => {
		opacityStore.setMaterial(opacity);
	};

	$: setValuesOnMaterialChange($activeMaterialStore);
	$: updateColor(hue, saturation, value);
	$: updateOpacity(opacity);
	$: openClass = isOpen ? 'colorPickerOpen' : '';
</script>

<div class={`colorPicker ${openClass}`}>
	<ColorPulloutButton bind:isOpen />
	<div class="colorPickerContent">
		<ColorArea bind:saturation bind:value color={$colorStore} bind:this={colorAreaElement} />
		<ColorHue bind:value={hue} color={$colorStore} />
		<ColorAlpha bind:value={opacity} color={$colorStore} />
		<ColorInput />
		<ColorSwatches />
		<MetalnessSlider />
		<RoughnessSlider />
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
		border-radius: 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: end;
		transform: translateX(-100%);
		transition: transform 1.1s;
	}

	.colorPickerOpen {
		transform: translateX(10%);
	}

	.colorPickerContent {
		width: 200px;
	}
</style>
