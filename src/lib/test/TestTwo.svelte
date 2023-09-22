<script>
	import { convert } from '$lib/colorFunctions';

	let color = convert.hsl.toColor({ h: 20, s: 30, l: 99 });
	let hsl = color?.hsl;
	let hslValid = true;
	let hsv = color?.hsv;
	let hsvValid = true;
	let hex = color?.hex;
	let rgbValid = true;
	let rgb = color?.rgb;
	let hexValid = true;
	let hslText, hsvText, hexText, rgbText;

	const generateTestData = (/**@type {string}*/ str, /**@type {string}*/ format) => {
		if (format === 'hex') return [str, 'string'];

		const isArr = new RegExp(/\[.+\]/g);
		const isObj = new RegExp(/\{.+\}/g);
		const isDigit = new RegExp(/-?\d+\.\d+|-?\.\d+|-?\d+/g);
		const isProp = new RegExp(/\w+\s*:\s*-?\w+|\d+/g);

		if (isObj.test(str)) {
			return [
				str.match(isProp)?.reduce((acc, prop) => {
					let [tag, val] = prop.split(':');
					if (tag) tag = tag.replaceAll(' ', '');
					if (val) val = val.replaceAll(' ', '');
					return { ...acc, [tag]: Number(val) };
				}, {}),
				'object'
			];
		}
		if (isArr.test(str)) return [str.match(isDigit)?.map((v) => +v) || [], 'array'];
		return [str, 'string'];
	};

	const onHSLInput = (e) => {
		const input = e.currentTarget.value;
		hslText = input;

		const [testInput, mode] = generateTestData(input, 'hsl');

		const newColor = convert.hsl.toColor(testInput);
		console.log(testInput, ' converted from [', mode, '] to', newColor);

		if (!newColor) return (hslValid = false);
		hslValid = true;
		({ hsv, hex, rgb } = newColor);
	};
	const onHSVInput = (e) => {
		const input = e.currentTarget.value;
		hsvText = input;

		const [testInput, mode] = generateTestData(input, 'hsv');

		const newColor = convert.hsv.toColor(testInput);
		console.log(testInput, ' converted from [', mode, '] to', newColor);

		if (!newColor) return (hsvValid = false);
		hsvValid = true;
		({ hsl, hex, rgb } = newColor);
	};

	const onRGBInput = (e) => {
		const input = e.currentTarget.value;
		rgbText = input;

		const [testInput, mode] = generateTestData(input, 'rgb');

		const newColor = convert.rgb.toColor(testInput);
		console.log(testInput, ' converted from [', mode, '] to', newColor);

		if (!newColor) return (rgbValid = false);
		rgbValid = true;
		({ hsv, hex, hsl } = newColor);
	};

	const onHEXInput = (e) => {
		const input = e.currentTarget.value;
		hexText = input;

		const [testInput, mode] = generateTestData(input, 'hex');

		const newColor = convert.hex.toColor(testInput);
		console.log(testInput, ' converted from [', mode, '] to', newColor);

		if (!newColor) return (hexValid = false);
		hexValid = true;
		({ hsv, rgb, hsl } = newColor);
	};

	const hslAsString = (hsl) => {
		if (!hsl) return 'Bad HSL Input';
		return `${hsl.h}deg, ${hsl.s}%, ${hsl.l}%`;
	};
	const hsvAsString = (hsv) => {
		if (!hsv) return 'Bad HSV Input';
		return `${hsv.h}deg, ${hsv.s}%, ${hsv.v}%`;
	};
	const rgbAsString = (rgb) => {
		if (!rgb) return 'Bad RGB Input';
		return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
	};
	const hexAsString = (hex) => {
		if (!hex) return 'Bad HEX Input';
		return `#${hex}`;
	};

	$: hslText = hslAsString(hsl);
	$: hsvText = hsvAsString(hsv);
	$: hexText = hexAsString(hex);
	$: rgbText = rgbAsString(rgb);
</script>

<div class="test">
	<div class="test-section">
		<h3>
			HSL: <span
				><input type="text" class:invalid={!hslValid} value={hslText} on:input={onHSLInput} /></span
			>
		</h3>
	</div>
	<div class="test-section">
		<h3>
			HSV: <span
				><input type="text" class:invalid={!hsvValid} value={hsvText} on:input={onHSVInput} /></span
			>
		</h3>
	</div>
	<div class="test-section">
		<h3>
			RGB: <span
				><input type="text" class:invalid={!rgbValid} value={rgbText} on:input={onRGBInput} /></span
			>
		</h3>
	</div>
	<div class="test-section">
		<h3>
			HEX: <span
				><input type="text" class:invalid={!hexValid} value={hexText} on:input={onHEXInput} /></span
			>
		</h3>
	</div>
</div>

<style>
	.test {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 60%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: blue;
	}

	.test-section {
		font-size: 3.5rem;
	}

	.test-section h3 {
	}

	.test-section span {
	}

	.test-section input {
		font-size: 3.5rem;
	}

	.invalid {
		background-color: red;
	}
</style>
