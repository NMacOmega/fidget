<script>
	import { hsl, hsv, rgb, hex } from '$stores/material';
	// import { hslStore, hsvStore, rgbStore, hexStore } from '$lib/materialStores';
	let hslString, hsvString, rgbString, hexString;
	let inputString;
	let showInputString = false;

	// use this to compare test values. What happens when HSV is 100% and 0%, 0%, 100%, and so on?
	// https://www.rapidtables.com/convert/color/index.html

	const round = (n) => n.toFixed(1);

	const hslToString = ({ h, s, l }) => {
		return `h: ${h}, s: ${round(s)}%, l: ${round(l)}%`;
	};

	const hsvToString = ({ h, s, v }) => {
		return `h: ${h}, s: ${round(s)}%, l: ${round(v)}%`;
	};

	const rgbToString = ({ r, g, b }) => {
		return `R: ${r}, G: ${g}, B: ${b}`;
	};

	const onClick = () => {
		inputString = 'setHue(0)';
		// hsl.setHue(0);
		showInputString = true;
	};

	$: hslString = hslToString($hsl);
	$: hsvString = hsvToString($hsv);
	$: rgbString = rgbToString($rgb);
	$: hexString = `#${$hex}`;
</script>

<div class="test">
	<div class="test-section">
		<p>HSV: {hsvString}</p>
	</div>
	<div class="test-section">
		<p>RGB: {rgbString}</p>
	</div>
	<div class="test-section">
		<p>HSL: {hslString}</p>
	</div>
	<div class="test-section">
		<p>Hex: {hexString}</p>
	</div>
	<div class="test-section">
		<button on:click={onClick}>Fire!</button>
	</div>
	{#if showInputString}
		<div class="test-section">
			<p>Input was: <span id="inputString">{`"${inputString}"`}</span></p>
		</div>
	{/if}
</div>

<style>
	.test {
		position: absolute;
		left: 5%;
		top: 40%;
	}

	.test-section {
		font-size: 4rem;
	}

	.test-section button {
		font-size: 4rem;
	}

	#inputString {
		text-transform: none;
	}

	.test-heading {
	}
	.test-input {
	}
</style>
