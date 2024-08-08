import type { AnimationAction } from "three";


/** A Map of AnimationAction objects parsed from a threeJS mixer.
 * grouped by the fidget object they are tied to in {@link map variable};
 * 
 * See {@link https://threejs.org/docs/#api/en/animation/AnimationAction AnimationAction}
*/
export type AnimationGroup = {
    [groupName: string]: AnimationAction
  };

  /** A Map of AnimationAction objects parsed from a threeJS mixer
 * and ready for playback, tagged by the animation clip name.
 * 
 * See {@link https://threejs.org/docs/#api/en/animation/AnimationAction AnimationAction}
*/
  export type AnimationsCollection = {
    [name: string]: AnimationGroup
  }

  type RotationInteraction = {
	min: number,
	max: number
 }

  export type InteractionsMap = {
	[object: string] : {
		rotation? : RotationInteraction
	}
  }

  /**
 * An alphanumeric identifier at least 20 characters long 
 * 
 * See {@link https://threejs.org/docs/#api/en/core/Object3D.uuid THREEJS Object3D.uuid}
*/
export type THREEUUID = string;

export type SceneObjects= {
	[key: string]: THREE.Mesh
};
export type SceneHighlights = {
	[key: string]: THREE.Mesh
};

export type SceneDefaultMaterials = {
  [key:string]: THREE.MeshStandardMaterial
};







export interface ColorSwatch {
  h: number;
  s: number;
  l: number;
  m: number;
  g: number;
  o: number;
}

export interface ColorSwatchWithKey {
  i: number;
  swatch: ColorSwatch;
}