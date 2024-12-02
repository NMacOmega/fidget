<script lang="ts">
	import { paletteStore } from '$stores/materialList';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import {
		currentMaterialColor,
		currentMaterialMetalness,
		currentMaterialOpacity,
		currentMaterialRoughness
	} from '$stores/materialList';

	let options;
	$: options = [...$paletteStore];

	//Used to manually scroll in the list when highlighting a duplicate option
	let optionsListScroll: HTMLElement;
	//Used to determine which element to highlight when there is a duplicate submission
	let highlightIndex = -1;
	function onAdd() {
		const { wasAdded, duplicateIndex = -1 } = paletteStore.add({
			color: $currentMaterialColor,
			metalness: $currentMaterialMetalness,
			roughness: $currentMaterialRoughness,
			opacity: $currentMaterialOpacity
		});
		if (wasAdded) highlightIndex = -1;
		else {
			highlightIndex = duplicateIndex;
			optionsListScroll.children
				.item(duplicateIndex)
				?.scrollIntoView({ block: 'center', behavior: 'smooth' });
		}
	}
</script>

<div class="paletteTab">
	<div class="optionsList" bind:this={optionsListScroll}>
		{#each options as option, i}
			<div
				class={`option ${i === highlightIndex ? 'highlight' : ''}`}
				on:animationend={() => (highlightIndex = -1)}
			>
				<div class="color" style:--color={`#${option.color}`} />
				<div class="metalness">
					<span class="title">M</span>
					<div class="bar" style:--m={`${option.metalness}%`} style:--c={`#cacaca`} />
				</div>
				<div class="roughness">
					<span class="title">R</span>
					<div class="bar" style:--r={`${option.roughness}%`} style:--c={`#${option.color}`} />
				</div>
				<div class="opacity">
					<span class="title">O</span>
					<div class="bar" style:--o={`${option.opacity}%`} style:--c={`#f9ff9f`} />
				</div>

				<button
					class="optionApplyButton"
					on:click={() => {
						dispatch('applyPaletteOption', { ...option });
						highlightIndex = -1;
					}}
					style:--color={`#${option.color}`}><i class="fa-solid fa-paint-roller" /></button
				>
				<button class="optionTrashButton" on:click={() => paletteStore.remove(i)}
					><i class="fa-solid fa-trash" /></button
				>
			</div>
		{/each}
		<button class="addOptionButton" on:click={onAdd}
			><span class="addOptionButtonText">+</span>
		</button>
	</div>
	<button class="applyButton" on:click={() => dispatch('applyToMaterial')}>Apply</button>
</div>

<style>
	@keyframes highlight {
		0% {
			background-color: transparent;
		}
		50% {
			background-color: hsl(60, 80%, 74%);
		}
		100% {
			background-color: transparent;
		}
	}

	.paletteTab {
		max-height: 27rem;
		display: grid;
		grid-template-rows: 1fr 5rem;
		grid-template-columns: 1rem auto 1rem;
		grid-template-areas:
			'. list .'
			'. apply .';
	}

	.optionsList {
		grid-area: list;
		overflow-y: scroll;
		display: flex;
		flex-direction: column;
	}

	.option {
		display: grid;
		margin-bottom: 2rem;
		grid-template-rows: 1fr 1fr 1fr;
		grid-template-columns: 1fr 6fr 1fr 6fr 1fr 3fr 1fr 3fr 1fr;
		grid-template-areas:
			'. color . metalness . apply . trash .'
			'. color . roughness . apply . trash .'
			'. color . opacity . apply . trash .';
		animation: none;
	}

	.option:first-of-type {
		margin-top: 2rem;
	}

	.option.highlight {
		animation: highlight 1s 2;
	}

	.color {
		grid-area: color;
		background-color: var(--color, 'grey');
	}

	.metalness,
	.roughness,
	.opacity {
		display: grid;
		grid-template-columns: 1fr 5fr;
		grid-template-areas: 'title bar';
	}
	.title {
		grid-area: title;
		font-size: 0.8rem;
	}

	.bar {
		grid-area: bar;
	}

	.metalness {
		grid-area: metalness;
	}

	.metalness > .bar {
		width: var(--m, 10%);
		background-color: var(--c, grey);
	}
	.roughness {
		grid-area: roughness;
	}

	.roughness > .bar {
		width: var(--r, 30%);
		background-color: var(--c, blue);
	}

	.opacity {
		grid-area: opacity;
	}

	.opacity > .bar {
		width: var(--o, 100%);
		background-color: var(--c, yellow);
	}

	.optionApplyButton {
		grid-area: apply;
		background-color: var(--color, purple);
		border-radius: 100%;
	}

	.optionTrashButton {
		grid-area: trash;
	}

	.addOptionButton {
		background-color: grey;
		border-radius: 100%;
		width: 4rem;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: auto;
	}

	.addOptionButtonText {
		font-size: 2rem;
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
</style>
