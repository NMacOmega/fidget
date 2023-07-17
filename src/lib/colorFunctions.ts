export function parseRGB (props) {
 return props;
};


export function parseHSL(props) {
    return props;
};

export function parseHSV(props) {
    return props;
};

export function parseHEX(props) {
    return props;
};


//RGB Conversions
/**
 * Convert RGBA to Hex.
 * @param {object} rgba Red, green, blue and alpha values.
 * @return {string} Hex color string.
 */
export function RGBtoHEX(rgb) {
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
};

export function RGBtoHSL(rgb) {
    const hsv = RGBtoHSV(rgb);
    return HSVtoHSL(hsv);
};
/**
 * Convert RGBA to HSVA.
 * @param {object} rgba Red, green, blue and alpha values.
 * @return {object} Hue, saturation, value and alpha values.
 */
export function RGBtoHSV(rgb) {
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
};

//HSV Conversions
/**
 * Convert HSVA to RGBA.
 * @param {object} hsv Hue, saturation, value.
 * @return {object} Red, green, blue and alpha values.
 */
export function HSVtoRGB(hsv) {
	const {h, s, v} = hsv;
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


	return {
		r: Math.round(red * 255),
		g: Math.round(green * 255),
		b: Math.round(blue * 255),
	};
};

/**
 * Convert HSVA to HSLA.
 * @param {object} hsva Hue, saturation, value and alpha values.
 * @return {object} Hue, saturation, lightness and alpha values.
 */
export function HSVtoHSL(hsv) {
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
};

export function HSVtoHEX(hsv) {
    const rgb = HSVtoRGB(hsv);
	console.log(rgb);
    return RGBtoHEX(rgb);
};

//HSL Conversions
export function HSLtoRGB(hsl) {
    const hsv = HSLtoHSV(hsl);
    return HSVtoRGB(hsv);
};

export function HSLtoHSV(hsl) {
    const value = hsl.l + hsl.s * Math.min(hsl.l, 1-hsl.l);
	return{
		h: hsl.h,
		s: (value === 0) ? 0 : 2*(1- hsl.l/value),
		v: value,
	};
};

export function HSLtoHEX(hsl){
    const rgb = HSLtoRGB(hsl);
    return RGBtoHEX(rgb);
};


//HEX Conversions

export function HEXtoRGB(hex: string) {
    if(isHex(hex)) {
		const values = hex.match(/\w\w/g);
		const [r, g, b] = values.map((k)=>parseInt(k,16));
		return {r, g, b};
	}
	//Add code if isSHorthex like #fff or fff
};

export function HEXtoHSV(hex) {
    const rgb = HEXtoRGB(hex);
    return RGBtoHSV(rgb);
};

export function HEXtoHSL(hex) {
    const rgb = HEXtoRGB(hex);
    return RGBtoHSV(rgb);    
};




//Support Functions



function isHex(val){
	return /^#([A-Fa-f0-9]{6})|([A-Fa-f0-9]{6})/.test(val);
}

function isShortHex(val){
	return /^#([A-Fa-f0-9]{3})|([A-Fa-f0-9]{3})/.test(val);
}