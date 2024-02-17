<script>
	export let hexColor = 'ffaa22';
	export let glossiness = 0.5;
	export let metalness = 0.5;
	export let width = '100%',
		height = '100%';
	let color = '#ffaa22';

	const outlineColor = '#ffffff';
	const innerOutlineColor = '#000000';

	$: color = parseColor(hexColor);

	const onClick = () => {
		//@Todo: Remove this function this is just to test animation of transition
		// glossiness = 0.1;
		// metalness = 0.1;
	};

	function parseColor(hColor = 'ffaa22') {
		let vals = hColor.toString()?.match(/[\dA-Fa-f]/g) || [];
		let digits =
			vals.length >= 6
				? vals.slice(0, 6)
				: vals.length === 3
				? [...vals, ...vals]
				: 'ffffff'.split('');

		const intVal = Number(`0x${digits.join('')}`); //Turns into an actual number
		//TODO: When color is too dark, turn border white, otherwise black;

		return `#${digits.join('')}`;
	}
</script>

<div
	class="container"
	on:click={onClick}
	style:--color={color}
	style:--outlineColor={outlineColor}
	style:--innerOutlineColor={innerOutlineColor}
	style:width
	style:height
>
	<span class="metalnessBG" />
	<span class="glossinessBG" />
	<span class="metalness" style:--metalness={metalness} />
	<span class="glossiness" style:--glossiness={glossiness} />
	<span class="color" />
</div>

<style>
	@property --mpoint {
		syntax: '<angle>';
		inherits: false;
		initial-value: 0deg;
	}

	@property --gpoint {
		syntax: '<angle>';
		inherits: false;
		initial-value: 0deg;
	}

	.container,
	.container * {
		border-radius: 100%;
	}

	.container * {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.container {
		--color: #ff0000;
		--outlineColor: #ffffff;
		--innerOutlineColor: #ffffff;
		background: transparent;
		border: 5px solid var(--outlineColor);
		position: relative;
		width: 100%;
		height: 100%;
	}

	.metalnessBG,
	.metalness,
	.glossinessBG,
	.glossiness {
		width: 100%;
		height: 100%;
	}

	.metalnessBG {
		background: conic-gradient(#343434 0deg 180deg, transparent 180deg);
	}

	.glossinessBG {
		background: conic-gradient(transparent 0deg 180deg, var(--color) 180deg);
		filter: brightness(50%);
	}

	.metalness {
		--metalness: 0.5;
		--max: 0deg;
		--min: 170deg;
		--mpoint: calc(calc(1 - var(--metalness)) * 180deg);
		background: conic-gradient(
			transparent var(--mpoint),
			grey var(--mpoint) 180deg,
			transparent 180deg
		);
		/* transition: --mpoint 0.5s; */
	}

	.glossiness {
		--glossiness: 0.5;
		--max: 360deg;
		--min: 190deg;
		--gdeg: calc(calc(var(--glossiness)) * 180deg);
		--gpoint: clamp(var(--min), calc(var(--gdeg) + 180deg), var(--max));
		background: conic-gradient(
			transparent 180deg,
			var(--color) 180deg var(--gpoint),
			transparent var(--gpoint)
		);

		filter: brightness(1.05);
		/* transition: --gpoint 0.5s; */
	}

	.color {
		width: 75%;
		height: 75%;
		background-color: var(--color);
		border: 1px solid var(--innerOutlineColor);
	}
</style>
