type numberParams = [number, number, number, boolean] | [number, number ,number];


export function parseColor(value){
   if(!value) return undefined;
//    console.log(value);

   const hsv = parseHSV(value);
   if(hsv) {
	   const rgb = HSVtoRGB(hsv.h, hsv.s, hsv.v);
	return {
		hsv, 
		hsl: HSVtoHSL(hsv.h, hsv.s, hsv.v),
		rgb,
		hex: RGBtoHEX(rgb.r, rgb.g, rgb.b)
	};}
   
   const hsl = parseHSL(value);
   if(hsl) {
	console.log('HSL: ',hsl.h, hsl.s, hsl.l);
	const hsv = HSLtoHSV(hsl.h, hsl.s, hsl.l);
	const rgb = HSVtoRGB(hsv.h, hsv.s, hsv.v);
	return {
		hsv, 
		hsl, 
		rgb,
		hex: RGBtoHEX(rgb.r, rgb.g, rgb.b)
	}};

	const rgb = parseRGB(value);
	if(rgb) {
		const hsv = RGBtoHSV(rgb.r, rgb.g, rgb.b);
		return {
			hsv, 
			hsl: HSVtoHSL(hsv.h, hsv.s, hsv.v),
			rgb,
			hex: RGBtoHEX(rgb.r, rgb.g, rgb.b)
		}};

	 const hex = parseHEX(value);
	 if(hex) {
		const rgb = HEXtoRGB(hex);
		const hsv = RGBtoHSV(rgb.r, rgb.g, rgb.b);
		return {
			hsv,  
			hsl: HSVtoHSL(hsv.h, hsv.s, hsv.v),
			rgb,
			hex
		}};
   }


//Paerser FUNCTIONS
function parseHSL(val){
 if(typeof val === 'string'){

 }

const {h: hue, s: saturation, l: luminosity} = val;
const [h, s, l] = parseMultiValue([
	[hue, 360, 0],
	[saturation, 1, 0, true],
	[luminosity, 1, 0, true]]);
 if(typeof(h) === 'number' 
 && typeof(s) === 'number' 
 && typeof(l) === 'number') return {h, s, l};
}

export function parseHEX(val){
	let hex = '';
	if(typeof(val) === 'number') hex = val.toString(16);
	if(typeof(val) === 'string') hex = val;
	hex = (hex.match(/[\dA-Fa-f]/g) || []).join("");
	if(hex.length === 3) hex = `${hex}${hex}`;
	if(hex.length !== 6) return;
	hex = hex.toUpperCase();
	return hex;
}


function parseHSV(val){
	if(typeof val === 'string'){

	}
   
   const {h: hue, s: saturation, v: value} = val;
   const [h, s, v] = parseMultiValue([
	   [hue, 360, 0],
	   [saturation, 1, 0, true],
	   [value, 1, 0, true]]);
   
	if(typeof(h) === 'number' 
	&& typeof(s) === 'number' 
	&& typeof(v) === 'number') return {h, s, v};
   }

   function parseRGB(val){
	if(typeof val === 'string'){

	}
   
   const {r: red, g:green, b:blue} = val;
   const [r, g, b] = parseMultiValue([
	   [red, 255, 0],
	   [green, 255, 0],
	   [blue, 255, 0]]);
   
	if(typeof(r) === 'number' 
	&& typeof(g) === 'number' 
	&& typeof(b) === 'number') return {r, g, b};
   }
//////////////////////////////////////////////////////////////
//CONVERSION FUNCTIONS

/**
 * Convert RGBA to HSV.
 * @param {object} rgb Red, green, and blue values.
 * @return {object} Hue, saturation, value values.
 */
function RGBtoHSV(r, g, b) {
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
	return {
		h: hue < 0 ? hue + 360 : hue,
		s: parseFloat(saturation.toFixed(3)),
		v: parseFloat(value.toFixed(3))
	};
};


/**
 * Convert HSL to HSV.
 * @param {object} rgb Hue, saturation, and lightness values.
 * @return {object} Hue, saturation, value values.
 */
function HSLtoHSV(h, s, l) {
    const value = l + s * Math.min(l, 1-l);
	return{
		h,
		s: (value === 0) ? 0 : 2*(1- l/value),
		v: value,
	};
};


/**
 * Convert HSVA to RGBA.
 * @param {object} hsv Hue, saturation, value.
 * @return {object} Red, green, blue and alpha values.
 */
function HSVtoRGB(h, s, v) {
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
function HSVtoHSL(h, s, v) {
	const lightness = Math.min(1, Math.max(0, (v * (1 - s / 2))));
	const saturation = ((v - lightness) / Math.min(lightness, 1 - lightness));
	return {
		h,
		s: parseFloat(saturation.toFixed(3)),
		l: parseFloat(lightness.toFixed(3)),
	};
};




function HEXtoRGB(hex: string) {
	const values = hex.replaceAll('#', '').match(/\w\w/g);
    const [r, g, b] = values.map((k)=>parseInt(k,16));
	return {r, g, b};
	//Add code if isSHorthex like #fff or fff
};


/**
 * Convert RGBA to Hex.
 * @param {object} rgba Red, green, blue and alpha values.
 * @return {string} Hex color string.
 */
function RGBtoHEX(r, g, b) {
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
};



//--------------------------------------------
//Utility Functions
function parseMultiValue(paramsArray: numberParams[]){
	const results: Array<number | undefined> = [];

	paramsArray.forEach(([val, max, min, isPercent=false])=>{
		if(typeof val !== 'number') results.push(undefined);
		else{
			if(isPercent && val > 1) val /= 100;
			if(typeof(max) === 'number' && val > max) val = max;
			if(typeof(min) === 'number' && val < min) val = min;
			results.push(val);
		}
	});
	return results;


}



// Nice Idea Functions

// /**
//  * Update the color marker's accessibility label.
//  * @param {number} saturation
//  * @param {number} value
//  */
// function updateMarkerA11yLabel(saturation, value) {
// 	let label = settings.a11y.marker;

// 	saturation = saturation.toFixed(1) * 1;
// 	value = value.toFixed(1) * 1;
// 	label = label.replace('{s}', saturation);
// 	label = label.replace('{v}', value);
// 	colorMarker.setAttribute('aria-label', label);
// }

// /**
//  * Move the color marker when the arrow keys are pressed.
//  * @param {number} offsetX The horizontal amount to move.
//  * @param {number} offsetY The vertical amount to move.
//  */
// function moveMarkerOnKeydown(offsetX, offsetY) {
// 	let x = colorMarker.style.left.replace('px', '') * 1 + offsetX;
// 	let y = colorMarker.style.top.replace('px', '') * 1 + offsetY;

// 	setMarkerPosition(x, y);
// }