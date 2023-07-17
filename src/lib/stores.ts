import { derived, readable, readonly, writable } from "svelte/store";
import { readableWithInit, traversableNumber } from "./customStores";
import * as cameraStores from './cameraStores';
import * as materialStores from './materialStores';
import * as colorStores from './colorStore';
import {get} from 'svelte/store';

interface PickPosition {
    x: number,
    y: number
  }

export const {cameraPositionsStore, cameraReferencesStore, cameraStore, currentCameraIndexStore, 
  focalPositionsStore, orbitStore, zoomEnabledStore, zoomStore
} = cameraStores;


export const {selectedUUID, sceneObjects, selectedObject, activeMaterial, 
  opacity, roughness, glossiness, metalness
} = materialStores;

export const {hsl, hsv, hex, rgb
} = colorStores;

export const isMouseDownStore = writable(false);
export const currentFidgetNameStore = writable(''); 
export const pickPositionStore = writable({});
export const currentColorDragCoordinates = writable();
//Maybe mark the location and do a derived
//Marker shoudl also follow what text input says

export const canvasStore = writable();
export const sceneStore = readableWithInit({});

export const animationsStore = readableWithInit({
  sphere: {
    spin: {},
  },
  discs: {
    spinDiscA: {},
    spinDiscB: {},
    spinDiscC: {},
    spinDiscD: {},
  },
});


export const availableAnimations = derived([currentFidgetNameStore, animationsStore],
  ([$name, $animations])=> Object.values($animations[$name]||{}) || []);

export const isAnimationsAvailable = derived(availableAnimations, ($anims)=>$anims.length > 0);


export const sceneInteractionsStore = readable(
      {
      joystick: {
          rotation: {
            min: 10,
            max: 10,
          },
        }
      
    });





  
//     sceneInteractionsList: {},
  
//     zoomLimit: { max: 10, min: 5 },
  
//     draggableElements: {
//       "#colorMenuDraggable": {
//         handle: "#dragHandleColor",
//         origin: {
//           top: "80px",
//           left: "110px",
//         },
//       },
//       "#materialsMenuDraggable": {
//         handle: "#dragHandleMaterial",
//         origin: {
//           top: "150px",
//           left: "100px",
//         },
//       },
//       "#zoomMenuDraggable": {
//         handle: "#dragHandleZoom",
//         origin: {
//           top: "90%",
//           left: "60%",
//         },
//       },
//       }
  
  
//   };
  
  
export function batchGet(storesArr){
  return storesArr.reduce((acc, store)=>{
    const result = get(store);
    return [...acc, result];
  }, []);
}