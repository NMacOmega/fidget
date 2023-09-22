//@ts-check
import { z } from 'zod';

/**
 * Convenience function to confirm a number is between a max and min value
 * @param {number} num
 * @param {number} max
 * @param {number} min
 * @returns {boolean} true or false
 */
const isNumberBetween = (/**@type {unknown}*/ num, max, min) =>
	typeof num === 'number' &&
	typeof max === 'number' &&
	typeof min === 'number' &&
	min <= num &&
	num <= max;

/**
 * For a series of [num, max, min] data sets,
 * performs {@link isBetween} to see if values are correct.
 *
 * if any one of the sets does not match, the retured value is false
 *
 * if all sets pass, true is returned
 *
 * - a set must be in complete [num, max, min] order or false will be returned
 * @param {[number, number, number][]} params a list of [num, max, min] sets of numbers
 * @returns {boolean} TRUE if all provided sets are valid, FALSE if at least one entry fails
 * @example const isValidBool = isEachNumberBetween([[50, 100, 2], [10, 11, -10], [2.99, 3, 1]]); //true
 * @example const notValid = isEachNumberBetween([[20, 30, 40],[50, 0, 100]]); //false (must be [num, max, min])
 * @example const notValid = isEachNumberBetween([50, 100, 0], [20, 100]); //false (must have 3 numbers)
 * @example const notValid = isEachNumberBetween([[50,60], 100, 0]); //false (must be [#,#,#])
 * @example const notValid = isEachNumberBetween(["50", "100", "0"]); //false (must be numbers only)
 */
const isEachNumberBetween = (params) => {
	for (var i = 0; i < params.length; i++) {
		let [num = 0, max = -1, min = 1] = params[i];
		if (!isNumberBetween(num, max, min)) return false;
	}
	return true;
};

/**
 * Attempts to exract a property from an object. Returns the first value to succeed
 * @param {*} obj an object to check against properties
 * @param {string[]} tags array of lowercase properties to check against
 *
 * each object key will be converted to lower case for testing
 * @param {(v:any)=>boolean} isValidValue Optional function to test if the value meets provided parameters. Defaults to true if not provided
 *
 * if testing function not provided, test will return the first value that exists
 *
 * @returns {*} The first value to be found and vaidated. The rest are ignored
 */
const extractPropertyFromObject = (obj, tags, isValidValue = () => true) => {
	for (const [key, prop] of Object.entries(obj)) {
		const isValidKey = tags.indexOf(key.toLowerCase()) > -1;
		if (isValidKey && isValidValue(prop)) return prop;
	}
};

/**
 * For a string value, returns all of the decimal numbers found in the string as an array
 *
 * Number patterns include:
 * - 123
 * - 1.23
 * - .123
 * @param {*} str
 * @returns {number[]}
 * @example res = numbersFromString("here 1 are 2.2 some .3 n4mbers5 .6") // [1, 2.2, 0.3, 4, 5, 0.6]
 */
const numbersFromString = (/**@type {string}*/ str) =>
	str.match(/\d+\.\d+|\.\d+|\d+/g)?.map((v) => +v) || [];

//ZOD PRIMITIVES AND STRUCTURES

const rgbNumber = z.number().gte(0).lte(255);
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const rgbTupleSchema = z.tuple([rgbNumber, rgbNumber, rgbNumber]);
/**
 * Strings can be parsed so long as three valid rgb values can be parsed out
 * @typedef {string} RGBString
 */

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const hslTupleSchema = z.tuple([hueNumber, percentNumber, percentNumber]);

/**
 * Strings can be parsed so long as three valid rgb values can be parsed out
 * @typedef {string} HSLString
 */

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const hsvTupleSchema = z.tuple([hueNumber, percentNumber, percentNumber]);

/**
 * Strings can be parsed so long as three valid rgb values can be parsed out
 * @typedef {string} HSVString
 */

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
		 * @param {RGBColor | RGBTupleColor | RGBString} val RGB Parsable. See {@link RGBColor}, {@link RGBTupleColor}
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
		 * @param {RGBColor | RGBTupleColor | RGBString} val RGB Parsable. See {@link RGBColor}, {@link RGBTupleColor}
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
		 * @param {RGBColor | RGBTupleColor | RGBString} val RGB Parsable. See {@link RGBColor}, {@link RGBTupleColor}
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
		 * @param {RGBColor | RGBTupleColor | RGBString} val RGB Parsable. See {@link RGBColor}, {@link RGBTupleColor}
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
		 * @param {HSLColor | HSLTupleColor | HSLString} val HSL Parsable. See {@link HSLColor}, {@link HSLTupleColor}, {@link hueNumber}, {@link percentNumber}
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
		 * @param {HSLColor | HSLTupleColor | HSLString} val HSL Parsable. See {@link HSLColor}, {@link HSLTupleColor}, {@link hueNumber}, {@link percentNumber}
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
		 * @param {HSLColor | HSLTupleColor | HSLString} val HSL Parsable. See {@link HSLColor}, {@link HSLTupleColor}, {@link hueNumber}, {@link percentNumber}
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
		 * @param {HSLColor | HSLTupleColor | HSLString} val HSL Parsable. See {@link HSLColor}, {@link HSLTupleColor}, {@link hueNumber}, {@link percentNumber}
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
		 * @param {HSVColor | HSVTupleColor | HSVString} val HSV Parsable. See {@link HSVColor}, {@link HSVTupleColor}, {@link hueNumber}, {@link percentNumber}
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
		 * @param {HSVColor | HSVTupleColor | HSVString} val HSV Parsable. See {@link HSVColor}, {@link HSVTupleColor}, {@link hueNumber}, {@link percentNumber}
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
		 * @param {HSVColor | HSVTupleColor | HSVString} val HSV Parsable. See {@link HSVColor}, {@link HSVTupleColor}, {@link hueNumber}, {@link percentNumber}		 * @returns {HEXColor | undefined} A HEX String, or undefined if failed. See {@link HEXColor}  
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
		 * @param {HSVColor | HSVTupleColor | HSVString} val HSV Parsable. See {@link HSVColor}, {@link HSVTupleColor}, {@link hueNumber}, {@link percentNumber}		 * @returns {Color | undefined} An object with HSL, HSV, HEX, and RGB values, or undefined if failed. See {@link Color}  
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
	const parse = optionalPreprocessor ? optionalPreprocessor.safeParse(val) : schema.safeParse(val);
	if (parse.success) {
		//Casting hack used because JSDoc cannot infer generic return types
		const result = /**@type {unknown}*/ (
			conversionFunctions
				? conversionFunctions.reduce((acc, conversion) => {
						return conversion(acc);
				  }, parse.data)
				: //Just the parse data if no conversions included
				  parse.data
		);
		//Casting because we know our library code results will match the generic we have provided
		return /**@type {TResult}*/ (result);
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

//////////////////////////////////////////////////////////////
/* PREPROCESSORS */

/**
 * Converts an unknown value into [number, number, number] if possible
 *
 * Acceptable values are:
 * - number[] with at least 3 entries
 * - string with 3 number values inside
 * - object with keys that match provided tags for each value
 * - All values must be min <= val <= max
 * - If any of the three values cannot be processed, returns undefined
 * @param {unknown} val
 * @param {[string[], number, number]} aParams tags, max, min
 * @param {[string[], number, number]} bParams tags, max, min
 * @param {[string[], number, number]} cParams tags, max, min
 * @returns {[number, number, number] | undefined } returns the trivalue if possible
 * @example trifromArray = extractTriValue([1,2,3,4,5], [["a"], 0,10,], [["b"], 0,10,], [["c"], 0,10,]) // [1, 2, 3]
 * @example triFromString =  extractTriValue("He1re are so2me num3.0bers!", [["a"], 0,10,], [["b"], 0,10,], [["c"], 0,10,]) // [1, 2, 3]
 * @example triFromObject = extractTriValue({alpha: 1, beta:2, c:3}, [["a", alpha], 0,10,], [["b", "beta"], 0,10,], [["c", "charlie"], 0,10,]) //
 */
function extractTriValue(val, [aTags, aMax, aMin], [bTags, bMax, bMin], [cTags, cMax, cMin]) {
	/**@type {number} */ let a;
	/**@type {number} */ let b;
	/**@type {number} */ let c;

	//"abc[number]def[number]ghi[number]" is permitted with regex conversion to array
	if (typeof val === 'string') val = numbersFromString(val);

	//[a, b, c] is permitted
	if (Array.isArray(val) && val.length >= 3) {
		[a, b, c] = val;
		if (
			isNumberBetween(a, aMax, aMin) &&
			isNumberBetween(b, bMax, bMin) &&
			isNumberBetween(c, cMax, cMin)
		)
			return [a, b, c];
	}
	//{a, b, c } is permitted by looking up acceptable tags and parsing
	else if (typeof val === 'object' && val !== null) {
		a = extractPropertyFromObject(val, aTags, (v) => isNumberBetween(v, aMax, aMin));
		b = extractPropertyFromObject(val, bTags, (v) => isNumberBetween(v, bMax, bMin));
		c = extractPropertyFromObject(val, cTags, (v) => isNumberBetween(v, cMax, cMin));
		if (a && b && c) return [a, b, c];
	}
}

/**
 * Casts val to {H, S, L} Object before parsing against HSL Schema
 * - h must be 0 <= h <= 360
 * - s and l must be 0 <= n <= 160
 * - returns undefined if requirements not met
 * @param {unknown} unknownValue string, object, or array with h, s, l values
 * @returns {HSLColor | undefined} The {@link HSLColor} or undefined if failed
 */
function preprocessHSL(unknownValue) {
	const values = extractTriValue(
		unknownValue,
		[['h', 'hue'], 360, 0],
		[['s', 'saturation'], 100, 0],
		[['l', 'luminosity'], 100, 0]
	);

	if (values && values.length >= 3) {
		const [h, s, l] = values;
		return { h, s, l };
	}
}

/**
 * Casts val to {H, S, V} Object before parsing against HSV Schema
 * - if not possible, returns undefined
 * @param {unknown} unknownValue An unknown value, presumed to be an array of numbers
 * @returns {HSVColor | undefined} The HSV result Array or undefined if failed
 */
function preprocessHSV(unknownValue) {
	const values = extractTriValue(
		unknownValue,
		[['h', 'hue'], 360, 0],
		[['s', 'saturation'], 100, 0],
		[['v', 'value'], 100, 0]
	);

	if (values && values.length >= 3) {
		const [h, s, v] = values;
		return { h, s, v };
	}
}
/**
 * Casts val to {R, G, B} Object before parsing against RGB Schema
 * - if not possible, returns undefined
 * @param {unknown} unknownValue An unknown value, presumed to be an array of numbers
 * @returns {RGBColor | undefined} The RGB result Array or undefined if failed
 */
function preprocessRGB(unknownValue) {
	const values = extractTriValue(
		unknownValue,
		[['r', 'red'], 255, 0],
		[['g', 'green'], 255, 0],
		[['b', 'blue'], 255, 0]
	);

	if (values && values.length >= 3) {
		const [r, g, b] = values;
		return { r, g, b };
	}
}

/**
 * Casts val to Hexadecimal string before parsing against the HEX schema
 * - if not possible, returns undefined
 * @param {unknown} val An unknown value, presumed to be a string
 * @returns {HEXColor | undefined} The Hexadecimal result string or undefined if failed
 */
function preprocessHex(val) {
	//@ts-expect-error nullish cases handled by default empty strings
	let str = val.toString() || '';
	str = str.match(/[\dA-Fa-f]/g)?.join('') || '';
	if (str.length > 6) str = str.substring(0, 5);
	if (str.length === 3) str = `${str}${str}`;
	if (str.length === 6) return str;
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
	const s = parseFloat((saturation * 100).toFixed(3));
	const v = parseFloat((value * 100).toFixed(3));
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
	let { s, l } = hsl;
	l /= 100;
	s /= 100;
	let value = l + s * Math.min(l, 1 - l);
	let saturation = value === 0 ? 0 : 2 * (1 - l / value);
	value *= 100;
	saturation *= 100;
	return { h: hsl.h, s: saturation, v: value };
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
	const saturation = s / 100;
	const value = v / 100;
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
	let { s, v } = hsv;
	s /= 100;
	v /= 100;
	let lightness = Math.min(1, Math.max(0, v * (1 - s / 2)));
	let saturation = (v - lightness) / Math.min(lightness, 1 - lightness) || 0;
	lightness = parseFloat((lightness * 100).toFixed(3));
	saturation = parseFloat((saturation * 100).toFixed(3));
	return { h: hsv.h, s: saturation, l: lightness };
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
