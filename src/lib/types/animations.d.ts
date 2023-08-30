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