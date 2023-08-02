import { derived, readable, writable } from "svelte/store";
import { readableWithInit } from "./customStores";
import * as cameraStores from './cameraStores';
import * as materialStores from './materialStores';
import {get} from 'svelte/store';

interface PickPosition {
    x: number,
    y: number
  }

export const {camera, orbit, zoom} = cameraStores;

export const {selectedUUID, sceneObjects, sceneHighlights,
  opacity, roughness, glossiness, metalness,
  hsl, hsv, rgb, hex,
} = materialStores;


export const isMouseDown = writable(false);
export const currentFidgetName = writable(''); 
export const pickPosition = writable({});
export const currentColorDragCoordinates = writable();
//Maybe mark the location and do a derived
//Marker shoudl also follow what text input says

export const canvas = writable();
export const scene = readableWithInit({});

export const animations = readableWithInit({
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


export const availableAnimations = derived([currentFidgetName, animations],
  ([$name, $animations])=> Object.values($animations[$name]||{}) || []);

export const isAnimationsAvailable = derived(availableAnimations, ($anims)=>$anims.length > 0);


export const interactions = readable(
      {
      joystick: {
          rotation: {
            min: 10,
            max: 10,
          },
        }    
    });

export const highlightFidget = (focusPoint: string) => {
  const threeScene = get(scene);
  const uuid = get(sceneHighlights)[focusPoint];
  if(uuid) selectedUUID.set(uuid);

  const focusObjectInScene = threeScene.getObjectByProperty("name", focusPoint);
  if (!focusObjectInScene) { 
    console.log("No Focus point found for fidget ", focusPoint); 
    return;
  } 

  const objects = get(sceneObjects);
  let fidgetName = ''; 
  
  Object.entries(objects).forEach(([_, obj]) => {
      const tag = obj.userData.focus || undefined;
      const fidgetGroup = obj.userData.group || undefined;
      
      if(tag === focusPoint && fidgetGroup) {
        obj.visible = true;   
        fidgetName = fidgetGroup;
      }
      else obj.visible = false;
    });
    currentFidgetName.set(fidgetName);
}





  
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