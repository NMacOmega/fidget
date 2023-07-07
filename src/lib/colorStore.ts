import { writable } from "svelte/store";

export const createColorStore = (initialValue)=>{
	const {subscribe, set} = writable(parseColor(initialValue));  
	return {subscribe, set, parseColor, isHex, isShortHex};
  };


function parseColor(val){
	let hsv, rgb, hsl, hex;

	const checkIs = (obj, keys)=>{
		if(typeof obj !== 'object' || obj === null) return false;
		let is = true;
		for(const k of keys){
			if(!(k in obj)){is = false; break;}
		}
		return is;
	}
	const isHSV = checkIs(val, ['h', 's', 'v']);
	const isHSL = checkIs(val, ['h', 's', 'l']);
	const isRGB = checkIs(val, ['r', 'g', 'b']);
	const isHEX = isHex(val); //|| isShortHex(val);


	if(isHSV){
		hsv = val;
		rgb = HSVtoRGB(val);
		hsl = HSVtoHSL(val);
		hex = RGBToHex(rgb);
	}

	else if(isHSL){
		hsl = val;
		hsv = HSLtoHSV(val);
		rgb = HSVtoRGB(hsv);
		hex = RGBToHex(rgb);
	}

	else if(isRGB){
		rgb = val;
		hsv = RGBtoHSV(val);
		hsl = HSVtoHSL(val);
		hex = RGBToHex(rgb);
	}

	else if(isHEX){
		hex = val;
		rgb = HexToRGB(val);
		hsv = RGBtoHSV(rgb);
		hsl = HSVtoHSL(hsv);
	}

	return {hsv, rgb, hsl, hex};
}



/**
 * Convert HSVA to RGBA.
 * @param {object} hsva Hue, saturation, value and alpha values.
 * @return {object} Red, green, blue and alpha values.
 */
function HSVtoRGB(hsv) {
	const saturation = hsv.s / 100;
	const value = hsv.v / 100;
	let chroma = saturation * value;
	const hueBy60 = hsv.h / 60;
	let x = chroma * (1 - Math.abs((hueBy60 % 2) - 1));
	const m = value - chroma;

	chroma = chroma + m;
	x = x + m;

	const index = Math.floor(hueBy60) % 6;
	const red = [chroma, x, m, m, x, chroma][index];
	const green = [x, chroma, chroma, x, m, m][index];
	const blue = [m, m, x, chroma, chroma, x][index];

	return {
		r: Math.round(red * 255),
		g: Math.round(green * 255),
		b: Math.round(blue * 255),
	};
}

/**
 * Convert HSVA to HSLA.
 * @param {object} hsva Hue, saturation, value and alpha values.
 * @return {object} Hue, saturation, lightness and alpha values.
 */
function HSVtoHSL(hsv) {
	const value = hsv.v / 100;
	const lightness = value * (1 - hsv.s / 100 / 2);
	let saturation;

	if (lightness > 0 && lightness < 1) {
		saturation = Math.round(((value - lightness) / Math.min(lightness, 1 - lightness)) * 100);
	}

	return {
		h: hsv.h,
		s: saturation || 0,
		l: Math.round(lightness * 100),
	};
}


function HSLtoHSV(hsl){
	const value = hsl.l + hsl.s * Math.min(hsl.l, 1-hsl.l);
	return{
		h: hsl.h,
		s: (value === 0) ? 0 : 2*(1- hsl.l/value),
		v: value,
	};
}
/**
 * Convert RGBA to HSVA.
 * @param {object} rgba Red, green, blue and alpha values.
 * @return {object} Hue, saturation, value and alpha values.
 */
function RGBtoHSV(rgb) {
	const red = rgb.r / 255;
	const green = rgb.g / 255;
	const blue = rgb.b / 255;
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

	return {
		h: hue < 0 ? hue + 360 : hue,
		s: Math.round(saturation * 100),
		v: Math.round(value * 100),
	};
}



/**
 * Convert RGBA to Hex.
 * @param {object} rgba Red, green, blue and alpha values.
 * @return {string} Hex color string.
 */
function RGBToHex(rgb) {
	let R = rgb.r.toString(16);
	let G = rgb.g.toString(16);
	let B = rgb.b.toString(16);

	if (rgb.r < 16) {
		R = '0' + R;
	}
	
	if (rgb.g < 16) {
		G = '0' + G;
	}
	
	if (rgb.b < 16) {
		B = '0' + B;
	}
	return '#' + R + G + B;
}

function HexToRGB(hex: string) {
	if(isHex(hex)) {
		let values = hex.match(/\w\w/g);
		let [r, g, b] = values.map((k)=>parseInt(k,16));
		return {r, g, b};
	}
	//Add code if isSHorthex like #fff or fff
	
}

function isHex(val){
	return /^#([A-Fa-f0-9]{6})|([A-Fa-f0-9]{6})/.test(val);
}

function isShortHex(val){
	return /^#([A-Fa-f0-9]{3})|([A-Fa-f0-9]{3})/.test(val);
}

// /**
//  * Convert RGBA values to a CSS rgb/rgba string.
//  * @param {object} rgba Red, green, blue and alpha values.
//  * @return {string} CSS color string.
//  */
// function RGBAToStr(rgba) {
// 	if (!settings.alpha || (rgba.a === 1 && !settings.forceAlpha)) {
// 		return `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;
// 	} else {
// 		return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
// 	}
// }

// /**
//  * Convert HSLA values to a CSS hsl/hsla string.
//  * @param {object} hsla Hue, saturation, lightness and alpha values.
//  * @return {string} CSS color string.
//  */
// function HSLAToStr(hsla) {
// 	if (!settings.alpha || (hsla.a === 1 && !settings.forceAlpha)) {
// 		return `hsl(${hsla.h}, ${hsla.s}%, ${hsla.l}%)`;
// 	} else {
// 		return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`;
// 	}
// }

// /**
//  * Parse a string to RGBA.
//  * @param {string} str String representing a color.
//  * @return {object} Red, green, blue and alpha values.
//  */
// function strToRGBA(str) {
// 	const regex = /^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i;
// 	let match, rgba;

// 	// Default to black for invalid color strings
// 	ctx.fillStyle = '#000';

// 	// Use canvas to convert the string to a valid color string
// 	ctx.fillStyle = str;
// 	match = regex.exec(ctx.fillStyle);

// 	if (match) {
// 		rgba = {
// 			r: match[3] * 1,
// 			g: match[4] * 1,
// 			b: match[5] * 1,
// 			a: match[6] * 1
// 		};

// 		// Workaround to mitigate a Chromium bug where the alpha value is rounded incorrectly
// 		rgba.a = +rgba.a.toFixed(2);
// 	} else {
// 		match = ctx.fillStyle
// 			.replace('#', '')
// 			.match(/.{2}/g)
// 			.map((h) => parseInt(h, 16));
// 		rgba = {
// 			r: match[0],
// 			g: match[1],
// 			b: match[2],
// 			a: 1
// 		};
// 	}

// 	return rgba;
// }
