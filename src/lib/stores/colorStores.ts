import { writable, derived } from "svelte/store";
import { Color } from "$lib/colorFunctions";
import type { HEXColor, rgbNumberType, percentNumberType, HueNumberType } from "$lib/colorFunctions";
//Import material store in order to edit the object


export const colorStore = (function(){
	const {subscribe, update} = writable({...new Color()});
	const set = (newColor: Color)=>{
		if(newColor instanceof Color && newColor.isValidColor){
			update((curr)=>{
				if (curr?.hex !== newColor.hex) {
					updateMaterial(newColor.hex);
					return {...newColor};}
			}); 
		}
	}
	const updateMaterial = (hexColor: HEXColor)=> {
		//updateMaterial
	}
	return {subscribe, set};
})();


export const hex = (function(){
	const {subscribe} = derived(colorStore, (color)=>color.hex);
	return {subscribe, set:setHex};
})();

function setHex  (hex: HEXColor){
	try{
		const newColor = new Color(hex);
		if(newColor?.isValidColor) colorStore.set({...newColor});
		else throw new Error('Failed to parse Hex Value.');
	}
	catch(e){
		console.log(e);
	}
}

export const rgb = (function(){
	const {subscribe} = derived(colorStore, (color)=>color.rgb);
	return {subscribe, set:setRGB};
})();

function setRGB  (r:rgbNumberType, g:rgbNumberType, b:rgbNumberType){
	try{
		const newColor = new Color({r, g, b});
		if(newColor?.isValidColor) colorStore.set({...newColor});
		else throw new Error('Failed to parse RGB Value.');
	}
	catch(e){
		console.log(e);
	}
}

export const hsl = (function(){
	const {subscribe} = derived(colorStore, (color)=>color.hsl);
	return {subscribe, set:setHSL};
})();

function setHSL  (h:HueNumberType, s:percentNumberType, l:percentNumberType){
	try{
		const newColor = new Color({h, s, l});
		if(newColor?.isValidColor) colorStore.set({...newColor});
		else throw new Error('Failed to parse HSL Value.');
	}
	catch(e){
		console.log(e);
	}
}

export const hsv = (function(){
	const {subscribe} = derived(colorStore, (color)=>color.hsv);
	return {subscribe, set:setHSV};
})();

function setHSV  (h:HueNumberType, s:percentNumberType, v:percentNumberType){
	try{
		const newColor = new Color({h, s, v});
		if(newColor?.isValidColor) colorStore.set({...newColor});
		else throw new Error('Failed to parse HSV Value.');
	}
	catch(e){
		console.log(e);
	}
}