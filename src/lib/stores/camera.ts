import { writable } from "svelte/store";
import {get} from 'svelte/store';
import { highlightFidget } from "$lib/stores/material";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import type { Camera, Object3D } from "three";


/** {@link orbit} - See {@link https://threejs.org/docs/#examples/en/controls/OrbitControls threejs OrbitControls}*/
export const orbit = writable<OrbitControls>();

/** Each position in the scene is tied to a camera position. This index tracks which position is in use*/
const cameraIndex = writable(0);
/** A collection of Camera Position objects where the camera can be moved to  */
const cameraPositions = writable<Object3D[]>([]);
/** A collection of Position objects where the camera will point to when moved  */
const focalPositions = writable<Object3D[]>([]);

export const camera = function(){
  /**The Camera used in this threeJS scene */
  const cameraStore = writable<Camera>();

  /** Assigns camera, locations where the camera can move, and locations where the camera can point.
   *  
   * Can only be performed once */
  const init = (cam: Camera, cams: Object3D[], focals: Object3D[])=>{
    cameraStore.set(cam);
    cameraPositions.set(cams);
    focalPositions.set(focals);
  };


/**
 * Accesses camera position locations at {@link newInd} and updates camera and orbit controls with new values.
 * 
 * @shortcircuits-if
 * - {@link newInd} === current index
 * - a camera reference or focal reference at newInd does not exist
 * @param newInd 
 * @void Updates {@link cameraStore camera} and {@link orbit} controls if valid values are available
 */
  const moveCamera = (newInd:number)=>{
    if(newInd === get(cameraIndex)) return;
    const newCamPosition = get(cameraPositions)[newInd]?.position;
    console.log(get(cameraPositions));
    const newFocal = get(focalPositions)[newInd];
    const {name: newFocalName, position:newFocPosition} = newFocal; 

    if(!newCamPosition || !newFocPosition) return;
    const cam = get(cameraStore);
    cam?.position?.copy(newCamPosition);
    const orb = get(orbit);
    orb?.target?.copy(newFocPosition);
    //Forces new camera position to maintain current zoom,must be done before orbit update
    zoom.setFromValue(get(zoom)); 
    orb.update();
    highlightFidget(newFocalName);
    cameraIndex.set(newInd);
  }

  /**
   * Calculates the new camera index from diff.
   * @param diff How far to move the index. 
   * 
   * - Positive numbers move index forward
   * - Negative numbers move index backward 
   * - 0 returns current index
   * @returns the new calculated index
   */
  const traverseCameraIndex=(diff:number) =>{
     if(diff === 0) return get(cameraIndex);
     const max = get(cameraPositions).length-1 || 0;
     //No point traversing if less than two items exist
     if(max < 1) return get(cameraIndex);
     let newInd = get(cameraIndex) + diff;
     if(newInd < 0) newInd = max;
     if(newInd > max) newInd = 0;
     return newInd;
  }
  /** Advances to the next camera position or to index 0 if advanced beyond max */
  const next = ()=> moveCamera(traverseCameraIndex(1));
  /** Regresses to the prev camera position or to index {@link max} if regressed beyond 0 */
  const prev = ()=> moveCamera(traverseCameraIndex(-1));
  // const next = ()=> traverseCamera('next');
  // const prev = ()=> traverseCamera('prev');
  return {subscribe: cameraStore.subscribe, init, next, prev};

}();


/**
 * {@link zoom} - a writable number store 
 * 
 * indicates percent zoom the camera is aligned to.
 * Values can be 0 <-> 100
 * 
 * inner variable {@link limit} documents the max and min zoom allowable in terms of threeJS LERP interpolation
 * 
 * Can be set from a numeric value 0 <-> 100 or from changes in an orbitcontrols instance
 * 
 * can be enabled or disabled. Will not change if disabled
 */
export const zoom = function(){
const {subscribe, set} = writable(0);
/**The maximum and minimum magnification we will allow. 
 * 
 * See {@link https://threejs.org/docs/#api/en/math/Vector3.distanceTo Vector3 distanceTo}, 
 * {@link https://threejs.org/docs/#api/en/math/Vector3.lerpVectors Vector3 lerpVectores} */
const limit = {max: 10, min:5};

/** 
 * Lock or unlock the ability for the orbit controls to zoom in or out
 */
const setZoomEnabled = (bool:boolean) => get(orbit).enableZoom = bool;
/** Enables zoom to be changed and for orbitControls and cameraControls to respond to changes*/
const enable  = ()=> setZoomEnabled(true);
/** Disables zoom changes, orbitControls and cameraControls will not change zoom*/
const disable = ()=> setZoomEnabled(false);

/**
 * Given a zoom value, update the camera with LERPed vectors between the camera and the current focal point stores.
 * @param val 
 * @shortcircuits-if
 * - val <= 0
 * - camera or focal point store objects do not exist
 * @void updates the camera and sets the zoom value to the store
 */
function setFromValue(val: number){
    if(val<=0) return;
    const cam = get(camera);
    const focal = get(focalPositions)[get(cameraIndex)]?.position;
    if(!cam || !focal) return;
    set(val);
    /**threeJS accepts values 0<=>1. See {@link https://threejs.org/docs/#api/en/math/Vector3.lerpVectors Vector3 lerpVectores}*/ 
    val /=100; 
    const currentDistance = cam.position.distanceTo(focal);
    const desiredMovement = limit.max - limit.min * val;
    const travelDistance = desiredMovement / currentDistance;
    cam.position.lerpVectors(focal, cam.position, travelDistance);
}
/**
 * Retrieves distance from orbit controls and converts into value to store in zoom store
 * @void updates the store with the calculated value
 */
function setFromOrbit(){
    let val = get(camera).position.distanceTo(get(focalPositions)[get(cameraIndex)]?.position);
    val = ((val - limit.min) / limit.min) * 100;
    const result = 100 - val;
    if(result > 0) set(result);
}

return {subscribe, limit, setFromValue, setFromOrbit, enable, disable}

}();