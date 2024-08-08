import { writable, derived } from "svelte/store";
import { Color } from "$lib/colorFunctions";
import type { HEXColor, rgbNumberType, percentNumberType, HueNumberType } from "$lib/colorFunctions";
import { _updateMaterialColorFromColorStore } from "./material";
// import getObjec
//Import material store in order to edit the object


export const colorStore = (function(){
	const {subscribe, update} = writable(new Color());
	/** Sets color of the colorstore when a new material is chosen. Used to avoid color loops */
	const _setFromNewMaterial = (hexColor:HEXColor)=>{
		const newColor = new Color(hexColor);
		if(newColor?.hex && newColor.isValidColor)
			update((curr)=>{
				if(curr.hex !== newColor.hex){
					return newColor;
				}
				else return curr;
			})
		}
		const set = (newColor: Color)=>{
			if(newColor?.hex && newColor?.isValidColor)
				{
					update((curr)=>{
					if(curr.hex!== newColor.hex){
						_updateMaterialColorFromColorStore(newColor.hex);
					return newColor;
				}
				else return curr;
			})
		}

	}
	return {subscribe, set, _setFromNewMaterial};
})();


export const hex = (function(){
	const {subscribe} = derived(colorStore, (color)=>color.hex);
	return {subscribe, set:setHex};
})();

function setHex  (hex: HEXColor){
	try{
		const newColor = new Color(hex);
		if(newColor.isValidColor) colorStore.set(newColor);
		else throw new Error(`Failed to parse Hex Value: \n ${hex}. \nStore not updated.`);
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
		if(newColor?.isValidColor) colorStore.set(newColor);
		else throw new Error(`Failed to parse RGB Value: \n R:${r}. G:${g}, B:${b}. \nStore not updated.`);
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
		if(newColor?.isValidColor) colorStore.set(newColor);
		else throw new Error(`Failed to parse HSL Value: \n H:${h}. S:${s}, L:${l}. \nStore not updated.`);
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
		if(newColor?.isValidColor) colorStore.set(newColor);
		else throw new Error(`Failed to parse HSV Value: \n H:${h}. S:${s}, V:${v}. \nStore not updated.`);
	}
	catch(e){
		console.log(e);
	}
}