
import {get} from 'svelte/store';
import { batchGet } from '$lib/stores';
import { cameraStore, orbitStore, currentCameraIndexStore, cameraReferencesStore } from '$lib/stores';
import { highlightFidget } from "$lib/ThreeJsScene/ThreeJsScene";

export function changeCameraFocus(d: "next" | "prev") {

  const [camera, orbit] = 
  batchGet([cameraStore, orbitStore]);

  d === 'next' && currentCameraIndexStore.next();
  d === 'prev' && currentCameraIndexStore.previous();

  const {camera: newCam, focalPoint: newFocal} = get(cameraReferencesStore);

  camera.position.copy(newCam?.position);

  if(newFocal){
    orbit.target.copy(newFocal?.position);
    highlightFidget(newFocal?.name);
  }
  }


  