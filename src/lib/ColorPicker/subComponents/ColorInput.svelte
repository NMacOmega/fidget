<script lang="ts">
	import { hsl, hex, hsv, rgb } from '$stores/activeMaterial';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	type Option = keyof typeof options;

	/** binding to text field*/
	let inputText = '';
	let activeOption: Option = 'hsv';

	/**Convenience function for Math.floor*/
	const trim = (n: number) => Math.floor(n);

	/**
	 * Color option button will be displayed in this order from 1 to 4
	 *
	 * - order: decides where this will be sequentially displayed
	 * - formatter: gets the current store value and converts to a formatted string.
	 * - setter: sends a string to the indicated color store for parsing
	 */
	const options = {
		hsv: {
			order: 1,
			formatter: () => `hsv(${trim($hsv.h)}, ${trim($hsv.s)}%, ${trim($hsv.v)}%)`,
			setter: (v: string) => hsv.set(v)
		},
		hsl: {
			order: 2,
			formatter: () => `hsl(${trim($hsl.h)}, ${trim($hsl.s)}%, ${trim($hsl.l)}%)`,
			setter: (v: string) => hsl.set(v)
		},
		rgb: {
			order: 3,
			formatter: () => `rgb(${trim($rgb.r)}, ${trim($rgb.g)}, ${trim($rgb.b)})`,
			setter: (v: string) => rgb.set(v)
		},
		hex: { order: 4, formatter: () => `#${$hex}`, setter: (v: string) => hex.set(v) }
	};

	/**This array is used to guarantee the order we want presented */
	const orderedOptions: [Option, () => string][] = Object.entries(options)
		.sort((a, b) => a[1].order - b[1].order)
		.map(([option, props]) => [option as Option, props.formatter]);

	/**
	 * sends text input to the color store matching {@link activeOption} and informs the parent that it's field has changed.
	 * @param textField current textField content
	 * @void updates color store and dispatches textChange to parent
	 */
	const onChange = (textField: string) => {
		options[activeOption].setter(textField);
		dispatch('textChange');
	};

	/**
	 * When one of the type option buttons is pressed, sets the input field to match templated string and sets the currently active option.
	 * @param {keyof typeof options} option the type of color. Must be a key in the options Object. See {@link options}
	 * @param {void} stringFormatter a function to retrieve the color value from the color store and format it for presentation
	 * @void sets the text field to match and updates activeOption
	 */
	const onClick = (option: Option, stringFormatter: () => string) => {
		inputText = stringFormatter();
		activeOption = option;
	};

	/**
	 * Updates the text field based on the provided store or current active store. Can be called from parent.
	 *
	 * Also updates the activeOption
	 * @param option which option to set, or the current option if none is provided
	 * @void updates input text field and currently active option
	 */
	export const update = (option: Option = activeOption) => {
		inputText = options[option].formatter();
		activeOption = option;
	};
</script>

<div class="colorInput">
	<input
		type="text"
		class="colorInputText"
		bind:value={inputText}
		on:input={(e) => onChange(e.currentTarget.value)}
	/>
	<div class="colorInputChoices">
		{#each orderedOptions as [option, formatter]}
			<button
				style:--buttonColor={activeOption === option ? 'var(--color-bg-accent)' : null}
				class={`colorChoiceButton colorChoiceButton-${option}`}
				on:click={() => {
					onClick(option, formatter);
				}}
				>{option}
			</button>
		{/each}
	</div>
</div>

<style>
	.colorInput {
		grid-row: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.colorInputText {
		border-radius: 20px;
		background-color: var(--color-bg-secondary);
		color: var(--color-primary);
		height: 35px;
		width: 70%;
		margin-bottom: 5px;
		padding: 0 10px;
		font-size: 15px;
	}

	.colorInputChoices {
		display: flex;
	}

	.colorChoiceButton {
		background-color: var(--color-bg-secondary);
		color: var(--color-primary);
		border: 1px solid var(--color-primary);
		width: 100%;
		height: 30px;
		padding: 0 10px;
		background-color: var(--buttonColor, none);
		text-transform: uppercase;
	}

	.colorChoiceButton-hex {
		text-transform: capitalize;
	}

	.colorInputChoices button:first-child {
		border-radius: 35% 0 0 35%;
	}

	.colorInputChoices button:last-child {
		border-radius: 0 35% 35% 0;
	}
</style>
