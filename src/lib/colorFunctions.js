//@ts-check
import { z } from 'zod';

const rgbNumber = z.number().nonnegative().lte(255);
/**Positive Number Between 0 and 255 @typedef {z.infer<rgbNumber>} rgbNumberType*/

const percentNumber = z.number().nonnegative().lte(100);
/**Positive Number Between 0 and 100 @typedef {z.infer<rgbNumber>} percentNumberType*/

const hueNumber = z.number().nonnegative().lte(360);
/**Positive Number Between 0 and 360 @typedef {z.infer<rgbNumber>} HueNumberType*/

/**
 * Hex Number in string format
 * - Format: "000000" <=> "ffffff"
 * See {@link HEXColor lib/colorFunctions.js / HEXColor}
 * @typedef {z.infer<hexSchema>} HEXColor
 */
const hexSchema = z.string().regex(/[\dA-Fa-f]{6}/g);

/**
 * Red, Green, and Blue values.
 * - Format: {r, g, b}
 * - Values: 0 <=> 255
 *
 * See: {@link RGBColor}, {@link rgbNumber}
 * @typedef {z.infer<rgbSchema>} RGBColor
 */
const rgbSchema = z.object({
	r: rgbNumber,
	g: rgbNumber,
	b: rgbNumber
});

/**
 * Red, Green, and Blue values.
 * For Parsing only.
 * - Format: [r, g, b]
 * - Values: 0 <=> 255
 *
 *  See: {@link RGBColor}, {@link rgbNumber}
 * @typedef {z.infer<rgbTupleSchema>} RGBTupleColor
 */
const rgbTupleSchema = z.tuple([rgbNumber, rgbNumber, rgbNumber]);

/**
 * Hue, Saturation, and Luminosity.
 * - Format: {h, s, l}
 * - Hue: 0 <=> 360
 * - Saturation: 0 <=> 100
 * - Luminosity: 0 <=> 100
 *
 * See: {@link HSLColor}, {@link hueNumber}, {@link percentNumber}
 * @typedef {z.infer<hslSchema>} HSLColor
 */
const hslSchema = z.object({
	h: hueNumber,
	s: percentNumber,
	l: percentNumber
});

/**
 * Hue, Saturation, and Luminosity.
 * For Parsing only.
 * - Format: [h, s, l]
 * - Hue: 0 <=> 360
 * - Saturation: 0 <=> 100
 * - Luminosity: 0 <=> 100
 * See: {@link HSLTupleColor}, {@link hueNumber}, {@link percentNumber}
 * @typedef {z.infer<hslTupleSchema>} HSLTupleColor
 */
const hslTupleSchema = z.tuple([hueNumber, percentNumber, percentNumber]);

/**
 * Hue, Saturation, and Value.
 * - Format: {H, S, V}
 * - Hue: 0 <=> 360
 * - Saturation: 0 <=> 100
 * - Value: 0 <=> 100
 *
 * {@link HSVColor}, {@link hueNumber}, {@link percentNumber}
 * @typedef {z.infer<hsvSchema>} HSVColor
 */
const hsvSchema = z.object({
	h: hueNumber,
	s: percentNumber,
	v: percentNumber
});

/**
 * Hue, Saturation, and Value.
 * For Parsing only.
 * - Format: [h, s, v]
 * - Hue: 0 <=> 360
 * - Saturation: 0 <=> 100
 * - Value: 0 <=> 100
 *
 * See {@link HSVTupleColor}, {@link hueNumber}, {@link percentNumber}
 * @typedef {z.infer<hsvTupleSchema>} HSVTupleColor
 */
const hsvTupleSchema = z.tuple([hueNumber, percentNumber, percentNumber]);

/**
 * A Color Represented in the following values:
 * - HSL: {h, s, l} See {@link HSVColor}
 * - HSV: {h, s, v} {@link HSVColor}
 * - RGB: {r, g, b} {@link RGBColor}
 * - HEX: "FFFFFF" {@link HEXColor}
 *
 *  See {@link Color lib/colorFunctions.js.Color}
 * @typedef {z.infer<colorSchema>} Color
 */
export const colorSchema = z.object({
	hex: hexSchema,
	hsl: hslSchema,
	hsv: hsvSchema,
	rgb: rgbSchema
});

//Preprocessors
const castToHEX = z.preprocess(preprocessHex, hexSchema);
const castToHSL = z.preprocess(preprocessHSL, hslSchema);
const castToHSV = z.preprocess(preprocessHSV, hsvSchema);
const castToRGB = z.preprocess(preprocessRGB, rgbSchema);

// prettier-ignore
export const convert = {
	rgb: {
		/**
		 * Valid RGB values:
		 * - r, g, b = 0 <=> 360
		 * 
		 * FORMAT: {r, g, b} or [r, g, b]
		 * 
		 * @param {RGBColor | RGBTupleColor} val RGB Parsable. See {@link RGBColor}, {@link RGBTupleColor}
		 * @returns {HSLColor | undefined} {h, s, l}, or undefined if failed. See {@link HSLColor}  
		 * @see {@link convert.rgb.hsl} 
		 * */
		hsl: (val) => parseAndConvert(val, rgbSchema, hslSchema, [RGBtoHSV, HSVtoHSL], castToRGB),
		
		/**
		 * Valid RGB values:
		 * - r, g, b = 0 <=> 360
		 * 
		 * FORMAT: {r, g, b} or [r, g, b]
		 * 
		 * @param {RGBColor | RGBTupleColor} val RGB Parsable. See {@link RGBColor}, {@link RGBTupleColor}
		 * @returns {HSVColor | undefined} {h, s, v}, or undefined if failed. See {@link HSVColor}  
		 * @see {@link convert.rgb.hsv} 
		 * */
		hsv: (val) => parseAndConvert(val, rgbSchema, hsvSchema, [RGBtoHSV], castToRGB),
		
		/**
		 * Valid RGB values:
		 * - r, g, b = 0 <=> 360
		 * 
		 * FORMAT: {r, g, b} or [r, g, b]
		 * 
		 * @param {RGBColor | RGBTupleColor} val RGB Parsable. See {@link RGBColor}, {@link RGBTupleColor}
		 * @returns {HEXColor | undefined} A HEX String, or undefined if failed. See {@link HEXColor}  
		 * @see {@link convert.rgb.hex} 
		 * */
		hex: (val) => parseAndConvert(val, rgbSchema, hexSchema, [RGBtoHEX], castToRGB),
		
		/**
		 * Valid RGB values:
		 * - r, g, b = 0 <=> 360
		 * 
		 * FORMAT: {r, g, b} or [r, g, b]
		 * 
		 * @param {RGBColor | RGBTupleColor} val RGB Parsable. See {@link RGBColor}, {@link RGBTupleColor}
		 * @returns {Color | undefined} An object with HSL, HSV, HEX, and RGB values, or undefined if failed. See {@link Color}  
		 * @see {@link convert.rgb.toColor} 
		 * */
		toColor: (val) => parseAndConvert(val, rgbSchema, colorSchema, [valueToColorObject], castToRGB),
	},

	hsl: {
		/**
		 *  Valid HSL values:
		 *  - h = 0 <=> 360
		 * - s = 0 <=> 100
		 * - l = 0 <=> 100
		 * - FORMAT: {h, s, l} or [h, s, l]
		 * 
		 * @param {HSLColor | HSLTupleColor} val HSL Parsable. See {@link HSLColor}, {@link HSLTupleColor}, {@link hueNumber}, {@link percentNumber}
		 * @returns {RGBColor | undefined} {r, g, b}, or undefined if failed. See {@link RGBColor}  
		 * @see {@link convert.hsl.rgb} 
		 * */
		rgb: (val) => parseAndConvert(val, hslSchema, rgbSchema, [HSLtoHSV, HSVtoRGB], castToHSL),
		
		/**
		 *  Valid HSL values:
		 *  - h = 0 <=> 360
		 * - s = 0 <=> 100
		 * - l = 0 <=> 100
		 * - FORMAT: {h, s, l} or [h, s, l]
		 * 
		 * @param {HSLColor | HSLTupleColor} val HSL Parsable. See {@link HSLColor}, {@link HSLTupleColor}, {@link hueNumber}, {@link percentNumber}
		 * @returns {HSVColor | undefined} {h, s, v}, or undefined if failed. See {@link HSVColor}  
		 * @see {@link convert.hsl.hsv} 
		 * */
		hsv: (val) => parseAndConvert(val, hslSchema, hsvSchema, [HSLtoHSV], castToHSL),
		
		/**
		 *  Valid HSL values:
		 *  - h = 0 <=> 360
		 * - s = 0 <=> 100
		 * - l = 0 <=> 100
		 * - FORMAT: {h, s, l} or [h, s, l]
		 * 
		 * @param {HSLColor | HSLTupleColor} val HSL Parsable. See {@link HSLColor}, {@link HSLTupleColor}, {@link hueNumber}, {@link percentNumber}
		 * @returns {HEXColor | undefined} A HEX String, or undefined if failed. See {@link HEXColor}  
		 * @see {@link convert.hsl.hex} 
		 * */
		hex: (val) => parseAndConvert(val, hslSchema, hexSchema, [HSLtoHSV, HSVtoRGB, RGBtoHEX], castToHSL),
		
		/**
		 *  Valid HSL values:
		 *  - h = 0 <=> 360
		 * - s = 0 <=> 100
		 * - l = 0 <=> 100
		 * - FORMAT: {h, s, l} or [h, s, l]
		 * 
		 * @param {HSLColor | HSLTupleColor} val HSL Parsable. See {@link HSLColor}, {@link HSLTupleColor}, {@link hueNumber}, {@link percentNumber}
		 * @returns {Color | undefined} An object with HSL, HSV, HEX, and RGB values, or undefined if failed. See {@link Color}  
		 * @see {@link convert.hsl.toColor} 
		 * */
		toColor: (val) => parseAndConvert(val, hslSchema, colorSchema, [valueToColorObject], castToHSL),
	},

	hsv: {
		/**
		 *  Valid HSV values:
		 *  - h = 0 <=> 360
		 * - s = 0 <=> 100
		 * - v = 0 <=> 100
		 * - FORMAT: {h, s, v} or [h, s, v]
		 * 
		 * @param {HSVColor | HSVTupleColor} val HSV Parsable. See {@link HSVColor}, {@link HSVTupleColor}, {@link hueNumber}, {@link percentNumber}
		 * @returns {RGBColor | undefined} {r, g, b}, or undefined if failed. See {@link RGBColor}  
		 * @see {@link convert.hsv.rgb} 
		 * */
		rgb: (val) => parseAndConvert(val, hsvSchema, rgbSchema, [HSVtoRGB], castToHSV), 
		
		/**
		 *  Valid HSV values:
		 *  - h = 0 <=> 360
		 * - s = 0 <=> 100
		 * - v = 0 <=> 100
		 * - FORMAT: {h, s, v} or [h, s, v]
		 * 
		 * @param {HSVColor | HSVTupleColor} val HSV Parsable. See {@link HSVColor}, {@link HSVTupleColor}, {@link hueNumber}, {@link percentNumber}
		 * @returns {HSLColor | undefined} {h, s, l}, or undefined if failed. See {@link HSLColor}  
		 * @see {@link convert.hsv.hsl} 
		 * */
		hsl: (val) => parseAndConvert(val, hsvSchema, hslSchema, [HSVtoHSL], castToHSV),
		
		/**
		 *  Valid HSV values:
		 *  - h = 0 <=> 360
		 * - s = 0 <=> 100
		 * - v = 0 <=> 100
		 * - FORMAT: {h, s, v} or [h, s, v]
		 * 
		 * @param {HSVColor | HSVTupleColor} val HSV Parsable. See {@link HSVColor}, {@link HSVTupleColor}, {@link hueNumber}, {@link percentNumber}		 * @returns {HEXColor | undefined} A HEX String, or undefined if failed. See {@link HEXColor}  
		 * @see {@link convert.hsv.hex} 
		 * */
		hex: (val) => parseAndConvert(val, hsvSchema, hexSchema, [HSVtoRGB, RGBtoHEX], castToHSV),
		
		/**
		 *  Valid HSV values:
		 *  - h = 0 <=> 360
		 * - s = 0 <=> 100
		 * - v = 0 <=> 100
		 * - FORMAT: {h, s, v} or [h, s, v]
		 * 
		 * @param {HSVColor | HSVTupleColor} val HSV Parsable. See {@link HSVColor}, {@link HSVTupleColor}, {@link hueNumber}, {@link percentNumber}		 * @returns {Color | undefined} An object with HSL, HSV, HEX, and RGB values, or undefined if failed. See {@link Color}  
		 * @see {@link convert.hsv.toColor} 
		 * */
		toColor: (val) => parseAndConvert(val, hsvSchema, colorSchema, [valueToColorObject], castToHSV),
	},

	hex: {
		/**
		 *  Valid HEX values:
		 *  - string: "000" <=> "fff"
		 *  - string: "000000" <=> "ffffff"
		 * 
		 * 
		 *   letters are not case sensitive
		 * @param {HEXColor} val HEX Parsable. See {@link HEXColor}
		 * @returns {RGBColor | undefined} {r, g, b}, or undefined if failed. See {@link RGBColor}  
		 * @see {@link convert.hex.rgb} 
		 * */
		rgb: (val) => parseAndConvert(val, hexSchema, rgbSchema, [HEXtoRGB], castToHEX),
		
		/**
		 *  Valid HEX values:
		 *  - string: "000" <=> "fff"
		 *  - string: "000000" <=> "ffffff"
		 * 
		 * 
		 *   letters are not case sensitive
		 * @param {HEXColor} val HEX Parsable. See {@link HEXColor}
		 * @returns {HSLColor | undefined} {h, s, l}, or undefined if failed. See {@link HSLColor}  
		 * @see {@link convert.hex.hsl} 
		 * */
		hsl: (val) => parseAndConvert(val, hexSchema, hslSchema, [HEXtoRGB, RGBtoHSV, HSVtoHSL], castToHEX),
		
		/**
		 *  Valid HEX values:
		 *  - string: "000" <=> "fff"
		 *  - string: "000000" <=> "ffffff"
		 * 
		 * 
		 *   letters are not case sensitive
		 * @param {HEXColor} val HEX Parsable. See {@link HEXColor}
		 * @returns {HSVColor | undefined} {h, s, v}, or undefined if failed. See {@link HSVColor}  
		 * @see {@link convert.hex.hsv} 
		 * */
		hsv: (val) => parseAndConvert(val, hexSchema, hsvSchema, [HEXtoRGB, RGBtoHSV], castToHEX),
		
		/**
		 *  Valid HEX values:
		 *  - string: "000" <=> "fff"
		 *  - string: "000000" <=> "ffffff"
		 * 
		 * 
		 *   letters are not case sensitive
		 * @param {HEXColor} val HEX Parsable. See {@link HEXColor}
		 * @returns {Color | undefined} An object with HSL, HSV, HEX, and RGB values, or undefined if failed. See {@link Color}  
		 * @see {@link convert.hex.toColor} 
		 * */
		toColor: (val) => parseAndConvert(val, hexSchema, colorSchema, [valueToColorObject], castToHEX),
	}
};

/**
 * Parses a provided value with schema, and returns the result of the given conversion function
 * @template TSource Generic: The color type of the original value
 * @template TResult Generic: The color type of the intended result
 * @param {unknown} val an unknown value to parse
 * @param {z.Schema<TSource>} schema The Schema used to parse this value
 * @param {z.Schema<TResult>} _targetSchema The format of the result value
 * @param {Array.<(v:any)=>any>} [conversionFunctions] The function chain to perform the conversion
 * @param {z.ZodEffects<z.ZodTypeAny, TSource, unknown>} [optionalPreprocessor] Optional Preprocessor to use instead of parsing
 * @returns {TResult | undefined} The Parsed color or the converted color (if Conversion functions provided) or undefined if failed
 */
function parseAndConvert(val, schema, _targetSchema, conversionFunctions, optionalPreprocessor) {
	console.log(' Parsing: ', val);
	const parse = optionalPreprocessor ? optionalPreprocessor.safeParse(val) : schema.safeParse(val);
	if (parse.success) {
		//@ts-expect-error
		//@TODO: Need to find out how to cast to tresult correctly or limit to just the color options instead of complete generic
		const result = /**@type {TResult}*/ (
			!conversionFunctions
				? parse.data
				: conversionFunctions.reduce((acc, conversion) => {
						return conversion(acc);
				  }, parse.data)
		);
		return result;
	}
	console.log(parse.error);
}

/**
 * Converts a given color value into an object of HSL, HSV, RGB, and HEX values
 * @param {HSLColor | RGBColor | HSVColor | HEXColor} value A Color Value to build object from
 * @returns {Color} Color
 * @see {@link valueToColorObject colorFunctions.js/valueToColorObject}
 */
function valueToColorObject(value) {
	let hex, hsv, hsl, rgb;
	if (hexSchema.safeParse(value).success) {
		hex = /** @type {HEXColor}*/ (value);
		rgb = HEXtoRGB(hex);
		hsv = RGBtoHSV(rgb);
		hsl = HSVtoHSL(hsv);
		return { hex, hsv, hsl, rgb };
	}
	if (hslSchema.safeParse(value).success) {
		hsl = /** @type {HSLColor}*/ (value);
		hsv = HSLtoHSV(hsl);
		rgb = HSVtoRGB(hsv);
		hex = RGBtoHEX(rgb);
		return { hex, hsv, hsl, rgb };
	}
	if (rgbSchema.safeParse(value).success) {
		rgb = /** @type {RGBColor}*/ (value);
		hex = RGBtoHEX(rgb);
		hsv = RGBtoHSV(rgb);
		hsl = HSVtoHSL(hsv);
		return { hex, hsv, hsl, rgb };
	}
	if (hsvSchema.safeParse(value).success) {
		hsv = /** @type {HSVColor}*/ (value);
		hsl = HSVtoHSL(hsv);
		rgb = HSVtoRGB(hsv);
		hex = RGBtoHEX(rgb);
		return { hex, hsv, hsl, rgb };
	}
	throw new Error('Invalid input to make a color object. input must be parsed first');
}

/**
 * Casts val to Hexadecimal string before parsing against the HEX schema
 * - if not possible, returns undefined
 * @param {unknown} val An unknown value, presumed to be a string
 * @returns {HEXColor | undefined} The Hexadecimal result string or undefined if failed
 */
function preprocessHex(val) {
	let str = val.toString() || '';
	str = str.match(/[\dA-Fa-f]/g).join('') || '';
	if (str.length > 6) str = str.substring(0, 5);
	if (str.length === 3) str = `${str}${str}`;
	if (str.length > 0) return str;
}
/**
 * Casts val to {H, S, L} Object before parsing against HSL Schema
 * - if not possible, returns undefined
 * @param {unknown} val An unknown value, presumed to be an array of numbers
 * @returns {HSLColor | undefined} The HSL result Array or undefined if failed
 */
function preprocessHSL(val) {
	const { h, s, l } = val;
	return { h, s, l };
}
/**
 * Casts val to {H, S, V} Object before parsing against HSV Schema
 * - if not possible, returns undefined
 * @param {unknown} val An unknown value, presumed to be an array of numbers
 * @returns {HSVColor | undefined} The HSV result Array or undefined if failed
 */
function preprocessHSV(val) {
	const { h, s, v } = val;
	return { h, s, v };
}
/**
 * Casts val to {R, G, B} Object before parsing against RGB Schema
 * - if not possible, returns undefined
 * @param {unknown} val An unknown value, presumed to be an array of numbers
 * @returns {RGBColor | undefined} The RGB result Array or undefined if failed
 */
function preprocessRGB(val) {
	const { r, g, b } = val;
	return { r, g, b };
}

//////////////////////////////////////////////////////////////
//CONVERSION FUNCTIONS

/**
 * Convert RGB to HSV.
 * @param {RGBColor} rgb Red, Green, and Blue Object.
 * @return {HSVColor} Hue, Saturation, Value Object.
 *
 * See {@link RGBColor}, {@link HSVColor}
 */
function RGBtoHSV(rgb) {
	const { r, g, b } = rgb;
	const red = r / 255;
	const green = g / 255;
	const blue = b / 255;
	const xmax = Math.max(red, green, blue);
	const xmin = Math.min(red, green, blue);
	const chroma = xmax - xmin;
	const value = xmax;
	let hue = 0;
	let saturation = 0;

	if (chroma) {
		if (xmax === red) {
			hue = (green - blue) / chroma;
		}
		if (xmax === green) {
			hue = 2 + (blue - red) / chroma;
		}
		if (xmax === blue) {
			hue = 4 + (red - green) / chroma;
		}
		if (xmax) {
			saturation = chroma / xmax;
		}
	}

	hue = Math.floor(hue * 60);
	const h = hue < 0 ? hue + 360 : hue;
	const s = parseFloat(saturation.toFixed(3));
	const v = parseFloat(value.toFixed(3));
	return { h, s, v };
}

/**
 * Convert HSL to HSV.
 * @param {HSLColor} hsl Hue, saturation, and lightness Object.
 * @return {HSVColor} Hue, saturation, value Object.
 *
 * See {@link HSLColor}, {@link HSVColor}
 */
function HSLtoHSV(hsl) {
	const { h, s, l } = hsl;
	const value = l + s * Math.min(l, 1 - l);
	const saturation = value === 0 ? 0 : 2 * (1 - l / value);
	return { h, s: saturation, v: value };
}

/**
 * Convert HSV to RGB.
 * @param {HSVColor} hsv Hue, Saturation, Value Object.
 * @return {RGBColor} Red, Green, and Blue Object.
 *
 * See {@link HSVColor}, {@link RGBColor}
 */
function HSVtoRGB(hsv) {
	const { h, s, v } = hsv;
	const saturation = s;
	const value = v;
	const hueBy60 = h / 60;
	let chroma = saturation * value;
	let x = chroma * (1 - Math.abs((hueBy60 % 2) - 1));
	const m = value - chroma;

	chroma = chroma + m;
	x = x + m;

	const index = Math.floor(hueBy60) % 6;
	const red = [chroma, x, m, m, x, chroma][index];
	const green = [x, chroma, chroma, x, m, m][index];
	const blue = [m, m, x, chroma, chroma, x][index];
	const r = Math.round(red * 255);
	const g = Math.round(green * 255);
	const b = Math.round(blue * 255);

	return { r, g, b };
}

/**
 * Convert HSV to HSL.
 * @param {HSVColor} hsv Hue, Saturation, Value Object.
 * @return {HSLColor} Hue, Saturation, Luminosity Object.
 *
 * See {@link HSVColor}, {@link HSLColor}
 */
function HSVtoHSL(hsv) {
	const { h, s, v } = hsv;
	let lightness = Math.min(1, Math.max(0, v * (1 - s / 2)));
	let saturation = (v - lightness) / Math.min(lightness, 1 - lightness);
	lightness = parseFloat(lightness.toFixed(3));
	saturation = parseFloat(saturation.toFixed(3));
	return { h, s: saturation, l: lightness };
}

/**
 * Convert Hex to RGB.
 * @param {HEXColor} hex hex color string.
 * @returns {RGBColor} Red, Green, and Blue Object
 *
 * See {@link HEXColor}, {@link RGBColor}
 */
function HEXtoRGB(hex) {
	const values = hex.match(/\w\w/g) || [];
	const [r, g, b] = values.map((k) => parseInt(k, 16));
	return { r, g, b };
}

/**
 * Convert RGB to Hex.
 * @param {RGBColor} rgb Red, Green, and Blue Object
 * @return {HEXColor} Hex color string.
 *
 * See {@link RGBColor}, {@link HEXColor}
 */
function RGBtoHEX(rgb) {
	const { r, g, b } = rgb;
	let R = r.toString(16);
	let G = g.toString(16);
	let B = b.toString(16);

	if (r < 16) {
		R = '0' + R;
	}

	if (g < 16) {
		G = '0' + G;
	}

	if (b < 16) {
		B = '0' + B;
	}
	return R + G + B;
}
