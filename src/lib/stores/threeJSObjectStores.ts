
import { get, readable,writable } from 'svelte/store';
import { readableWithInit } from './custom';
import type { Vector2 } from 'three';
import type { InteractionsMap, SceneObjects, SceneHighlights, SceneDefaultMaterials } from '$types';
import type { THREEUUID } from '$types';
import type { MeshStandardMaterial } from 'three';

/**An Mapped Store of THEEJS objects taken from a scene, mapped by UUID. Can only be written to once. See {@link https://threejs.org/docs/#api/en/core/Object3D.children Object3d.children}*/
export const sceneObjects = readableWithInit<SceneObjects>({});
/**An Mapped Store of THEEJS objects to highlight when the camera moves, mapped by UUID. Can only be written to once. See {@link https://threejs.org/docs/?q=object#api/en/core/Object3D Object3d}, {@link https://threejs.org/docs/?q=ob#api/en/core/Object3D.uuid UUID}*/
export const sceneHighlights = readableWithInit(<SceneHighlights>{});
/**A mapped store of THREEJS default Materials, mapped by UUID. Stores the defautl state of all visible materials */
export const sceneDefaultMaterials = readableWithInit<SceneDefaultMaterials>({});


/**Used to determine which objects to show or hide depending on the fidget being shown */
// export const currentFidgetName = writable(''); 



/**Global constant for the different Fidgets mapped to objects and camera focus points in the Model */
const CUBE = 'cube';
const cube = Object.freeze({name: CUBE, objectName: 'cubeBase', focusPoint: 'focus1', camera: 'camera1'});
const SPHERE = 'sphere';
const sphere = Object.freeze({name: SPHERE, objectName: 'sphereBase', focusPoint: 'focus2', camera: 'camera2'});
const DISCS = 'discs';
const discs = Object.freeze({name: DISCS, objectName: 'baseInner', focusPoint: 'focus3', camera: 'camera3'});

const fidgetMap = Object.freeze({
	[CUBE]: {...cube},
	[SPHERE]: {...sphere},
	[DISCS]: {...discs}
});
type FidgetOptions = typeof cube | typeof sphere | typeof discs;
const fidgetsList = [{...cube, name: CUBE}, {...sphere, name: SPHERE}, {...discs, name: DISCS}] as const;

export type FidgetName = keyof typeof fidgetMap;
export type FidgetObjectName = (FidgetOptions)["objectName"];
export type FidgetFocusPoint = (FidgetOptions)["focusPoint"];
export type FidgetCamera = (FidgetOptions)["camera"];

const objectNames = fidgetsList.reduce((acc, obj)=>[...acc, obj.objectName],[]) as FidgetObjectName[];
const focalPoints = fidgetsList.reduce((acc, obj)=>[...acc, obj.focusPoint],[]) as FidgetFocusPoint[];
const cameraPoints = fidgetsList.reduce((acc, obj)=>[...acc, obj.camera],[]) as FidgetCamera[];

const currentFidget = writable<FidgetOptions>({...fidgetMap[CUBE]});

const lookupFidgetByName = (name:FidgetName)=> fidgetMap[name];
const lookupFidgetByObjectName = (objectName: FidgetObjectName) => fidgetsList.filter((entry)=>entry.objectName===objectName)[0];
const lookupFidgetByFocusPoint = (focusPoint: FidgetFocusPoint) => fidgetsList.filter((entry)=>entry.focusPoint===focusPoint)[0];
const lookupFidgetByCamera = (camera: FidgetCamera) => fidgetsList.filter((entry)=>entry.camera===camera)[0];

export const fidgetReference = {
	map: fidgetMap,
	list: fidgetsList,
	names: Object.keys(fidgetMap) as [FidgetName],
	objectNames,
	focalPoints,
	cameraPoints,
	current: currentFidget,
	lookup: {
		byName: lookupFidgetByName,
		byObjectName: lookupFidgetByObjectName,
		byFocalPoint: lookupFidgetByFocusPoint,
		byCamera: lookupFidgetByCamera,
	}
}

/**
 * Used to lock certain controls when mouse click is held
 * 
 * when true:
 * - {@link orbit orbit controls} will not rotate
 * 
 * when false
 * - {@link orbit orbit controls} will rotate as the mouse moves
 */
export const isMouseDown = writable(false);
/**Used to track position of mouse for dragging */
export const pickPosition = writable<Vector2>();

export const canvas = writable<HTMLCanvasElement>();
export const scene = readableWithInit<THREE.Scene>({} as THREE.Scene); //We will init as a ThreeJSScene once starup has completed

/**Map of {@link InteractionsMap interactions} allowed with objects in the scene*/
export const interactions = readable<InteractionsMap>(
	{
	joystick: {
		rotation: {
		  min: 10,
		  max: 10,
		},
	  }    
  });

export const defaultMaterialOptions = [
	{
		metalness: 50,
		roughness: 50,
		opacity: 100,
		color: 'ff0000',
	},
	{
		metalness: 90,
		roughness: 20,
		opacity: 50,
		color: '00ff00',
	},
	{
		metalness: 20,
		roughness: 90,
		opacity: 20,
		color: '0000ff',
	}
];


/** Returns the Mesh and material for an object of provided UUID
 * - See {@link https://threejs.org/docs/#api/en/objects/Mesh Mesh}, {@link https://threejs.org/docs/index.html?q=material#api/en/materials/Material Material} 
 * @param UUID The identifier string to search for
 * @returns The Mesh and Material in sceneObjects that bears that UUID, or undefined if none found
 */
export function getObjectWithMaterial(UUID: THREEUUID) {
	//.material exists on meshes, not objects. Meshes inherit from objects
	const currObject = get(sceneObjects)[UUID];
	if(!currObject || !currObject.material) return;
	const currMaterial = 
	<MeshStandardMaterial>(Array.isArray(currObject?.material) ? currObject?.material[0] : currObject.material);
	return {
		object: currObject,
		material: currMaterial
	};
}

/**Writable string: The UUID for the currently selected object */
export const selectedUUID = (function () {
	const { subscribe, set: setDirect } = writable('');

	function set(newUUID: THREEUUID) {
		const objectWithMaterial = getObjectWithMaterial(newUUID);
		if(!objectWithMaterial) return;
		const { object, material } = objectWithMaterial;
		//We have a new object. Need rotation, etc...
		material.transparent = true; //Needed to enable opacity setting
		const { metalness: m, roughness: r, opacity: o, color: c } = material;
		/**Must upscale from material because app needs 0 <-> 100 */
		// opacityStore._set(o*100);
		// metalnessStore._set(m*100);
		// roughnessStore._set(r*100);
		// colorStore._setFromNewMaterial(c.getHexString());
		setDirect(newUUID);
	}
	return { subscribe, set };
})();


  /**
 * Hides all objectes except those associated with the fidget located at the provied focus point
 * @param focusPoint The name of the focus point to aim camera toward
 * @shortcircuts-if
 * - Focuspoint is not in scene
 * - There are no objects in the scene paired to provided focuspoint
 * @void Hides objects not in focus
 */
export const highlightFidget = (fidgetName: FidgetName) => {
    const threeScene = get(scene);
    const uuid = get(sceneHighlights)[fidgetName]?.uuid;
    if(uuid) selectedUUID.set(uuid);

	const newFidget =fidgetReference.lookup.byName(fidgetName); 
	const focusPoint = newFidget.focusPoint;
	fidgetReference.current.set({...newFidget});

  
    const focusObjectInScene = threeScene.getObjectByProperty("name", focusPoint);
    if (!focusObjectInScene) { 
      console.log("No Focus point found for fidget ", fidgetName); 
      return;
    } 
  
    const objects = get(sceneObjects);
    let fidgetTag = ''; 
    
    Object.entries(objects).forEach(([_, obj]) => {
        const tag = obj.userData.focus || undefined;
        const fidgetGroup = obj.userData.group || undefined;
        

        if(tag === focusPoint && fidgetGroup) {
          obj.visible = true;   
          fidgetTag = fidgetGroup;
        }
        else obj.visible = false;
      });
    //   currentFidgetName.set(fidgetTag);
  }





//@todo?: do we need these objects for animations?
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