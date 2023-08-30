<script lang="ts">
	import { hsl, hsv, rgb, hex } from '$stores/material';
	// import { hslStore, hsvStore, rgbStore, hexStore } from '$lib/materialStores';
	let hslString, hsvString, rgbString, hexString;

	// use this to compare test values. What happens when HSV is 100% and 0%, 0%, 100%, and so on?
	// https://www.rapidtables.com/convert/color/index.html

	const round = (n: number) => n.toFixed(1);

	const hslToString = ({ h, s, l }) => {
		s *= 100;
		l *= 100;
		return `h: ${h}, s: ${round(s)}%, l: ${round(l)}%`;
	};

	const hsvToString = ({ h, s, v }) => {
		s *= 100;
		v *= 100;
		return `h: ${h}, s: ${round(s)}%, l: ${round(v)}%`;
	};

	const rgbToString = ({ r, g, b }) => {
		return `R: ${r}, G: ${g}, B: ${b}`;
	};

	const test = () => {
		hsl.setHue(0);
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
		<button on:click={test}>Fire!</button>
	</div>
</div>

<style>
	.test {
		position: absolute;
		left: 5%;
		top: 40%;
	}

	.test-section {
	}
	.test-heading {
	}
	.test-input {
	}
</style>
