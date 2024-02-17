<script>
	import {
		selectedUUIDColor,
		selectedUUIDMetalness,
		selectedUUIDGlossiness,
		selectedUUIDOpacity
	} from '$stores/material';
	import { metalness, opacity, glossiness } from '$stores/material';
	import { hex } from '$stores/colorStores';
	import { materialOptionsList } from '$stores/materialList';
	import { createEventDispatcher } from 'svelte';
	import ColorIcon from './ColorIcon/ColorIcon.svelte';
	import Carousel from '@comps/Carousel/Carousel.svelte';
	import ColorSetControls from './ColorSetControls.svelte';
	import { Color } from '$lib/colorFunctions';
	const dispatch = createEventDispatcher();

	let editingColor = false;
	let editingObject = false;
	let currentChoiceIndex = 0;
	let currentEditIndex = 0;
	let addingColor = false;
	let defaultEditControlParams = {
		color: new Color('000000'),
		metalness: 1,
		glossiness: 1,
		opacity: 1
	};
	let editControlParams = { ...defaultEditControlParams };

	// materialOptionsList.add({
	// 	color: 'ffffff',
	// 	metalness: 0,
	// 	glossiness: 0.8
	// });

	let options = [];
	let optionsSelection = {
		color: new Color('000000'),
		metalness: 0.5,
		glossiness: 0.5,
		opacity: 1
	};

	$: options = [
		{
			color: $selectedUUIDColor,
			metalness: $selectedUUIDMetalness,
			glossiness: $selectedUUIDGlossiness,
			opacity: $selectedUUIDOpacity
		},
		...$materialOptionsList
	];

	$: optionsSelection = options[currentChoiceIndex];

	const applyOption = (color, m, g, o, i) => {
		if ($hex === color && $metalness === m && $glossiness === g && $opacity === o) return;
		hex.set(color);
		metalness.set(m);
		glossiness.set(g);
		//opacity.set(o);
		currentChoiceIndex = i;
	};

	const deleteOption = (i) => {
		materialOptionsList.remove(i);
	};

	const editOption = ({
		color = undefined,
		metalness = undefined,
		glossiness = undefined,
		opacity = undefined,
		index = -1
	}) => {
		console.log(color);
		editControlParams = {
			...editControlParams,
			color: { ...color },
			metalness,
			glossiness,
			opacity
		};
		addingColor = false;
		currentEditIndex = index;
		if (currentEditIndex === currentChoiceIndex) editingObject = true;
		editingColor = true;
	};

	const addOption = () => {
		editControlParams = { ...defaultEditControlParams };
		addingColor = true;
		editingColor = true;
	};

	const onSaveOption = (optionParams) => {
		console.log(index, newOption, isNew);
		editingColor = false;
	};
	const onOptionChange = (index, params) => {
		materialOptionsList.update(index, {
			...options[index],
			...params
		});
	};
</script>

{#if editingColor}
	<ColorSetControls
		{...editControlParams}
		type={!editingObject ? 'icon' : ''}
		on:save={onSaveOption}
		on:change={(e) => onOptionChange(currentEditIndex - 1, e.detail)}
		on:close={() => (editingColor = false)}
	/>
{:else}
	<Carousel>
		<!-- <button class="close" on:click={() => dispatch('close')}><i class="fa-solid fa-close" /></button
		> -->
		<svelte:fragment slot="items">
			{#each options as { color, metalness, glossiness, opacity }, i}
				<div class={`option ${currentChoiceIndex === i ? 'option-active' : ''}`}>
					<div
						class="color-icon"
						on:click={() => applyOption(color, metalness, glossiness, opacity, i)}
					>
						<ColorIcon hexColor={color.hex} {metalness} {glossiness} {opacity} />
					</div>

					{#if i > 0}
						<button
							class="btn edit"
							on:click={() => editOption({ color, metalness, glossiness, opacity, index: i })}
							><i class="edit-icon fa-solid fa-pencil" /></button
						>
						<button class="btn delete" on:click={() => deleteOption(i - 1)}
							><i class="trash-icon fa-solid fa-trash" /></button
						>
					{/if}
				</div>
			{/each}
			<div class="addOption">
				<button class="addButton" on:click={addOption}
					><span class="addButtonText">Add</span><i class="fa-solid fa-plus addIcon" /></button
				>
				<span class="addText">Add</span>
			</div>
		</svelte:fragment>
	</Carousel>
{/if}

<style lang="postcss">
	@import '/postCSS/breakpoints.postcss';
	/* .container {
		--closeButtonSize: 40px;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: hsla(1, 100%, 1%, 0.5);
		display: flex;
		align-items: center;
		justify-content: space-evenly;
	} */

	:global(.carousel) {
		--closeButtonSize: 40px;
		--iconMargin: 10px;
		--iconSize: 80px; /*Size of the icon*/
		--buttonSize: 55px; /*Size of the buttons*/
		--buttonMargin: calc(calc(var(--iconSize) - var(--buttonSize)) / 2);
		--topMargin: 70px;
		--height: calc(calc(var(--iconSize) + var(--buttonSize)) + var(--topMargin));

		@media (--md) {
			--is: 100px; /*Size of the icon*/
			--bs: 40px; /*Size of the buttons*/
		}
		position: absolute;
		bottom: 80px;
		/* left: 0; */
		width: 100%;
		border-radius: 40px;
		background-color: hsla(1, 100%, 1%, 0.5);
		height: 400px;
		/* bottom: 0; */
		overflow-x: hidden;
	}

	@media (--md) {
		:global(.carousel) {
			width: 90%;
		}
	}

	/* :global(.container) {
		width: 100%;
		height: 100%;
	} */

	:global(.items) {
		/* background-color: red; */
	}

	.close {
		border: 1px solid white;
		border-radius: 100%;
		--size: 40px;
		width: var(--closeButtonSize);
		height: var(--closeButtonSize);
		position: absolute;
		top: -50px;
		right: 20vw;
	}
	/* 
	.options {
		grid-area: options;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		padding: 10px;
	} */

	.option {
		--isMargin: 10px;
		--is: 80px; /*Size of the icon*/
		--bs: 55px; /*Size of the buttons*/
		--bsMargin: calc(calc(var(--is) - var(--bs)) / 2);
		/* height: calc(var(--is) + calc(var(--isMargin) * 2)); */
		/* height: var(--height); */
		width: 100%;
		display: grid;
		position: relative;
		grid-template-rows: 10px var(--bsMargin) var(--bs) var(--bsMargin) 10px;
		grid-template-columns: 10vw var(--is) auto var(--bs) 5vw var(--bs) 10vw;
		grid-template-areas:
			'. . . . . . .'
			'. icon . . . . .'
			'. icon . edit . delete .'
			'. icon . . . . .'
			'. . . . . . .';

		@media (--md) {
			margin-top: var(--topMargin);
			--is: 100px; /*Size of the icon*/
			--bs: 40px; /*Size of the buttons*/
			width: unset;
			--topHeighlightMargin: 40px; /*How much to push the active shadow down*/
			--height: calc(calc(var(--is) + var(--bs)) + 70px); /*For active::before when needed*/
			grid-template-rows: 40px var(--is) 20px var(--bs) 10px;
			grid-template-columns: 20px var(--bs) 1fr var(--bs) 20px;
			grid-template-areas:
				'. . . . .'
				'. icon icon icon .'
				'. . . . .'
				'. edit . delete .'
				'. . . . .';
			border-radius: 10px;
		}
	}

	.option-active::before {
		content: '';
		width: 100%;
		height: 100%;
		background-color: hsla(1, 10%, 90%, 0.5);
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	@media (--md) {
		.option-active::before {
			top: var(--topMargin);
			height: var(--height);
			margin-top: var(--topHeighlightMargin);
			border-radius: 15px;
		}
	}

	.option-default,
	.option-add {
		display: grid;
		align-self: flex-start;
		grid-template-columns: 20px auto 1fr;
		grid-template-rows: var(--top-margin) auto 1fr;
		grid-template-areas:
			'. . .'
			'. icon .'
			'. . .';
	}

	.color-icon {
		grid-area: icon;
		--size: var(--is, 100px);
		width: var(--is);
		height: var(--is);
	}
	.edit {
		grid-area: edit;
	}
	.delete {
		grid-area: delete;
	}

	.btn {
		width: var(--option-button-size);
		height: var(--option-button-size);
		background-color: hsla(1, 10%, 30%, 1);
		padding: 5px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.addOption {
		min-height: 70px;
		width: 100%;
		display: grid;
		grid-template-columns: 40px 1fr 40px;
		grid-template-rows: 10px 1fr 10px;
		grid-template-areas: '. . .' '. button .' '. . .';
		@media (--md) {
			margin-top: 70px;
			grid-template-rows: 40px var(--iconSize) 30px var(--buttonSize) 10px;
			grid-template-columns: auto max-content auto;
			grid-template-areas:
				'. . .'
				'. button .'
				'. . .'
				'. text .'
				'. . .';
		}
	}

	.addButton {
		grid-area: button;
		display: flex;
		color: black;
		align-items: center;
		justify-content: center;
		background-color: white;
		border-radius: 20px;
		font-size: 3rem;
		@media (--md) {
			border: 3px solid white;
			border-radius: 100vw;
			width: 100px;
			height: 100px;
		}
	}

	.addText {
		display: none;
		@media (--md) {
			display: block;
			grid-area: text;
			text-align: center;
			margin: auto;
			font-size: 2.4rem;
		}
	}

	.addButtonText {
		margin-right: 1.6rem;
		@media (--md) {
			display: none;
		}
	}

	.addIcon {
	}

	.edit-icon {
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
</style>
