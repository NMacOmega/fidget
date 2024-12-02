import { colorConvert } from '$lib/colorFunctions';

const defaultParameters = {
	hex: '000000',
	rgb: { r: 0, g: 0, b: 0 },
	hsl: { h: 0, s: 0, l: 0 },
	hsv: { h: 0, s: 0, v: 0 }
};

const colorMode = {
	hsv: 'hsv',
	rgb: 'rgb',
	hsl: 'hsl',
	hex: 'hex'
} as const;

export type ColorMode = (typeof colorMode)[keyof typeof colorMode];

export function parseColorFromText(text: string, colorMode: ColorMode) {
	const testRanges = (testsArr) => {
		testsArr.forEach((v, max, min) => {
			if (v > max || v < min) return false;
		});
		return true;
	};

	//This expression will get all integers and decimal numbers from the string
	//We will rely on the user to provide 3 valid values from left to right
	const regxExtractDecimals = new RegExp(/\d+(\.\d+)?/g);
	const [a, b, c]:number[] = ((charsFromRegex)=>{
		return charsFromRegex !== null && charsFromRegex.length >= 3 ?
		[
			Number(charsFromRegex[0]),
			Number(charsFromRegex[1]),
			Number(charsFromRegex[2])]
		: [-1, -1, -1];	
	})(text.match(regxExtractDecimals));

	const hsvInText = (text.match(/[h|H][s|S][v|V]/g) || []).length > 0 || false;
	if (
		(hsvInText || colorMode === 'hsv') &&
		testRanges([
			[a, 360, 0],
			[b, 100, 0],
			[c, 100, 0]
		])
	)
		return { color: generateColor.fromHSV([a, b, c]), processedAs: 'HSV' };

	const hslInText = (text.match(/[h|H][s|S][l|L]/g) || []).length > 0 || false;
	if (
		(hslInText || colorMode === 'hsl') &&
		testRanges([
			[a, 360, 0],
			[b, 100, 0],
			[c, 100, 0]
		])
	)
		return { color: generateColor.fromHSL([a, b, c]), processedAs: 'HSL' };

	const rgbInText = (text.match(/[r|R][g|G][b|B]/g) || []).length > 0 || false;
	if (
		(rgbInText || colorMode === 'rgb') &&
		testRanges([
			[a, 255, 0],
			[b, 255, 0],
			[c, 255, 0]
		])
	)
		return { color: generateColor.fromRGB([a, b, c]), processedAs: 'RGB' };
	return { color: generateColor.fromHex(text), processedAs: 'HEX' };
}

export const generateColor = {
	fromHex: (value: unknown) => {
		const result = colorConvert.HEX.preprocess(value);
		if (result && result.isValid) {
			const hex = result.data;
			const rgb = colorConvert.HEX.toRGB(hex);
			const hsv = colorConvert.RGB.toHSV(rgb);
			const hsl = colorConvert.HSV.toHSL(hsv);
			return { hex, rgb, hsv, hsl, isValid: true };
		} else return { ...defaultParameters, isValid: false };
	},
	fromHSL: (value: unknown) => {
		const result = colorConvert.HSL.preprocess(value);
		if (result && result.isValid) {
			const hsl = result.data;
			const hsv = colorConvert.HSL.toHSV(hsl);
			const rgb = colorConvert.HSV.toRGB(hsv);
			const hex = colorConvert.RGB.toHEX(rgb);
			return { hex, rgb, hsv, hsl, isValid: true };
		} else return { ...defaultParameters, isValid: false };
	},
	fromHSV: (value: unknown) => {
		const result = colorConvert.HSV.preprocess(value);
		if (result && result.isValid) {
			const hsv = result.data;
			const rgb = colorConvert.HSV.toRGB(hsv);
			const hex = colorConvert.RGB.toHEX(rgb);
			const hsl = colorConvert.HSV.toHSL(hsv);
			return { hex, rgb, hsv, hsl, isValid: true };
		} else return { ...defaultParameters, isValid: false };
	},
	fromRGB: (value: unknown) => {
		const result = colorConvert.RGB.preprocess(value);
		if (result && result.isValid) {
			const rgb = result.data;
			const hex = colorConvert.RGB.toHEX(rgb);
			const hsv = colorConvert.RGB.toHSV(rgb);
			const hsl = colorConvert.HSV.toHSL(hsv);
			return { hex, rgb, hsv, hsl, isValid: true };
		} else return { ...defaultParameters, isValid: false };
	}
};

const round = (n: number) => Math.round(n * 100) / 100;

export function generateColorAsText(color, mode: ColorMode) {
	if (mode === 'hsv')
		return `(${round(color.hsv.h)}, ${round(color.hsv.s)}%, ${round(color.hsv.v)}%)`;
	if (mode === 'hsl')
		return `(${round(color.hsl.h)}, ${round(color.hsl.s)}%, ${round(color.hsl.l)}%)`;
	if (mode === 'rgb')
		return `(${round(color.rgb.r)}, ${round(color.rgb.g)}, ${round(color.rgb.b)})`;
	return `#${color.hex}`;
}
