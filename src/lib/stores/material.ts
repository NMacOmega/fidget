import { readable, writable, derived, get } from 'svelte/store';
import { readableWithInit } from './custom';
import { convert} from '$lib/colorFunctions.js';
import type { Color, RGBColor, HSLColor, HEXColor, HSVColor, RGBTupleColor, HSLTupleColor, HueNumberType, percentNumberType, HSVTupleColor, rgbNumberType, HSLString, HSVString, RGBString} from '$lib/colorFunctions.js';
import type { MeshStandardMaterial, Vector2 } from 'three';
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
		const newColor = convert.hex.toColor(c.getHexString());
		if (newColor) colorStore._set(newColor);
		/**Must upscale from material because app needs 0 <-> 100 */
		opacityStore.setDirect(o*100);
		metalnessStore.setDirect(m*100);
		roughnessStore.setDirect(r*100);
		setDirect(newUUID);
	}
	return { subscribe, set };
})();


/**
 * Generic Store generator to read and update Material properties on the fly
 * 
 * Set function will update the currently active material, if any.
 * @template {T} initialValue
 * @param updateMaterialFunction The function to update a specified material 
 * @returns Writable store with a SetDirect function for private use and set function for public. 
 */
const createMaterialPropertyStore = <T>(initValue:T, updateMaterialFunction:(material:MeshStandardMaterial, v:T)=>void) => {
	const { subscribe, set: setDirect } = writable(initValue);
	const set = (v:T) => {
		const objectWithMaterial = getObjectWithMaterial(get(selectedUUID));
		if(!objectWithMaterial) return;
		updateMaterialFunction(objectWithMaterial.material, v);
		setDirect(v);
	};
	return { subscribe, set, setDirect };
};

/*restricting setDirect functions to this file only
* Each function must reduce value to 0 <-> 1 to match threeJS acceptable values 
*/
const opacityStore = createMaterialPropertyStore<number>(1, (material:MeshStandardMaterial, v: number) => (material.opacity = v/100));
const metalnessStore = createMaterialPropertyStore<number>(1, (material:MeshStandardMaterial, v:number) => (material.metalness = v/100));
const roughnessStore = createMaterialPropertyStore<number>(1, (material:MeshStandardMaterial, v: number) => (material.roughness = v/100));


/*Exposing {subscribe, set} for all material properties*/

/** Store to track/update Opacity of active material
 * @param number 0 <=> 100 (see {@link opacity})*/
export const opacity = { subscribe: opacityStore.subscribe, set: opacityStore.set };
/** Store to track/update Metalness of active material
 * @param number 0 <=> 100  (see {@link metalness})*/
export const metalness = { subscribe: metalnessStore.subscribe, set: metalnessStore.set };
/** Store to track/update Roughness of active material
 * @param number 0 <=> 100  (see {@link roughness})*/
export const roughness = { subscribe: roughnessStore.subscribe, set: roughnessStore.set };

/** Derived Store to track/update Roughness of active material. Inverse of Roughness.
 * - Set function updates roughness with the inverse of the value provided (1-v)
 * -  (see {@link glossiness}, {@link roughness})
 * @param number 0 <=> 1 */
export const glossiness = (function () {
	const { subscribe } = derived(roughness, ($r) => 100 - $r);
	const set = (v: number) => {
		const newRoughness = 100 - v;
		roughness.set(newRoughness);
	};
	return { subscribe, set };
})();

/** Writable Color Object store with set function limited to private use.
 * 
 * Color format: {@link Color}
 * 
 * See {@link hsl}, {@link rgb}, {@link hex}, {@link hsv} for Public options to set value
 * 
 */
const colorStore = (function () {
	const initialState: Color = {
        /**
         * @see {HSLColor} 
         * @see {RGBColor}
         * @see {HSVColor}
         * @see {HEXColor}
         */
        hsl: { h: 0, s: 0, l: 0 }, 
		rgb: { r: 0, g: 0, b: 0 }, 
		hsv: { h: 0, s: 0, v: 0 }, 
		hex: '000000'             
    };
	const { subscribe, set: _set } = writable<Color>(initialState);

	/**
	 * Sets this store to a {@link Color} value. If value proviced is undefined, does nothing
	 * @param color 
	 * @returns Updates store value
	 */
	const set = (color: Color | undefined) => {
		if (!color) return;
		console.log(color)
		const objectWithMaterial = getObjectWithMaterial(get(selectedUUID));
		if (!objectWithMaterial) return;
		const { h, s, l } = color.hsl;
		console.dir(color);
		objectWithMaterial.material.color.setHSL(h/360, s/100, l/100);
		_set(color);
	};
	return { subscribe, _set, set };
})();



/**
 *  {@link hsl}: A Writable store to track HSL Color value. Set function will update {@link colorStore}
 * 
 *  Valid HSL values:
 *  - h = 0 <=> 360
 * - s = 0 <=> 100
 * - l = 0 <=> 100
 * - FORMAT: {h, s, l} or [h, s, l]
 * 
 * @param {HSLColor | HSLTupleColor} val HSL Parsable. See {@link HSLColor}, {@link HSLTupleColor}, {@link hueNumber}, {@link percentNumber}
 * @returns {Color | undefined} An object with HSL, HSV, HEX, and RGB values, or undefined if failed. See {@link Color}  
 * @see {@link convert.hsl.toColor} 
 * */
export const hsl = (function () {
	const { subscribe } = derived(colorStore, ($c) => $c.hsl);
	return {
		subscribe,
		set: hslSet,
		setHue: hslSetHue,
		setSaturation: hslSetSaturation,
		setLuminosity: hslSetLuminosity
	};
})();

/**
 * {@link rgb}: A Writable store to track RGB Color value. Set function will update {@link colorStore}
 * Valid RGB values:
 * - r, g, b = 0 <=> 255
 * 
 * FORMAT: {r, g, b} or [r, g, b]
 * 
 * @param {RGBColor | RGBTupleColor} val RGB Parsable. See {@link RGBColor}, {@link RGBTupleColor}
 * @returns {Color | undefined} An object with HSL, HSV, HEX, and RGB values, or undefined if failed. See {@link Color}  
 * @see {@link convert.rgb.toColor} 
 * */
export const rgb = (function () {
	const { subscribe } = derived(colorStore, ($c) => $c.rgb);
	return {
		subscribe,
		set: rgbSet,
		setRed: rgbSetRed,
		setGreen: rgbSetGreen,
		setBlue: rgbSetBlue
	};
})();

/**
 * {@link hsv}: A Writable store to track HSV Color value. Set function will update {@link colorStore}
 * 
 *  Valid HSV values:
 *  - h = 0 <=> 360
 * - s = 0 <=> 100
 * - v = 0 <=> 100
 * - FORMAT: {h, s, v} or [h, s, v]
 * 
 * @param {HSVColor | HSVTupleColor} val HSV Parsable. See {@link HSVColor}, {@link HSVTupleColor}, {@link hueNumber}, {@link percentNumber}		 * @returns {Color | undefined} An object with HSL, HSV, HEX, and RGB values, or undefined if failed. See {@link Color}  
 * @see {@link convert.hsv.toColor} 
 * */
export const hsv = (function () {
	const { subscribe } = derived(colorStore, ($c) => $c.hsv);
	return {
		subscribe,
		set: hsvSet,
		setHue: hsvSetHue,
		setSaturation: hsvSetSaturation,
		setValue: hsvSetValue
	};
})();

/**
 * {@link hex}: A Writable store to track HEX Color value. Set function will update {@link colorStore}
 * 
 *  Valid HEX values:
 *  - string: "000" <=> "fff"
 *  - string: "000000" <=> "ffffff"
 * 
 *   letters are not case sensitive
 * @param {HEXColor} val HEX Parsable. See {@link HEXColor}
 * @returns {Color | undefined} An object with HSL, HSV, HEX, and RGB values, or undefined if failed. See {@link Color}  
 * @see {@link convert.hex.toColor} 
 * */
export const hex = (function () {
	const { subscribe } = derived(colorStore, ($c) => $c.hex);
	return {
		subscribe,
		set: hexSet
	};
})();
/**
 *{@link hslSet}: Updates the Color Store via HSL Values. See {@link HSLColor}, {@link HSLTupleColor}, {@link Color}
 */
/*prettier-ignore*/ function hslSet(v:HSLColor | HSLTupleColor | HSLString) 
{colorStore.set(convert.hsl.toColor(v));}
/**
 * {@link hslSetHue}: Updates the Color Store via HSL Hue. See {@link HueNumberType}, {@link Color}
 */
/*prettier-ignore*/ function hslSetHue(v:HueNumberType) 
{colorStore.set(convert.hsl.toColor({ ...get(colorStore).hsl, h: v }));}
/**
 * {@link hslSetSaturation}: Updates the Color Store via HSL Saturation {@link percentNumberType}, {@link Color}
 */
/*prettier-ignore*/ function hslSetSaturation(v:percentNumberType)
{colorStore.set(convert.hsl.toColor({ ...get(colorStore).hsl, s: v }))}
/**
 * {@link hslSetLuminosity}: Updates the Color Store via HSL Luminosity. See {@link HueNumberType}, {@link Color}
 */
/*prettier-ignore*/ function hslSetLuminosity(v:percentNumberType)
{colorStore.set(convert.hsl.toColor({ ...get(colorStore).hsl, l: v }))}
/**
 * {@link hsvSet}L Updates the Color Store via HSV Values. See {@link HSVColor}, {@link HSVTupleColor}, {@link Color}
 */
/*prettier-ignore*/ function hsvSet(v:HSVColor|HSVTupleColor|HSVString) 
{colorStore.set(convert.hsv.toColor(v));}
/**
 * {@link hslSetLuminosity}: Updates the Color Store via HSV Hue. See {@link HueNumberType}, {@link Color}
 */
/*prettier-ignore*/ function hsvSetHue(v:HueNumberType) 
{colorStore.set(convert.hsv.toColor({ ...get(colorStore).hsv, h: v }));}
/**
 * {@link hsvSetSaturation}: Updates the Color Store Via HSV Saturation. See {@link percentNumberType}, {@link Color}
 */
/*prettier-ignore*/ function hsvSetSaturation(v:percentNumberType)
{colorStore.set(convert.hsv.toColor({ ...get(colorStore).hsv, s: v }))}
/**
 * {@link hsvSetValue}: Updates the Color Store via HSV Luminosity. See {@link percentNumber}, {@link Color}
 */
/*prettier-ignore*/ function hsvSetValue(v:percentNumberType)
{colorStore.set(convert.hsv.toColor({ ...get(colorStore).hsv, v: v }))}
/**
 * {@link rgbSet}: Updates the Color Store via RGB Values. See {@link RGBColor}, {@link RGBTupleColor}, {@link Color}
 */
/*prettier-ignore*/ function rgbSet(v:RGBColor | RGBTupleColor | RGBString) 
{colorStore.set(convert.rgb.toColor(v));}
/**
 * {@link rgbSetRed}: Updates the Color Store via RGB Red. See {@link rgbNumberType}, {@link Color}
 */
/*prettier-ignore*/ function rgbSetRed(v:rgbNumberType) 
{colorStore.set(convert.rgb.toColor({ ...get(colorStore).rgb, r: v }));}
/**
 * {@link rgbSetGreen}: Updates the Color Store via RGB Green. See {@link rgbNumberType}, {@link Color}
 */
/*prettier-ignore*/ function rgbSetGreen(v:rgbNumberType)
{colorStore.set(convert.rgb.toColor({ ...get(colorStore).rgb, g: v }))}
/**
 * {@link rgbSetBlue}: Updates the Color Store via RGB Blue. See {@link rgbNumberType}, {@link Color}
 */
/*prettier-ignore*/ function rgbSetBlue(v:rgbNumberType)
{colorStore.set(convert.rgb.toColor({ ...get(colorStore).rgb, b: v }))}
/**
 * {@link hexSet}: Updates the Color Store via HEX String. See {@link HEXColor}, {@link Color}
 */
/*prettier-ignore*/ function hexSet(v:HEXColor) 
{colorStore.set(convert.hex.toColor(v));}


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