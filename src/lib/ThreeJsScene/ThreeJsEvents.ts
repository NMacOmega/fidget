
import {get} from 'svelte/store';
import { getPickPosition, pickObjectFromPosition } from "$lib/ThreeJsScene/ThreeJsPicker";
import {handleRotation}  from "$lib/ThreeJsScene/ThreeJsRotate";
import { selectedUUID, 
  orbit, 
  isMouseDown, 
  pickPosition, 
  interactions} from "$lib/stores";


export const onMouseUp = () => {
    get(orbit).enableRotate = true;
    // selectedUUID.set(''); //Causing problems with dragging
    isMouseDown.set(false);
  }
  
export const onMouseDown = (event) => {
  // if (displayingHelp) setHelpScreen(false);
  // checkColorPickerLock(event);
  const currentUUID = get(selectedUUID);
    
    const newPickPosition = getPickPosition(event);
    pickPosition.set(newPickPosition);
    const pickedObject = pickObjectFromPosition(newPickPosition); 
    const pickedUUID = pickedObject?.uuid;
    if(!pickedUUID) return;
    
    if (pickedUUID !== currentUUID) {
      selectedUUID.set(pickedUUID);

      const sceneInteractionsList = Object.keys(get(interactions));
      const orbitController = get(orbit);
      if (sceneInteractionsList.includes(pickedObject.name)) orbitController.enableRotate = false;

    }
    // Used to track dragging, do we still want this?
    // let click = getVector(event, true);
    // dragOrigin = { ...click };
    isMouseDown.set(true);
    
  }




export const onMouseDrag = (event) => {
  if(!get(isMouseDown)) return;
  // Need Store value to handle rotation limit and pull it from selected  object in a store
  // const currentSelectedObject = get(selectedObject);
  // if(currentSelectedObject?.userData?.limit?.rotation)
    // handleRotation(event, currentSelectedObject);
}





