import { writable, derived, get } from "svelte/store";
import { activeMaterial } from "./materialStores";
import { parseHSL, HSLtoHEX, HSLtoHSV,  
        parseRGB, RGBtoHEX,  RGBtoHSV, 
        parseHEX,  HEXtoHSV,  
        parseHSV, HSVtoHEX, HSVtoHSL, HSVtoRGB, RGBtoHSL, HEXtoHSL } from "./colorFunctions";

const color = function(){
    const {subscribe, set} = writable({h:0, s:0, v:0});

    //Not type safe, should add type safety
    const setDirectFromHexValue = (h) =>{
        const hex = parseHEX(h);
        const hsv = HEXtoHSV(hex);
        if(!hex || !hsv) return;
        set(hsv);
    }

    const setColor = (hex, hsv, hsl)=>{
        if(!hex || !hsv || !hsl) return;
        const material = get(activeMaterial);
        if(!material) return;
        const {h,s,l} = hsl;
        const result = activeMaterial.setColorFromHSL(h,s,l, (hsl)=> true);
        result && set(hsv);
    }

    const parseColor = (v, parser, convertToHEX, convertToHSV, convertToHSL)=>{
        if(!parser) return;
        const value = parser(v);
        const hex = convertToHEX === null ? value : convertToHEX(value);
        const hsv = convertToHSV === null ? value : convertToHSV(value);
        const hsl = convertToHSL === null ? value : convertToHSL(value);
        console.log(hsv);
        console.log(hex);
        return setColor(hex, hsv, hsl);
    }
    //Setters 
    const setFromHSV =(v)=> parseColor(v, parseHSV, HSVtoHEX, null, HSVtoHSL);
    const setFromRGB =(v)=> parseColor(v, parseRGB, RGBtoHEX, RGBtoHSV, RGBtoHSL);
    const setFromHSL =(v)=> parseColor(v, parseHSL, HSLtoHEX, HSLtoHSV, null);
    const setFromHEX =(v)=> parseColor(v, parseHEX, null, HEXtoHSV, HEXtoHSL);

    return {subscribe, set, setDirectFromHexValue, setFromRGB, setFromHSL, setFromHSV, setFromHEX};
}();

//Needed so color can by set when the active material changes
export const colorStore = {subscribe: color.subscribe, setDirectFromHexValue: color.setDirectFromHexValue};

export const rgb = function (){
    const {subscribe} = derived(color, ($hsv)=>HSVtoRGB($hsv));
    return {subscribe, set: color.setFromRGB};
}();

export const hsv = function (){
    const {subscribe} = derived(color, ($hsv)=>$hsv);
    return {subscribe, set: color.setFromHSV};
}();

export const hsl = function (){
    const {subscribe} = derived(color, ($hsv)=>HSVtoHSL($hsv));
    return {subscribe, set: color.setFromHSL};
}();

export const hex = function (){
    const {subscribe} = derived(color, ($hsv)=>HSVtoHEX($hsv));
    return {subscribe, set: color.setFromHEX};
}();