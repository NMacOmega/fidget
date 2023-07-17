import { writable, derived, get } from "svelte/store";
import { readableWithInit } from "./customStores";
import { colorStore } from "./colorStore";

export const selectedUUID = writable('');
export const sceneObjects = readableWithInit({});

export const selectedObject = derived(
    selectedUUID, ($newUUID)=> get(sceneObjects)[$newUUID]
    ); 


export const activeMaterial = function(){
    const {subscribe} = derived( selectedUUID, ($UUID)=> updateMaterialFromUUID($UUID));

    function updateMaterialFromUUID($newUUID){
        const oldValue = get(activeMaterial);
        const objects = get(sceneObjects);
        if($newUUID.length < 0 
            || !objects[$newUUID] 
            || !(objects[$newUUID].material)) 
            return oldValue;
        objects[$newUUID].material.transparent = true;
        const {metalness:m, roughness:r, opacity:o, color:c} = objects[$newUUID].material;
        colorStore.setDirectFromHexValue('#'+c.getHexString());
        metalness.setDirect(m);
        opacity.setDirect(o);
        roughness.setDirect(r);
        return objects[$newUUID].material;
    }

    function setMetalness (v, callback) {
        const material = get(activeMaterial);
        if(!material) return;
        material.metalness = v;
        return callback(v);
    }

    function setRoughness (v, callback) {
        const material = get(activeMaterial);
        if(!material) return;
        material.roughness = v;
        return callback(v);
    }

    function setOpacity (v, callback) {
        const material = get(activeMaterial);
        if(!material) return;
        material.opacity = v;
        return callback(v);
    }

    function setColorFromHex (hex, callback) {
        const material = get(activeMaterial);
        if(!material) return;
        material.color.setHex(hex);
        return callback(hex);
    }

    function setColorFromHSL (h=1, s=1, l=1, callback) {
        const material = get(activeMaterial);
        if(!material) return;
        material.color.setHSL(h/360, s/100, l/100); //ThreeJS requres values between 1 and 0
        return callback({h,s,l});
    }
    return {subscribe, setMetalness, setRoughness, setOpacity, setColorFromHex, setColorFromHSL};
}();

//Material Properties

export const opacity = function(){
    const {subscribe, set:setDirect} = writable(1);
    const set = (v)=> activeMaterial.setOpacity(v, setDirect);
    return {subscribe, set, setDirect};
}();

export const metalness = function(){
    const {subscribe, set:setDirect} = writable(1);
    const set = (v)=> activeMaterial.setMetalness(v, setDirect);
    return {subscribe, set, setDirect};
}();

export const roughness = function(){
    const {subscribe, set:setDirect} = writable(1);
    const set = (v)=> activeMaterial.setRoughness(v, setDirect);
    return {subscribe, set, setDirect};
}();

export const glossiness = function(){
    const {subscribe} = derived(roughness, ($r)=>1-$r);
    const set = (v)=>{
        const newRoughness = 1 - v;
        roughness.set(newRoughness);
    }
    return {subscribe, set};
}();





//Supporting Functions
  

  
