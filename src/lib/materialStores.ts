import { writable, derived, get } from "svelte/store";
import { readableWithInit } from "./customStores";
import { parseColor} from "./colorFunctions";

export const sceneObjects = readableWithInit({});
export const sceneHighlights = readableWithInit({});

function getObjectWithMaterial(UUID){
    const currObject = get(sceneObjects)[UUID];
    const currMaterial = currObject?.material;
    return {
        object: currObject,
        material: currMaterial
    }
}

export const selectedUUID = function(){
    const {subscribe, set:setDirect} = writable('');

    function set (newUUID: string){
        const{object, material} = getObjectWithMaterial(newUUID);
        //We have a new object. Need rotation, etc...
        material.transparent = true; //Needed to enable opacity setting

        const {metalness:m, roughness:r, opacity:o, color:c} = material;
        color.setDirect('#'+c.getHexString());
        opacityStore.setDirect(o);
        metalnessStore.setDirect(m);
        roughnessStore.setDirect(r);
        setDirect(newUUID);
    }
    return {subscribe, set};
}();



const createMaterialPropertyStore = (initValue, updateMaterialFunction) => {
    const {subscribe, set:setDirect} = writable(initValue);
    const set = (v)=> {
        const {material} = getObjectWithMaterial(get(selectedUUID));
        if(!material) return;
        updateMaterialFunction(material, v);
        setDirect(v);
    };
    return {subscribe, set, setDirect};
}

const opacityStore = createMaterialPropertyStore(1, (material, v)=>material.opacity=v);
const metalnessStore = createMaterialPropertyStore(1, (material, v)=>material.metalness=v);
const roughnessStore = createMaterialPropertyStore(1, (material, v)=>material.roughness=v);

/*Hiding setDirect functions from client components*/
export const opacity = {subscribe:opacityStore.subscribe, set: opacityStore.set};
export const metalness = {subscribe:metalnessStore.subscribe, set: metalnessStore.set};
export const roughness = {subscribe:roughnessStore.subscribe, set: roughnessStore.set};

export const glossiness = function(){
    const {subscribe} = derived(roughness, ($r)=>1-$r);
    const set = (v)=>{
        const newRoughness = 1 - v;
        roughness.set(newRoughness);
    }
    return {subscribe, set};
}();

//Color Stores

const color = function(){                                                                   
    const {subscribe, set:_set} = writable({
        hsv: {h:0, s: 0, v:0},
        hex: '',
        hsl: {h: 0, s: 0, l: 0},
        rgb: {r: 0, g: 0, b: 0}});

    const set = (value)=>{
        const newColor = parseColor(value);
        if(!newColor) return;
        let {h, s, l} = newColor.hsl;
        if(!h || !s || !l) return;
        // console.log('Value ',value,' --> updating Color to: ', newColor);
        h /= 360;
        const {material} = getObjectWithMaterial(get(selectedUUID));
        if(!material) return;
        updateMaterialHSL(material, h, s, l);
        _set(newColor);
    };

    const setDirect = (value)=>{
        const newColor = parseColor(value);
        console.log('Value ',value,' --> updating Color to: ', newColor);
        if(newColor) _set(newColor);
    };

    const updateMaterialHSL = (material, h, s, l)=>{
        material.color.setHSL(h,s,l);
    }

    return {subscribe, set, setDirect};
}();

export const hsv = function(){
    const {subscribe} = derived(color, ($color)=>$color.hsv);
    return {subscribe, set: color.set};
}();

export const rgb = function(){
    const {subscribe} = derived(color, ($color)=>$color.rgb);
    return {subscribe, set: color.set};
}();

export const hsl = function(){
    const {subscribe} = derived(color, ($color)=>$color.hsl);
    return {subscribe, set: color.set};
}();

export const hex = function(){
    const {subscribe} = derived(color, ($color)=>$color.hex);
    return {subscribe, set: color.set};
}();


//Supporting Functions
  



