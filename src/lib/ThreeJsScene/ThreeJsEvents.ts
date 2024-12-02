
import {get} from 'svelte/store';
import { getPickPosition, pickObjectFromPosition } from "$lib/ThreeJsScene/ThreeJsPicker";
import {handleRotation}  from "$lib/ThreeJsScene/ThreeJsRotate";

import { selectedUUID, isMouseDown, pickPosition, interactions } from '$stores/activeMaterial';
import { orbit } from '$stores/camera';


/**
 * When the mouse is released, sets controls to initial state
 * @void 
 * - enables {@link orbit orbit controls} to rotate again
 * - sets {@link isMouseDown} to false so we can catch future clicks
 * @see {@link isMouseDown}
 */
export function onMouseUp () {
    get(orbit).enableRotate = true;
    // selectedUUID.set(''); //Causing problems with dragging
    isMouseDown.set(false);
  }

/**
 * Checks for an object where the click happened and updates controls accordingly
 * @param event the mouse click of this event
 * @void 
 * - updates {@link selectedUUID} to match the UUID of the clicked object, if any
 * - ir the clicked object has a {@link InteractionsMap custom interaction}, {@link orbit orbit controls} will disable rotating
 * - {@link isMouseDown} is set to true to prevent clicking loops or unpredictable dragging behavior. @see {@link isMouseDown} 
 */
export function onMouseDown (event: MouseEvent) {
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



/**
 *  Was used to proces drag-and-drop behavior for the controls. Disabled at present, we may want to just get rid of this.
 * @param event 
 * @void draggy draggy drag drag! 
 */
export function onMouseDrag (event){
  if(!get(isMouseDown)) return;
  // Need Store value to handle rotation limit and pull it from selected  object in a store
  // const currentSelectedObject = get(selectedObject);
  // if(currentSelectedObject?.userData?.limit?.rotation)
    // handleRotation(event, currentSelectedObject);
}





