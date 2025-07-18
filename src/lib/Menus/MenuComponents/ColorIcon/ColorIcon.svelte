<script>
	export let hexColor = 'ffaa22';
	export let hslColor = { h: 20, s: 20, l: 20 };
	export let roughness = 50;
	export let metalness = 50;
	export let opacity = 100;
	export let width = '100%',
		height = '100%';
	let color = '#ffaa22';
	let backgroundColor = 'hsl(20, 20%, 20%)';
	let m = metalness;
	let o = opacity;
	let r = roughness;

	//TODO: When color is too dark, turn border white, otherwise black;
	const outlineColor = '#ffffff';
	const innerOutlineColor = '#000000';

	//Converts String into a hex color without using a color library
	function parseHexColor(hColor = 'ffaa22') {
		let vals = hColor.toString()?.match(/[\dA-Fa-f]/g) || [];
		let digits =
			vals.length >= 6
				? vals.slice(0, 6)
				: vals.length === 3
				? [...vals, ...vals]
				: 'ffffff'.split('');
		return `#${digits.join('')}`;
	}

	function parseBackgroundHSL(hsl = { h: 20, s: 10, l: 20 }) {
		let darkerTone = hsl.l < 0.001 ? hsl.l : hsl.l / 2;
		return `hsl(${hsl.h}, ${hsl.s}%, ${darkerTone}%)`;
	}

	$: color = parseHexColor(hexColor);
	$: backgroundColor = parseBackgroundHSL(hslColor);
	$: m = metalness;
	$: r = roughness;
	$: o = opacity;
	// $: o = 50 + 50 * (opacity / 100);
</script>

<div
	class="container"
	on:click
	style:--color={color}
	style:--backgroundColor={backgroundColor}
	style:--outlineColor={outlineColor}
	style:--innerOutlineColor={innerOutlineColor}
	style:width
	style:height
>
	<span class="metalnessBG" />
	<span class="glossinessBG" />
	<span class="metalness" style:--metalness={m} />
	<span class="glossiness" style:--glossiness={r} />
	<span class="color" style:--opacity={o} />
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

	@property --opoint {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 0%;
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
		--backgroundColor: #00ff00;
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
		--metalness: 50;
		--max: 0deg;
		--min: 170deg;
		--mpoint: calc(calc(calc(100 - var(--metalness)) / 100) * 180deg);
		background: conic-gradient(
			transparent var(--mpoint),
			grey var(--mpoint) 180deg,
			transparent 180deg
		);
		transition: --mpoint 0.5s;
	}

	.glossiness {
		--glossiness: 50;
		--max: 360deg;
		--min: 190deg;
		--gdeg: calc(calc(var(--glossiness) / 100) * 180deg);
		--gpoint: calc(var(--gdeg) + 180deg);
		background: conic-gradient(
			transparent 180deg,
			var(--color) 180deg var(--gpoint),
			transparent var(--gpoint)
		);

		filter: brightness(1.05);
		transition: --gpoint 0.5s;
	}

	.color {
		--opacity: 50;
		--opoint: calc(100% * calc(var(--opacity) / 100));
		width: 75%;
		height: 75%;
		background-image: linear-gradient(
				0deg,
				var(--color) 10%,
				var(--color) 10% var(--opoint),
				transparent var(--opoint)
			),
			linear-gradient(0deg, var(--backgroundColor) 0%, var(--backgroundColor) 100%);
		border: 1px solid var(--innerOutlineColor);
		transition: --opoint 0.5s;
	}
</style>
