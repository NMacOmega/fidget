import { writable, derived, get } from "svelte/store";
import { createColorStore } from "./colorStore";
import { readableWithInit } from "./customStores";

export const selectedUUIDStore = writable('');
export const sceneObjectsStore = readableWithInit({});

export const selectedObjectStore = derived(
    selectedUUIDStore, ($newUUID)=> get(sceneObjectsStore)[$newUUID]
    );



  

  
  
  export const colorStore = function(){
    const {subscribe, set:setVal, parseColor} = createColorStore('#ffffff');
    
    const set = (val)=> {
    const color = parseColor(val);
    if(!(color?.hex)) return;
    setVal({...color});
    }
    const setMaterial = (val) => {
      const color = parseColor(val);
      if(!(color?.hex)) return;
      const activeMaterial = get(activeMaterialStore);
      if(activeMaterial === undefined) return;
      activeMaterial.color.set(color.hex);
      setVal({...color});
    }
    return { subscribe, set, setMaterial};
  }();


  
  
  export const opacityStore = function(){
    const {subscribe, set} = writable(1);
    const setMaterial = (val) => {
      if(!val) return;
      if(val > 1) val /=100;
      if(val > 1) val = 1;
      if(val < 0) val = 0;
      const activeMaterial = get(activeMaterialStore);
      if(activeMaterial === undefined) return;
      activeMaterial.opacity = val;
      set(val);
    }
    return {subscribe, set, setMaterial};
  }();
  
  export const metalnessStore = function(){
    const {subscribe, set} = writable(1);
    const setMaterial = (val) => {
      if(!val) return;
      if(val > 1) val /=100;
      if(val > 1) val = 1;
      if(val < 0) val = 0;
      const activeMaterial = get(activeMaterialStore);
      if(activeMaterial === undefined) return;
      activeMaterial.metalness = val;
      set(val);
    }
    return {subscribe, set, setMaterial};
  }();
  
  export const roughnessStore = function(){
    const {subscribe, set} = writable(1);
    const setMaterial = (val) => {
      if(!val) return;
      if(val > 1) val /=100;
      if(val > 1) val = 1;
      if(val < 0) val = 0;
      const activeMaterial = get(activeMaterialStore);
      if(activeMaterial === undefined) return;
      activeMaterial.roughness = val;
      set(val);
    }
    return {subscribe, set, setMaterial};
  }();


  export const activeMaterialStore = function(){

    const setColor = (hex)=>{
      if(!hex) return;
      objects[$newUUID].material.color.set(hex);
    };
    const setOpacity = (val)=>{
      if(!(typeof val === 'number')) return
      objects[$newUUID].material.opacity = val;
    };
    const setMetalness = (val)=>{
      if(!(typeof val === 'number')) return
      objects[$newUUID].material.metalness = val;
    }
    const setRoughness = (val)=>{
      if(!(typeof val === 'number')) return
      objects[$newUUID].material.roughness = val;
    }

    const getActiveMaterial = ($newUUID)=>{
        const oldValue = get(activeMaterialStore);
        const objects = get(sceneObjectsStore);
        if($newUUID.length < 0 
          || !objects[$newUUID] 
          || !(objects[$newUUID].material)) 
          return oldValue;
        objects[$newUUID].material.transparent = true;
        const {metalness, roughness, opacity, color} = objects[$newUUID].material;
        const hexColor = '#'+color.getHexString();
        metalnessStore.set(metalness);
        roughnessStore.set(roughness);
        opacityStore.set(opacity);
        colorStore.set(hexColor);
        return objects[$newUUID].material;
    }

    const {subscribe} = derived( selectedUUIDStore, ($newUUID)=> getActiveMaterial($newUUID))
    return {subscribe, setColor, setMetalness, setOpacity, setRoughness};
  }();
