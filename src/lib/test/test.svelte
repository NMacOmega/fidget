<script>
	import { selectedUUID, hsl, hsv, rgb, hex } from '$lib/stores';
	let hslString, hsvString, rgbString;

	// function update($activeMaterial) {
	// 	hslString = JSON.stringify($hsl);
	// 	hsvString = JSON.stringify($hsv);
	// 	rgbString = JSON.stringify($rgb);
	// 	colorString = JSON.stringify($activeMaterial);
	// }

	// $: update($activeMaterial);
	$: hslString = JSON.stringify($hsl);
	$: hsvString = JSON.stringify($hsv);
	$: rgbString = JSON.stringify($rgb);
</script>

<div class="test">
	<div class="test-section">
		<p>UUID: {$selectedUUID}</p>
	</div>
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
		<p>Hex: {$hex}</p>
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
