<script lang="ts">
	import { selectedUUID, hsl, metalness, opacity, glossiness } from '$stores/material';
	import Icon from '$lib/Icon/Icon.svelte';

	type Colors = {
		material: string;
		alpha: string;
		metalness: string;
		metalnessBG: string;
		glossiness: string;
		glossinessBG: string;
	};

	type ClipPaths = {
		alpha: string;
		metalness: string;
		metalnessBG: string;
		glossiness: string;
		glossinessBG: string;
	};

	export let isOpen = false;

	//css variables
	let icon: 'close' | 'play',
		transition = 'all 0.2s';
	/**Presentation value for $metalness*/
	let m = 0;
	/**Presentation value for $opacity*/
	let o = 0;
	/**Presentation value for $glossiness*/
	let g = 0;
	/**Collection of CSS hsl(color) strings*/
	let colors: Colors;
	/**Collection of CSS clip-path() strings*/
	let clipPaths: ClipPaths;

	/**
	 * Necessary CSS trick.
	 *
	 * without this, the button will not transition after a new material has been
	 * selected.
	 * @param _UUID_trigger needed to run reset when the UUID changes to signify a new material
	 * @void resets the CSS transition on the button so it will fire the next time the button is clicked
	 */
	const resetTransitionOnMaterialChange = (_UUID_trigger: any) => {
		transition = 'all .2s';
		setTimeout(() => {
			transition = '';
		}, 200);
	};

	/**Convenience function to create CSS Strings for colors and clip paths*/
	const generateStyles = (h: number, s: number, l: number, o: number, m: number, g: number) => {
		const colors = {} as Colors,
			clipPaths = {} as ClipPaths;

		/** This forground color moves from bottom to up, so needs the inverse values*/
		colors.material = `hsl(${h}deg ${s}% ${l}%)`;
		/**This background color fills the remaining spacebehind colors.material, and needs the actual values */
		colors.alpha = `hsl(${h}deg ${$hsl.s / 2}% ${$hsl.l / 2}%)`;
		colors.metalness = `hsl(0deg 0% 60%)`;
		colors.metalnessBG = `hsl(0deg 0% 10%)`;
		colors.glossiness = `hsl(${h}deg 100% 70%)`;
		colors.glossinessBG = `hsl(${h}deg 100% 10%)`;

		clipPaths.alpha = `polygon(0% ${o}%, 100% ${o}%, 100% 0%, 0% 0%)`;
		clipPaths.metalness = `polygon(0% 100%, 100% 100%, 100% ${m}%, 0% ${m}%)`;
		clipPaths.metalnessBG = `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)`;
		clipPaths.glossiness = `polygon(0% 100%, 50% 100%, 50% ${g}%, 0% ${g}%)`;
		clipPaths.glossinessBG = `polygon(50% 0%, 0% 0%, 0% 100%, 50% 100%)`;
		return { colors, clipPaths };
	};

	$: resetTransitionOnMaterialChange($selectedUUID);
	/**Because these fills go from bottom to top,
	 * they need to be inverted from the actual value,
	 * and clamped so they do not blend with neighbor elements*/
	$: g = 100 - $glossiness;
	$: m = 100 - $metalness;
	$: o = 100 - $opacity;
	$: if (m > 97) m = 100;
	$: if (o > 90) o = 90;
	$: ({ colors, clipPaths } = generateStyles($hsl.h, $hsl.s, $hsl.l, o, m, g));
	$: icon = isOpen ? 'close' : 'play';
</script>

<button
	class={`openColorPickerButton ${isOpen && 'active'}`}
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
