<script>
	import { hsl, hex, hsv, rgb } from '$lib/stores';
	let activeOption = 'hsv';
	let optionText = '';
	const activeButtonColor = 'var(--color-bg-accent)';

	const toPercent = (n) => Math.floor(n * 100);
	const trim = (n) => Math.floor(n);

	const colorOptions = {
		hsv: () => `hsv(${trim($hsv.h)}, ${toPercent($hsv.s)}%, ${toPercent($hsv.v)}%)`,
		hex: () => `#${$hex}`,
		rgb: () => `rgb(${trim($rgb.r)}, ${trim($rgb.g)}, ${trim($rgb.b)})`,
		hsl: () => `hsl(${trim($hsl.h)}, ${toPercent($hsl.s)}%, ${toPercent($hsl.l)}%)`
	};

	const onClick = (option) => {
		activeOption = option;
		optionText = colorOptions[option]();
	};
	const onTextInput = (e) => {
		$hsv = e.target.value;
	};
	const updateOnMaterialChange = (_hsl, _hex, _hsv, _rgb) => {
		optionText = colorOptions[activeOption]();
	};

	$: updateOnMaterialChange($hsl, $hex, $hsv, $rgb);
</script>

<div class="colorInput">
	<input type="text" class="colorInputText" bind:value={optionText} on:input={onTextInput} />
	<div class="colorInputChoices">
		{#each Object.keys(colorOptions) as option}
			<button
				style:--buttonColor={activeOption === option ? activeButtonColor : null}
				class={`colorChoiceButton colorChoiceButton-${option}`}
				on:click={() => onClick(option)}
				>{option}
			</button>
		{/each}
	</div>
</div>

<!-- //https://coloris.js.org/examples.html -->
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
