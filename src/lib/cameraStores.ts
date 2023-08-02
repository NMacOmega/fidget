import { writable, derived } from "svelte/store";
import {get} from 'svelte/store';
import { highlightFidget } from "./stores";

export const orbit = writable({});

const index = writable(0);
const cameraPositions = writable([]);
const focalPositions = writable([]);

const length = derived(cameraPositions, ($c)=>$c.length-1 || 0);
const currentCameraPosition = derived([index, cameraPositions], ([$i, $c])=> $c[$i].position);
const currentFocalPosition = derived([index, focalPositions], ([$i, $f])=> $f[$i].position);
const currentFocalName = derived([index, focalPositions], ([$i, $f])=> $f[$i].name);


export const camera = function(){
  const cameraStore = writable({});

  const init = (cam, cams, focals)=>{
    cameraStore.set(cam);
    cameraPositions.set(cams);
    focalPositions.set(focals);
  };

  const traverse = (dir: 'next' | 'prev')=>{
    const next = dir === 'next';
    const prev = !next;
    let i = get(index);
    const max = get(length);
    if(next) i = i >= max ? 0 : i+1;
    if(prev) i = i <= 0 ? max : i-1;
    index.set(i);
    get(cameraStore)?.position?.copy(get(currentCameraPosition));
    const newFocalPos = get(currentFocalPosition);
    if(newFocalPos){
      const orb = get(orbit);
      orb?.target?.copy(newFocalPos);
      
      //Forces new camera position to maintain current zoom,must be done before orbit update
      zoom.setFromSlider(get(zoom)); 
      orb.update();
      highlightFidget(get(currentFocalName));
    }
  };

  const next = ()=> traverse('next');
  const prev = ()=> traverse('prev');
  return {subscribe: cameraStore.subscribe, init, next, prev};

}();

  
export const zoom = function(){
const {subscribe, set} = writable(0);
const limit = {max: 10, min:5};

function enable(){
  get(orbit).zoomEnabled = true;
}

function disable(){
  get(orbit).zoomEnabled = false;
}

function setFromSlider(val){
    if(val<=0) return;
    set(val);
    val /=100;
    const cam = get(camera);
    const focal = get(currentFocalPosition);
    const currentDistance = cam.position.distanceTo(focal);
    const desiredMovement = limit.max - limit.min * val;
    const travelDistance = desiredMovement / currentDistance;
    cam.position.lerpVectors(focal, cam.position, travelDistance);
}

function setFromOrbit(){
    let val = get(camera).position.distanceTo(get(currentFocalPosition));
    val = ((val - limit.min) / limit.min) * 100;
    const result = 100 - val;
    if(result > 0) set(result);
}

return {subscribe, limit, setFromSlider, setFromOrbit, enable, disable}

}();