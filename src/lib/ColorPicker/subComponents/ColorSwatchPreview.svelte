<script lang="ts">
	import Icon from '$lib/Icon/Icon.svelte';
	import type { ColorSwatch } from '$types';

	export let swatch: ColorSwatch,
		isDeleteMode = false;

	//CSS variables
	/**used to apply a background highlight with a timeout*/
	let highlightClass = '';
	type Colors = {
		material: string;
		alpha: string;
		metal: string;
		metalBg: string;
		glossy: string;
		glossyBg: string;
		delete: string;
	};
	type ClipPaths = {
		alpha: string;
		metal: string;
		metalBg: string;
		glossy: string;
		glossyBG: string;
	};

	let colors: Colors;
	let clipPaths: ClipPaths;

	/**extractions from the provided swatch for manipulation*/
	let h = 0;
	let s = 0;
	let l = 0;
	let m = 0;
	let g = 0;
	let o = 0;

	/**Convenience function to create CSS Strings for colors and clip paths*/
	const updateStyle = (h: number, s: number, l: number, m: number, g: number, o: number) => {
		let colors = {} as Colors,
			clipPaths = {} as ClipPaths;
		colors.material = `hsl(${h}deg ${s}% ${l}%)`;
		colors.alpha = `hsl(${h}deg ${s / 2}% ${l / 2}%)`;
		colors.metal = `hsl(0deg 0% 60%)`;
		colors.metalBg = `hsl(0deg 0% 20%)`;
		colors.glossy = `hsl(${h}deg 100% 70%)`;
		colors.glossyBg = `hsl(${h}deg 100% 10%)`;

		clipPaths.alpha = `polygon(0% ${o}%, 100% ${o}%, 100% 0%, 0% 0%)`;
		clipPaths.metal = `polygon(50% ${m}%, 100% ${m}%, 100% 100%, 50% 100%)`;
		clipPaths.metalBg = `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)`;
		clipPaths.glossy = `polygon(0% 100%, 50% 100%, 50% ${g}%, 0% ${g}%)`;
		clipPaths.glossyBG = `polygon(50% 0%, 0% 0%, 0% 100%, 50% 100%)`;
		return { colors, clipPaths };
	};

	/**
	 *	Runs When requested by parent
	 * @void
	 * - Clears highlight animations class
	 * - waits 200ms
	 * - reaplies it to generate the animation effect again.
	 */
	export const applyHighlight = () => {
		highlightClass = '';
		setInterval(() => (highlightClass = 'highlighted'), 200);
	};

	// Convert swatch values into needed style and apply to CSS var strings
	$: ({ h, s, l, m, g, o } = swatch);
	$: g = (1 - g) * 100;
	$: m = (1 - m) * 100;
	$: o = Math.min((1 - 0) * 100, 90);
	$: ({ colors, clipPaths } = updateStyle(h, s, l, m, g, o));
	$: colors.delete = 300 >= h && h >= 10 ? 'red' : 'white';
</script>

<div class={`swatch ${highlightClass}`} on:click>
	<span
		class="swatchGlossinessBG"
		style:--background-color={colors.glossyBg}
		style:--clip-path={clipPaths.glossyBG}
	/>
	<span
		class="swatchMetalnessBG"
		style:--background-color={colors.metalBg}
		style:--clip-path={clipPaths.metalBg}
	/>
	<span
		class="swatchGlossiness"
		style:--background-color={colors.glossy}
		style:--clip-path={clipPaths.glossy}
	/>
	<span
		class="swatchMetalness"
		style:--background-color={colors.metal}
		style:--clip-path={clipPaths.metal}
	/>
	<span class="swatchColor" style:--background-color={colors.material} />
	<span
		class="swatchOpacity"
		style:--background-color={colors.alpha}
		style:--clip-path={clipPaths.alpha}
	/>
	{#if isDeleteMode}
		<span
			class="swatchDelete"
			style:--background-color={colors.alpha}
			style:--deleteSpanColor={colors.delete}
			><Icon class="fa-solid fa-close swatchDeleteIcon" /></span
		>
	{/if}
</div>

<style>
	@keyframes color {
		0% {
			background-color: transparent;
		}
		50% {
			background-color: yellow;
		}
		100% {
			background-color: transparent;
		}
	}
	.swatch {
		position: relative;
		width: 40px;
		height: 40px;
		padding: 10px;
		animation: none;
	}

	.swatch.highlighted {
		animation: color 0.75s 3;
	}

	.swatchGlossinessBG,
	.swatchGlossiness,
	.swatchMetalnessBG,
	.swatchMetalness,
	.swatchOpacity,
	.swatchColor,
	.swatchDelete {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		border-radius: 100%;

		background-color: var(--background-color);
		clip-path: var(--clip-path);
	}

	.swatchOpacity {
		width: 90%;
		height: 90%;
	}

	.swatchColor {
		width: 90%;
		height: 90%;
	}

	.swatchDelete {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	:global(.swatchDeleteIcon) {
		color: var(--deleteSpanColor);
		text-align: center;
		font-size: 20px;
	}
</style>
