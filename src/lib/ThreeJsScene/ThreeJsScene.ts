
import {get} from 'svelte/store';
import { getPickPosition, pickObjectFromPosition } from "$lib/ThreeJsScene/ThreeJsPicker";
import {handleRotation}  from "$lib/ThreeJsScene/ThreeJsRotate";
import { selectedUUIDStore, 
  orbitStore, 
  selectedObjectStore, 
  isMouseDownStore, 
  pickPositionStore, 
  sceneStore, 
  sceneObjectsStore, 
  animationsStore, 
  currentFidgetNameStore,
  activeMaterialStore,
  sceneInteractionsStore,
  zoomEnabledStore
} from "$lib/stores";


export const onMouseUp = () => {
    const orbit = get(orbitStore); 
    orbit.enableRotate = true;
    // selectedUUIDStore.set(''); //Causing problems with dragging
    isMouseDownStore.set(false);
  }
  
export const onMouseDown = (event) => {
  // if (displayingHelp) setHelpScreen(false);
  // checkColorPickerLock(event);
  const currentUUID = get(selectedUUIDStore);
    
    const newPickPosition = getPickPosition(event);
    pickPositionStore.set(newPickPosition);
    const pickedObject = pickObjectFromPosition(newPickPosition); 
    const pickedUUID = pickedObject?.uuid;
    if(!pickedUUID) return;
    
    if (pickedUUID !== currentUUID) {
      selectedUUIDStore.set(pickedUUID);

      const sceneInteractionsList = Object.keys(get(sceneInteractionsStore));
      const orbit = get(orbitStore);
      if (sceneInteractionsList.includes(pickedObject.name)) orbit.enableRotate = false;

    }
    // Used to track dragging, do we still want this?
    // let click = getVector(event, true);
    // dragOrigin = { ...click };
    isMouseDownStore.set(true);
    
  }




export const onMouseDrag = (event) => {
  const isMouseDown = get(isMouseDownStore);
  if(!isMouseDown) return;
  const selectedObject = get(selectedObjectStore);
  if(selectedObject?.userData?.limit?.rotation)
    handleRotation(event, selectedObject);
}




export const highlightFidget = (focusPoint: string) => {
  const scene = get(sceneStore);
  
  const focusObjectInScene = scene.getObjectByProperty("name", focusPoint);
  if (!focusObjectInScene) { 
    console.log("No Focus point found for fidget ", focusPoint); 
    return;
  } 

  const sceneObjects = get(sceneObjectsStore);
  let fidgetName = ''; 
  
  Object.entries(sceneObjects).forEach(([_, obj]) => {
      const tag = obj.userData.focus || undefined;
      const fidgetGroup = obj.userData.group || undefined;
      
      if(tag === focusPoint && fidgetGroup) {
        obj.visible = true;   
        fidgetName = fidgetGroup;
      }
      else obj.visible = false;
    });
    currentFidgetNameStore.set(fidgetName);
    //   if (!isMaterialSelected && obj.material) setColorMenu(obj.material);
    // setAnimationButtonActive(currentFidgetHasAnimations);
}
