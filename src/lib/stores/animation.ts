import { derived, get } from "svelte/store";
import { readableWithInit } from "./custom";
import { LoopOnce } from "three";
import { currentFidgetName } from "$lib/stores/material";
import type { AnimationAction } from "three";
import type { AnimationsCollection } from "../types/animations";



/**
 * {@link animations}: stores threeJS animation actions for replay. 
 * 
 * Data is a readable {@link AnimationsCollection} with an init function and cannot be overwritten
 * 
 * Also derives inner variables {@link availableAnimations} and 
 * {@link isAnimationsAvailable} to determine if animations may be playable, 
 * corresponding to the name of the currently active fidget
 * 
 * see {@link https://threejs.org/docs/#api/en/animation/AnimationAction threeJS / AnimationAction}
 */
export const animations = function(){

  /** This map object determines which animations should be stored for replay, 
   * and which fidget objects the animations correspond to.
   */
    const map = {
      sphere: ['spin'],
      discs: ['spinDiscA', 
      'spinDiscB', 
      'spinDiscC', 
      'spinDiscD'],
    };



    const animationsStore = readableWithInit<AnimationsCollection>({} as AnimationsCollection); //We will initialize on load
    
    /**
     * @param {AnimationAction[]} actions An array of AnimationActions
     * @void converts the provided AnimationAction[] into an {@link AnimationsCollection} and stores in the Animations store
     */
    const initFromActions = (actions: AnimationAction[])=>{
      const animationsMap = actions.reduce((acc, action)=>{
          const {name} = action.getClip();
          const group = Object.entries(map).filter(([_t, animsArray])=>animsArray.includes(name))[0];
          if(!group || !group[0]) return acc
          const tag = group[0];
          if(!acc[tag]) acc[tag] = {};
          return {...acc, [tag]: {...acc[tag], [name]: action}}
        }, {} as AnimationsCollection);
        animationsStore.init(animationsMap);
    }
    /**
     * @param {AnimationAction} animation The action to play
     * @void Plays the provided AnimationAction
     */
    const playAnimation = (animation:AnimationAction)=>animation.setLoop(LoopOnce, 1).play().reset();
      /**
     * @param {string} actionName Name of the AnimationAction to find and play
     * @void Plays the AnimationAction if it exists
     */
    const playAction = (actionName: string)=>{
      const action = get(animationActions).filter((action)=>action.getClip().name === actionName)[0];
      if(action) playAnimation(action);
    }
       /**
     * @param {string} groupName The name of the group containing the AnimationActions to be played
     * @void Plays all AnimationActions in the given group
     */
    const playGroup = (groupName: keyof AnimationsCollection)=>Object.values(get(animationsStore)[groupName]).map((action)=>playAnimation(action));
        /**
     * What do I do?
     * @void: Does something
     */
    const playAvailable = ()=>Object.values(get(availableAnimations)).map((action)=>playAnimation(action));

    return {subscribe: animationsStore.subscribe, 
        initFromActions,
        playGroup, 
        playAction, 
        playAvailable};
  }();

  /**
   * derived reference object to the {@link AnimationGroup} that corresponds
   * 
   * to the currentFidgetName. The {@link AnimationsActions} in this object can be played and will be visible.
   */
  const availableAnimations = derived([currentFidgetName, animations], 
    ([$i, $anims]:[string, AnimationsCollection])=>$anims[$i as keyof AnimationsCollection]||{});

    /**Derived array of all actions for easy lookup */
  const animationActions = derived(animations, (anims)=>{
    return Object.values(anims).reduce((acc, group)=>{return [...acc, ...Object.values(group)]}, [] as AnimationAction[]);
  });
    
  /**Derived convenience bool to know if any AnimationActions can currently be played */
  export const isAnimationsAvailable = derived(availableAnimations, ($anims)=>$anims && Object.entries($anims).length > 0 || false);