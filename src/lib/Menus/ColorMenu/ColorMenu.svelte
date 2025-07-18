<script lang="ts">
	import ColorIcon from '../MenuComponents/ColorIcon/ColorIcon.svelte';
	import { colorConvert } from '$lib/colorFunctions';
	import {
		currentMaterialColor,
		currentMaterialMetalness,
		currentMaterialOpacity,
		currentMaterialOptions,
		currentMaterialRoughness
	} from '$stores/materialList';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import { currentMaterial } from '$stores/materialList';

	let activeIndex = $currentMaterialOptions.activeOption;

	const onColorChoice = (i = 0) => {
		activeIndex = i;
		currentMaterialOptions.updateChoice(i);
		currentMaterialOptions.applyOption(i);
	};
	// @todo: Its getting annoying for this click to kill the menu. I think we should nix this svelte window instance
	// const onWindowClick = (objectClassName) => {
	// 	if (objectClassName.includes('canvas')) dispatch('close');
	// };
	//Used to assign background classes when looping options
	let options = $currentMaterialOptions.options;
	let positionClasses = ['first', 'second', 'third', 'fourth'];
	options = { ...options };
	positionClasses.forEach((c, i) => {
		options[i].pclass = c;
		options[i].hslColor = colorConvert.HEX.toHSL(options[i].color);
	});
	let activeOption;
	$: activeOption = options[activeIndex];
</script>

<!-- <svelte:window
	on:touchend={(e) => onWindowClick(e.target?.className || '')}
	on:mousedown={(e) => {
		onWindowClick(e.target?.className);
	}}
/> -->

<div class="colorMenu">
	<div class="bg" />
	<div class="colorChoices">
		{#each $currentMaterialOptions.options as { color, metalness, roughness, opacity, pclass, hslColor }, i}
			<div class={`${pclass}-bg ${activeOption === i ? 'active' : ''}`} />
			<div class={`colorOption ${pclass}`} on:click={() => onColorChoice(i)}>
				<ColorIcon hexColor={color} {metalness} {roughness} {opacity} {hslColor} />
			</div>
		{/each}
	</div>
	<div class="currentColor">
		<ColorIcon
			hexColor={$currentMaterialColor}
			metalness={$currentMaterialMetalness}
			roughness={$currentMaterialRoughness}
			opacity={$currentMaterialOpacity}
			hslColor={activeOption.hsl}
		/>
	</div>
	{#if activeIndex > 0}
		<button class="edit" on:click={() => dispatch('edit', activeOption)}>
			<i class="edit-icon fa-solid fa-pencil" />
		</button>
	{:else}
		<div class="colorLocked">
			<i class="edit-icon fa-solid fa-lock" />
		</div>
	{/if}
	<button
		class="close"
		on:click={() => {
			dispatch('close');
		}}>Close</button
	>
</div>

<style>
	.colorMenu {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 10px min(35vw, 10rem) min(25vw, 15rem) 1fr 80px 10px;
		grid-template-rows: 1fr 8rem 10px min(35vw, 10rem) 10px;
		grid-template-areas:
			'. . . . . .'
			'colorChoices colorChoices colorChoices colorChoices colorChoices colorChoices'
			'. . . . . .'
			'. currentColor edit . close .'
			'. . . . . .';
	}

	.colorChoices {
		grid-area: colorChoices;
		display: grid;
		grid-template-columns: 10px 1fr 1fr 1fr 1fr 10px;
		grid-template-areas: '. first second third fourth .';
		align-items: center;
		background-color: hsla(1, 100%, 0%, 0.2);
		border-radius: 25px 25px 25px 0;
	}

	.colorMenu > * {
		pointer-events: auto;
	}

	.colorOption {
		width: 5rem;
		height: 5rem;
		margin: auto;
	}
	.first {
		grid-area: first;
	}

	.first-bg {
		background-color: hsl(0, 1%, 20%);
		grid-row: 1 / 2;
		grid-column: 1 / 3;
		width: 100%;
		height: 100%;
		border-radius: 0 40px 40px 0;
	}
	.first-bg.active {
		background-color: hsl(0, 14%, 88%);
	}
	.second {
		grid-area: second;
	}
	.second-bg {
		grid-area: second;
		width: 100%;
		height: 100%;
		display: none;
	}
	.second-bg.active {
		display: block;
		background-color: hsl(0, 1%, 20%);
	}

	.third {
		grid-area: third;
	}
	.third-bg {
		grid-area: third;
		width: 100%;
		height: 100%;
		display: none;
	}
	.third-bg.active {
		display: block;
		background-color: hsl(0, 1%, 20%);
	}
	.fourth {
		grid-area: fourth;
	}
	.fourth-bg {
		grid-area: fourth;
		width: 100%;
		height: 100%;
		display: none;
	}
	.fourth-bg.active {
		display: block;
		background-color: hsl(0, 1%, 20%);
	}

	.currentColor {
		grid-area: currentColor;
		width: min(100%, 10rem);
		height: min(100%, 10rem);
	}
	.edit {
		grid-area: edit;
		background-color: hsla(1, 10%, 30%, 1);
		padding: 15px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: auto auto 10px 10px;
	}

	.colorLocked {
		grid-area: edit;
		padding: 5px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: auto auto 10px 2px;
	}
	.edit > *,
	.colorLocked > * {
		background: linear-gradient(
			to right,
			#ef5350,
			#f48fb1,
			#7e57c2,
			#2196f3,
			#26c6da,
			#43a047,
			#eeff41,
			#f9a825,
			#ff5722
		);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.close {
		background-color: hsl(10, 90%, 90%);
		color: black;
		grid-area: close;
		margin: auto 20px 10px auto;
		padding: 10px 20px;
		border-radius: 15px;
	}

	.bg {
		background-color: hsla(1, 100%, 0%, 0.2);
		grid-column: 1/ -2;
		grid-row: -4 / -1;
		border-radius: 0 80px 30px 0;
	}
</style>
