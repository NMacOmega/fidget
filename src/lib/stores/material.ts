import { readable, writable, derived, get } from 'svelte/store';
import { readableWithInit } from './custom';
import type {  MeshStandardMaterial, Vector2 } from 'three';
import type { HEXColor } from '$lib/colorFunctions';
import type { InteractionsMap, SceneObjects, SceneHighlights, THREEUUID } from '$types';



/**An Mapped Store of THEEJS objects taken from a scene, mapped by UUID. Can only be written to once. See {@link https://threejs.org/docs/#api/en/core/Object3D.children Object3d.children}*/
export const sceneObjects = readableWithInit<SceneObjects>({});
/**An Mapped Store of THEEJS objects to highlight when the camera moves, mapped by UUID. Can only be written to once. See {@link https://threejs.org/docs/?q=object#api/en/core/Object3D Object3d}, {@link https://threejs.org/docs/?q=ob#api/en/core/Object3D.uuid UUID}*/
export const sceneHighlights = readableWithInit(<SceneHighlights>{});

/**Used to determine which objects to show or hide depending on the fidget being shown */
export const currentFidgetName = writable(''); 



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


/**
 * Hides all objectes except those associated with the fidget located at the provied focus point
 * @param focusPoint The name of the focus point to aim camera toward
 * @shortcircuts-if
 * - Focuspoint is not in scene
 * - There are no objects in the scene paired to provided focuspoint
 * @void Hides objects not in focus
 */
export const highlightFidget = (focusPoint: string) => {
    const threeScene = get(scene);
    const uuid = get(sceneHighlights)[focusPoint]?.uuid;
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



/** Returns the Mesh and material for an object of provided UUID
 * - See {@link https://threejs.org/docs/#api/en/objects/Mesh Mesh}, {@link https://threejs.org/docs/index.html?q=material#api/en/materials/Material Material} 
 * @param UUID The identifier string to search for
 * @returns The Mesh and Material in sceneObjects that bears that UUID, or undefined if none found
 */
function getObjectWithMaterial(UUID: THREEUUID) {
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
		// const newColor = convert.hex.toColor(c.getHexString());
		// if (newColor) {colorStore._set(newColor)
		// UUIDColor.set(newColor.hex)};
		/**Must upscale from material because app needs 0 <-> 100 */
		opacityStore._set(o*100);
		metalnessStore._set(m*100);
		roughnessStore._set(r*100);
		setDirect(newUUID);
	}
	return { subscribe, set };
})();

/**Used to track the default hex color of the selected UUID Object. updated when UUID is changed. */
const UUIDColor = (function (){
		const {subscribe, set} = writable<HEXColor | ''>('');
		return {subscribe, set};
})();
/**Used to track the default hex color of the selected UUID Object. updated when UUID is changed. */
export const selectedUUIDColor = {subscribe: UUIDColor.subscribe};

/**Used to track the default metalness of the selected UUID Object. updated when UUID is changed. */
const UUIDMetalness = (function (){
	const {subscribe, set} = writable<number>(0);
	return {subscribe, set};
})();
/**Used to track the default metalness of the selected UUID Object. updated when UUID is changed. */
export const selectedUUIDMetalness = {subscribe: UUIDMetalness.subscribe};

/**Used to track the default roughness of the selected UUID Object. updated when UUID is changed. */
const UUIDRoughness = (function (){
	const {subscribe, set} = writable<number>(0);
	return {subscribe, set};
})();
/**Used to track the default roughness of the selected UUID Object. updated when UUID is changed. */
export const selectedUUIDRoughness = {subscribe: UUIDRoughness.subscribe};

/**Used to track the default opacity of the selected UUID Object. updated when UUID is changed. */
const UUIDOpacity = (function (){
	const {subscribe, set} = writable<number>(0);
	return {subscribe, set};
})();
/**Used to track the default opacity of the selected UUID Object. updated when UUID is changed. */
export const selectedUUIDOpacity = {subscribe: UUIDOpacity.subscribe};

/**Used to track the default Glossiness of the selected UUID Object. updated when UUID is changed. */
export const selectedUUIDGlossiness = derived(UUIDRoughness, (roughness)=> 1 - roughness);


const opacityStore = (function(){
	const {subscribe, set:_set} = writable<number>(0);

	function setSelectedObjectOpacity(v:number){
		const objectWithMaterial = getObjectWithMaterial(get(selectedUUID));
		if(!objectWithMaterial) return;
		objectWithMaterial.material.opacity = v/100;
		_set(v);
	}
	return {subscribe, _set, set: setSelectedObjectOpacity}
})();
/** Store to track/update Opacity of active material
 * @param number 0 <=> 100 (see {@link opacity})*/
export const opacity = {subscribe: opacityStore.subscribe, set:opacityStore.set};


const metalnessStore = (function(){
	const {subscribe, set:_set} = writable<number>(0);

	function setSelectedObjectMetalness(v:number){
		const objectWithMaterial = getObjectWithMaterial(get(selectedUUID));
		if(!objectWithMaterial) return;
		objectWithMaterial.material.metalness = v/100;
		_set(v);
	}
	return {subscribe, _set,set: setSelectedObjectMetalness}
})();
/** Store to track/update Metalness of active material
 * @param number 0 <=> 100  (see {@link metalness})*/
export const metalness = {subscribe: metalnessStore.subscribe, set:metalnessStore.set};

const roughnessStore = (function(){
	const {subscribe, set:_set} = writable<number>(0);

	function setSelectedObjectRoughness(v:number){
		const objectWithMaterial = getObjectWithMaterial(get(selectedUUID));
		if(!objectWithMaterial) return;
		objectWithMaterial.material.roughness = v/100;
		_set(v);
	}
	return {subscribe, _set, set: setSelectedObjectRoughness}
})();
/** Store to track/update Roughness of active material
 * @param number 0 <=> 100  (see {@link roughness})*/
export const roughness = {subscribe: roughnessStore.subscribe, set:roughnessStore.set};


/** Derived Store to track/update Roughness of active material. Inverse of Roughness.
 * - Set function updates roughness with the inverse of the value provided (1-v)
 * -  (see {@link glossiness}, {@link roughness})
 * @param number 0 <=> 100 */
export const glossiness = (function () {
	const { subscribe } = derived(roughnessStore, ($r) => 100 - $r);
	const set = (v: number) => {
		const newRoughness = 100 - v;
		roughnessStore.set(newRoughness);
	};
	return { subscribe, set };
})();












