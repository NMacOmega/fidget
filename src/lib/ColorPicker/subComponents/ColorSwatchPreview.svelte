<script lang="ts">
	import Icon from '$lib/Icon/Icon.svelte';
	//@todo fix swatch definition, move everything to d.ts files
	export let swatch: Swatch,
		isDeleteMode = false;

	//CSS variables
	let highlightClass = '';
	const colors = {
		material: '',
		alpha: '',
		metal: '',
		metalBg: '',
		glossy: '',
		glossyBg: '',
		delete: ''
	};
	const clipPaths = {
		alpha: '',
		metal: '',
		metalBg: '',
		glossy: '',
		glossyBG: ''
	};

	const updateStyle = (swatch: Swatch) => {
		const { h, s, l, m: metalness, g: glossiness, o: opacity } = swatch;
		const dullS = s / 2;
		const dullL = l / 2;
		const g = (1 - glossiness) * 100;
		const m = (1 - metalness) * 100;
		const o = Math.min((1 - opacity) * 100, 90);

		colors.material = `hsl(${h}deg ${s}% ${l}%)`;
		colors.alpha = `hsl(${h}deg ${dullS}% ${dullL}%)`;
		colors.metal = `hsl(0deg 0% 60%)`;
		colors.metalBg = `hsl(0deg 0% 20%)`;
		colors.glossy = `hsl(${h}deg 100% 70%)`;
		colors.glossyBg = `hsl(${h}deg 100% 10%)`;

		clipPaths.alpha = `polygon(0% ${o}%, 100% ${o}%, 100% 0%, 0% 0%)`;
		clipPaths.metal = `polygon(50% ${m}%, 100% ${m}%, 100% 100%, 50% 100%)`;
		clipPaths.metalBg = `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)`;
		clipPaths.glossy = `polygon(0% 100%, 50% 100%, 50% ${g}%, 0% ${g}%)`;
		clipPaths.glossyBG = `polygon(50% 0%, 0% 0%, 0% 100%, 50% 100%)`;
	};

	export const applyHighlight = () => {
		highlightClass = '';
		setInterval(() => (highlightClass = 'highlighted'), 200);
	};

	const updateDeleteColor = (h: number, isDeleteMode: boolean) => {
		if (isDeleteMode) colors.delete = 300 >= h && h >= 10 ? 'red' : 'white';
	};
	$: updateStyle(swatch);
	$: updateDeleteColor(swatch.h, isDeleteMode);
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
