<script lang="ts">
	import { selectedUUID, hsl, metalness, opacity, glossiness } from '$stores/material';
	import Icon from '$lib/Icon/Icon.svelte';
	import type { HSLColor } from '$lib/colorFunctions';

	export let isOpen = false;

	//css variables
	let icon: 'close' | 'play',
		transition = 'all 0.2s';
	const colors = {
		material: '',
		alpha: '',
		metalness: '',
		metalnessBG: '',
		glossiness: '',
		glossinessBG: ''
	};
	const clipPaths = {
		alpha: '',
		metalness: '',
		metalnessBG: '',
		glossiness: '',
		glossinessBG: ''
	};

	const toggleTransitionOnMaterialChange = (UUID_trigger: any) => {
		transition = 'all .2s';
		setTimeout(() => {
			transition = '';
		}, 200);
	};

	const generateStyle = (hsl: HSLColor, metalness: number, opacity: number, glossiness: number) => {
		const { h, s, l } = hsl;
		const dullS = (s * 100) / 2,
			dullL = (l * 100) / 2;

		colors.material = `hsl(${h}deg ${s * 100}% ${l * 100}%)`;
		colors.alpha = `hsl(${h}deg ${dullS}% ${dullL}%)`;
		colors.metalness = `hsl(0deg 0% 60%)`;
		colors.metalnessBG = `hsl(0deg 0% 10%)`;
		colors.glossiness = `hsl(${h}deg 100% 70%)`;
		colors.glossinessBG = `hsl(${h}deg 100% 10%)`;

		const g = 100 - glossiness * 100;
		let m = 100 - metalness * 100;
		let o = 100 - opacity * 100;
		if (m > 97) m = 100;
		if (o > 90) o = 90;

		clipPaths.alpha = `polygon(0% ${o}%, 100% ${o}%, 100% 0%, 0% 0%)`;
		clipPaths.metalness = `polygon(0% 100%, 100% 100%, 100% ${m}%, 0% ${m}%)`;
		clipPaths.metalnessBG = `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)`;
		clipPaths.glossiness = `polygon(0% 100%, 50% 100%, 50% ${g}%, 0% ${g}%)`;
		clipPaths.glossinessBG = `polygon(50% 0%, 0% 0%, 0% 100%, 50% 100%)`;
	};

	$: toggleTransitionOnMaterialChange($selectedUUID);
	$: generateStyle($hsl, $metalness, $opacity, $glossiness);
	$: icon = isOpen ? 'close' : 'play';
</script>

<button
	class={`openColorPickerButton ${isOpen ? 'active' : ''}`}
	style:--transition-timeout={transition}
	on:click
>
	<span
		class="glossyBackground"
		style:--color={colors.glossinessBG}
		style:--clip-path={clipPaths.glossinessBG}
	>
		<span
			class="glossySpan"
			style:--color={colors.glossiness}
			style:--clip-path={clipPaths.glossiness}
		/>
	</span>
	<span
		class="metalBackground"
		style:--color={colors.metalnessBG}
		style:--clip-path={clipPaths.metalnessBG}
	>
		<span
			class="metalSpan"
			style:--color={colors.metalness}
			style:--clip-path={clipPaths.metalness}
		/>
	</span>
	<span class="colorSpan" style:--color={colors.material} />
	<span class="alphaSpan" style:--color={colors.alpha} style:--clip-path={clipPaths.alpha} />
	<span class="iconSpan">
		<Icon class={`fa-solid fa-${icon}`} />
	</span>
</button>

<style>
	.openColorPickerButton {
		position: absolute;
		z-index: 1;
		left: 100%;
		top: -5%;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 100%;
		transform: translate(30%, 250%);
		width: 75px;
		height: 75px;

		transition: all 1.1s;
	}

	.active {
		transform: translate(-60%, -10%);
		width: 50px;
		height: 50px;
	}

	.openColorPickerButton span {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		transition: var(--transition-timeout);
	}

	.colorSpan {
		width: 100%;
		height: 100%;
		border-radius: 100%;
		border: 1px solid var(--border-color, #000);
		background-color: var(--color);
	}

	.alphaSpan {
		width: 100%;
		height: 100%;
		border-radius: 100%;
		background-color: var(--color);
		clip-path: var(--clip-path);
	}

	.iconSpan {
		width: 30%;
		height: 30%;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 100%;
	}

	.metalSpan,
	.metalBackground,
	.glossySpan,
	.glossyBackground {
		border-radius: 100%;
		background-color: var(--color, #eaeaea);
		clip-path: var(--clip-path);
	}

	.metalSpan,
	.glossySpan {
		width: 100%;
		height: 100%;
	}

	.metalBackground,
	.glossyBackground {
		width: 115%;
		height: 115%;
	}
</style>
