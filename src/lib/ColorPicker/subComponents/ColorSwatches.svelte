<script lang="ts">
	import ColorSwatchPreview from './ColorSwatchPreview.svelte';
	import { hsl, opacity, metalness, glossiness } from '$lib/stores';
	import Icon from '$lib/Icon/Icon.svelte';

	interface Swatch {
		h: number;
		s: number;
		l: number;
		m: number;
		g: number;
		o: number;
	}

	interface KeyedSwatch {
		i: number;
		swatch: Swatch;
	}

	let isDeleteMode = false;

	let defaultSwatches: Swatch[] = [
		{ h: 1, s: 50, l: 50, m: 0, g: 0, o: 0 },
		{ h: 20, s: 50, l: 50, m: 0.55, g: 0.25, o: 0.5 },
		{ h: 40, s: 50, l: 50, m: 1, g: 1, o: 1 },
		{ h: 60, s: 50, l: 50, m: 1, g: 1, o: 1 },
		{ h: 80, s: 50, l: 50, m: 1, g: 1, o: 1 },
		{ h: 100, s: 50, l: 50, m: 1, g: 1, o: 1 },
		{ h: 120, s: 50, l: 50, m: 1, g: 1, o: 1 },
		{ h: 140, s: 50, l: 50, m: 1, g: 1, o: 1 },
		{ h: 160, s: 20, l: 40, m: 1, g: 1, o: 1 }
	];
	let topSwatches: KeyedSwatch[] = [],
		bottomSwatches: KeyedSwatch[] = [],
		swatches: Swatch[] = [...defaultSwatches];
	const elements = {};
	const isAtMax = () => swatches.length >= 9;

	const findDuplicateIndex = (swatches, newSwatch) => {
		let i = 0;
		while (i < swatches.length) {
			const isSame = Object.keys(swatches[i]).every((k) => swatches[i][k] === newSwatch[k]);
			if (isSame) return i;
			i++;
		}
	};

	//CSS variables
	let saveButtonClass = '';

	const updateSwatchOrder = (swatchSet: Swatch[]) => {
		swatches = [...swatchSet];
		topSwatches.length = 0;
		bottomSwatches.length = 0;
		swatchSet.forEach((swatch, i) => {
			if (i % 2 === 0) topSwatches.push({ i, swatch });
			else bottomSwatches.push({ i, swatch });
		});
	};

	const onClick = ({ h, s, l, m, g, o }: Swatch, i: number) => {
		if (isDeleteMode) {
			swatches = [...swatches.filter((_, ind) => ind !== i)];
			return;
		}
		$hsl = { h, s, l };
		$metalness = m;
		$glossiness = g;
		$opacity = o;
	};

	const onSaveClick = () => {
		if (isAtMax() || isDeleteMode) return;

		const { h, s, l } = $hsl;
		const newSwatch = { h, s, l, m: $metalness, g: $glossiness, o: $opacity };

		const i = findDuplicateIndex(swatches, newSwatch);
		if (i >= 0) return elements[i]?.applyHighlight();
		updateSwatchOrder([...swatches, newSwatch]);
	};

	$: updateSwatchOrder(swatches);
	$: saveButtonClass = `colorSwatchButton colorSwatchSave ${
		isAtMax() || isDeleteMode ? 'colorSaveButtonDisabled' : ''
	}`;
</script>

<div class="colorSwatchesSection">
	<div class="colorSwatchButtons">
		<button class={saveButtonClass} on:click={onSaveClick}><Icon class="fa-solid fa-save" /></button
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
					on:click={() => onClick(swatch, i)}
					bind:this={elements[i]}
				/>
			{/each}
		</div>
		<div class="colorSwatchSection colorSwatchesBottom">
			{#each bottomSwatches as { i, swatch }}
				<ColorSwatchPreview
					{swatch}
					{isDeleteMode}
					on:click={() => onClick(swatch, i)}
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
