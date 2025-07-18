import { writable } from "svelte/store";
import {get} from 'svelte/store';

import { fidgetReference, type FidgetCamera, type FidgetFocusPoint } from "$stores/threeJSObjectStores";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import type { Camera, Object3D } from "three";


/** {@link orbit} - See {@link https://threejs.org/docs/#examples/en/controls/OrbitControls threejs OrbitControls}*/
export const orbit = writable<OrbitControls>();


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




  const move = (camera: FidgetCamera, focus: FidgetFocusPoint)=>{
    const cameraPos = get(cameraPositions).filter((c)=>c.userData.name===camera)[0];
    const focalPos = get(focalPositions).filter((c)=>c.userData.name===focus)[0];
    if(!cameraPos.isObject3D || !focalPos.isObject3D) return;
    const cam = get(cameraStore);
    const orb = get(orbit);
    cam.position.copy(cameraPos.position);
    orb.target.copy(focalPos.position);
    //Forces new camera position to maintain current zoom,must be done before orbit update
    zoom.setFromValue(get(zoom))
    orb.update();
  }


  return {subscribe: cameraStore.subscribe, init, cameraPositions, move};

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
    const focal = get(fidgetReference.current).focusPoint;
    const focalPos = get(focalPositions).filter((c)=>c.userData.name===focal)[0];
    if(!cam || !focalPos.isObject3D) return;
    set(val);
    /**threeJS accepts values 0<=>1. See {@link https://threejs.org/docs/#api/en/math/Vector3.lerpVectors Vector3 lerpVectores}*/ 
    val /=100; 
    const currentDistance = cam.position.distanceTo(focalPos.position);
    const desiredMovement = limit.max - limit.min * val;
    const travelDistance = desiredMovement / currentDistance;
    cam.position.lerpVectors(focalPos.position, cam.position, travelDistance);
}
/**
 * Retrieves distance from orbit controls and converts into value to store in zoom store
 * @void updates the store with the calculated value
 */
function setFromOrbit(){
  const focal = get(fidgetReference.current)?.focusPoint;
  const focalPos = get(focalPositions).filter((c)=>c.userData.name===focal)[0];
  if(!focalPos?.isObject3D) return;
    let val = get(camera).position.distanceTo(focalPos?.position);
    val = ((val - limit.min) / limit.min) * 100;
    const result = 100 - val;
    if(result > 0) set(result);
}

return {subscribe, limit, setFromValue, setFromOrbit, enable, disable}

}();