import { writable, derived } from "svelte/store";
import { readableWithInit, traversableNumber } from "./customStores";
import {get} from 'svelte/store';

export const cameraStore = readableWithInit({});
export const orbitStore = readableWithInit({});
export const cameraPositionsStore = readableWithInit([]);
export const focalPositionsStore = readableWithInit([]);

const numCameras = derived(cameraPositionsStore, 
  $camerasArray => $camerasArray.length || 0
);

export const currentCameraIndexStore = traversableNumber(0, numCameras);


export const cameraReferencesStore = function(){
  const getRefs =($idx)=>{  
    const currentCam = get(cameraPositionsStore)[$idx];
    const currentFocal = get(focalPositionsStore)[$idx];
    return{
      camera: {
        position: currentCam?.position
      },
      focalPoint: {
        position: currentFocal?.position,
        name: currentFocal?.name
      }
    }
  }
  return derived(currentCameraIndexStore, $idx=>getRefs($idx));
}();


export const zoomEnabledStore = function(){
const {subscribe, update} = writable(true);

const setVal=(n)=>{
    get(orbitStore).zoomEnabled = n;
    return n;
}

return{
    subscribe,
    set: ()=> update((n)=>setVal(n)),
}
}();
  
export const zoomStore = function(){

const {subscribe, set} = writable(0);

const limit = {max: 10, min:5}

function setFromSlider(val){
    if(val<=0) return;
    set(val);
    val /=100;
    const camera = get(cameraStore);
    const {focalPoint: {position: focalPos}} = get(cameraReferencesStore);
    
    const currentDistance = camera.position.distanceTo(focalPos);
    const desiredMovement = limit.max - limit.min * val;
    const travelDistance = desiredMovement / currentDistance;
    camera.position.lerpVectors(focalPos, camera.position, travelDistance);

}

function setFromOrbit(){
    const camera = get(cameraStore);
    const {focalPoint: {position: focalPos}} = get(cameraReferencesStore);
    
    let val = camera.position.distanceTo(focalPos);
    val = ((val - limit.min) / limit.min) * 100;
    const result = 100 - val;
    if(result > 0) set(result);
}

return {subscribe, limit, setFromSlider, setFromOrbit}

}();







  
