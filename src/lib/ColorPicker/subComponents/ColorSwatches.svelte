<script lang="ts">
	import ColorSwatchPreview from './ColorSwatchPreview.svelte';
	import { hsl, opacity, metalness, glossiness } from '$stores/activeMaterial';
	import Icon from '$lib/Icon/Icon.svelte';
	import type { ColorSwatch, ColorSwatchWithKey } from '$types';

	/**
	 * These are the default starting properties
	 * we will display, user can make changes later
	 */
	let defaultSwatches: ColorSwatch[] = [
		{ h: 1, s: 50, l: 50, m: 0, g: 0, o: 0 },
		{ h: 20, s: 50, l: 50, m: 55, g: 25, o: 5 },
		{ h: 40, s: 5, l: 5, m: 100, g: 100, o: 100 },
		{ h: 60, s: 50, l: 50, m: 100, g: 100, o: 100 },
		{ h: 80, s: 50, l: 50, m: 100, g: 100, o: 100 },
		{ h: 100, s: 50, l: 50, m: 100, g: 100, o: 100 },
		{ h: 120, s: 50, l: 50, m: 100, g: 100, o: 100 },
		{ h: 140, s: 50, l: 50, m: 100, g: 100, o: 100 },
		{ h: 160, s: 20, l: 40, m: 100, g: 100, o: 100 }
	];

	const max = 9;
	let isAtMax = true;
	let isDeleteMode = false;

	let swatches: ColorSwatch[] = [...defaultSwatches];
	let topSwatches: ColorSwatchWithKey[] = [];
	let bottomSwatches: ColorSwatchWithKey[] = [];

	/**
	 * We poll all the child components so we can call
	 * the applyHighlight function on a chile when needed
	 */
	const elements: {
		[id: string]: ColorSwatchPreview;
	} = {};

	/**
	 * interates through each current swatch and checks if any
	 * swatch has the same properties as the new swatch
	 * @param swatches the current list of swatches on display
	 * @param newSwatch a swatch submitted by the user
	 * @returns
	 * - the index of the duplicate setting, if any.
	 * - if none found, returns undefined
	 */
	const findDuplicateIndex = (swatches: ColorSwatch[], newSwatch: ColorSwatch) => {
		let i = 0;
		while (i < swatches.length) {
			const swatch = swatches[i];
			const isSame = Object.keys(swatch).every(
				(k) => swatch[k as keyof ColorSwatch] === newSwatch[k as keyof ColorSwatch]
			);
			if (isSame) return i;
			i++;
		}
	};

	/**
	 * Called when the global variable swatches changes.
	 *
	 * each odd-indexed swatch is put on the top row to display,
	 * each even-index on the bottom
	 *
	 * Svelte will iterate through top and bottom rows and create
	 * child elements from them
	 * @param swatchSet
	 */
	const updateSwatchOrder = (swatchSet: ColorSwatch[]) => {
		swatches = [...swatchSet];
		topSwatches.length = 0;
		bottomSwatches.length = 0;
		swatchSet.forEach((swatch, i) => {
			if (i % 2 === 0) topSwatches.push({ i, swatch });
			else bottomSwatches.push({ i, swatch });
		});
	};

	/**
	 * Used when a swatch is clicked
	 * @if idDeleteMode is not active, this click is meant to
	 * apply properties to the active color.
	 *
	 * All accessible material stores are updated by the swatch properties
	 *
	 * @else this click is meant to remove the elmeent from the list.
	 * The element is filtered from the swatches
	 * global, which triggers the rows to be updated.
	 *
	 *
	 * @param swatch the swatch clicked on by the user
	 * @param i the index of the swatch, in case we need to remove it from the swatches global
	 * @void updates activeMaterial or deletes this swatch, depending on the mode.
	 */
	const onSwatchClick = (swatch: ColorSwatch, i: number) => {
		if (!isDeleteMode) {
			hsl.set({ h: swatch.h, s: swatch.s, l: swatch.l });
			metalness.set(swatch.m);
			glossiness.set(swatch.g);
			opacity.set(swatch.o);
		} else swatches = [...swatches.filter((_, ind) => ind !== i)];
	};

	/**
	 * Run when the save button is clicked.
	 *
	 * creates a new swatch from current active material
	 *
	 * @shortcircuits-if
	 * - We already have a full set of swatches
	 * - We are in delete mode.
	 *
	 * @if a duplicate exists, the duplicate swatch
	 * that already exists will be highlighted by calling
	 * applyHighlight function on matching child element.
	 * No swatches are added
	 *
	 * @else the properties of the active material are
	 * converted into a swatch and stored at the end of
	 * the global list.
	 *
	 * @void updates swatches global if no dupplicates match
	 * provided properties
	 */
	const onSaveSwatchClick = () => {
		if (isAtMax || isDeleteMode) return;
		const newSwatch = {
			h: $hsl.h,
			s: $hsl.s,
			l: $hsl.l,
			m: $metalness,
			g: $glossiness,
			o: $opacity
		};

		const i = findDuplicateIndex(swatches, newSwatch);
		if (i && i >= 0) return elements[i]?.applyHighlight();
		else updateSwatchOrder([...swatches, newSwatch]);
	};

	$: isAtMax = swatches.length >= max;
	$: updateSwatchOrder(swatches);
</script>

<div class="colorSwatchesSection">
	<div class="colorSwatchButtons">
		<button
			class={`colorSwatchButton colorSwatchSave ${
				(isAtMax || isDeleteMode) && 'colorSaveButtonDisabled'
			}`}
			on:click={onSaveSwatchClick}><Icon class="fa-solid fa-save" /></button
		>
		<button
			class="colorSwatchButton colorSwatchTrash"
			on:click={() => (isDeleteMode = !isDeleteMode)}
		>
			{#if isDeleteMode}
				Cancel
			{:else}
				<Icon class="fa-solid fa-trash" />
			{/if}
		</button>
	</div>
	<div class="colorSwatches">
		<div class="colorSwatchSection colorSwatchesTop">
			{#each topSwatches as { i, swatch }}
				<ColorSwatchPreview
					{swatch}
					{isDeleteMode}
					on:click={() => onSwatchClick(swatch, i)}
					bind:this={elements[i]}
				/>
			{/each}
		</div>
		<div class="colorSwatchSection colorSwatchesBottom">
			{#each bottomSwatches as { i, swatch }}
				<ColorSwatchPreview
					{swatch}
					{isDeleteMode}
					on:click={() => onSwatchClick(swatch, i)}
					bind:this={elements[i]}
				/>
			{/each}
		</div>
	</div>
</div>

<style>
	.colorSwatchesSection {
		grid-row: -3;
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: center;
	}
	.colorSwatches {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.colorSwatchSection {
		width: 90%;
		height: 50%;
		display: flex;
		align-items: center;
		justify-content: start;
	}

	.colorSwatchesTop {
	}

	.colorSwatchesBottom {
	}

	:global(.colorSwatchesBottom > .swatch:first-child) {
		margin-left: 15px;
	}

	.colorSwatchButtons {
		width: 100%;
		display: flex;
		justify-content: space-around;
		margin-bottom: 20px;
	}

	.colorSwatchButton {
		width: 40%;
		height: 40px;
		border-radius: 10px;
		font-size: 20px;
		background-color: var(--color-bg-accent);
		color: var(--color-bg-primary);
	}

	.colorSaveButtonDisabled {
		background-color: grey;
	}
</style>
