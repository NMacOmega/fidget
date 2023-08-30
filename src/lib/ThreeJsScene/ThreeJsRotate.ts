import { MathUtils, Object3D } from 'three';

/**
 * Changes the rotation.y and rotation.z of the object based on the 
 * @param event click or touch
 * @param object the object to rotate
 * @void converts the calculated event coordinates into radians 
 * and rotates the provided object to match the click
 * 
 * @see {@link getRotationDegrees}
 */
export function handleRotation(event: MouseEvent, object: Object3D) {
    const {x, y} = getRotationPointFromClick(event, false);
    const degreesToMove = getRotationDegrees(x, y, 30);
    object.rotation.y = MathUtils.degToRad(degreesToMove.x);
    object.rotation.z = MathUtils.degToRad(degreesToMove.y);
  }

  /**
   * Based on the click event, gets coordinates to express how to convert the event into a rotation
   * 
   * @see {@link getRotationDegrees}
   * @param event the mouse click or touch event
   * @param adjustForResolution boolean flag
   * @returns x and y coordinates of where to rotate the object to
   */
  function getRotationPointFromClick(event: MouseEvent | TouchEvent, adjustForResolution: boolean): {x: number, y:number} {
    const isTouch = event.type.indexOf('touch') > -1;
  
    const { clientX, clientY } = (() => {
      if (isTouch) return event.touches[0];
      return event;
    })();
  
    if (adjustForResolution)
      return {
        x: (clientX / window.innerWidth) * 2 - 1,
        y: -(clientY / window.innerHeight) * 2 + 1
      };
  
    return { x: clientX, y: clientY };
  }
  
  /**
   * Coppied from {@link https://tympanus.net/codrops/2019/10/14/how-to-create-an-interactive-3d-character-with-three-js/ codrops threeJS interactive character tutorial}
   * 
   * The provided x and y coordinates are shifted so that an object may be rotated to face the new coordinates
   * 
   * this will simulate following the cursor in three dimensional space on a rotational axis, like a joystick
   * @param x x coordinate
   * @param y y coordinate
   * @param degreeLimit maximum variance to calculate to
   * @returns coordinates shifted to match a rotation motion.
   */
  function getRotationDegrees(x: number, y: number, degreeLimit: number): {x:number, y: number} {
    let dx = 0,
      dy = 0,
      xdiff,
      xPercentage,
      ydiff,
      yPercentage;
  
    const w = { x: window.innerWidth, y: window.innerHeight };
  
    // Left (Rotates neck left between 0 and -degreeLimit)
  
    // 1. If cursor is in the left half of screen
    if (x <= w.x / 2) {
      // 2. Get the difference between middle of screen and cursor position
      xdiff = w.x / 2 - x;
      // 3. Find the percentage of that difference (percentage toward edge of screen)
      xPercentage = (xdiff / (w.x / 2)) * 100;
      // 4. Convert that to a percentage of the maximum rotation we allow for the neck
      dx = ((degreeLimit * xPercentage) / 100) * -1;
    }
    // Right (Rotates neck right between 0 and degreeLimit)
    if (x >= w.x / 2) {
      xdiff = x - w.x / 2;
      xPercentage = (xdiff / (w.x / 2)) * 100;
      dx = (degreeLimit * xPercentage) / 100;
    }
    // Up (Rotates neck up between 0 and -degreeLimit)
    if (y <= w.y / 2) {
      ydiff = w.y / 2 - y;
      yPercentage = (ydiff / (w.y / 2)) * 100;
      // Note that I cut degreeLimit in half when she looks up
      // dy = (((degreeLimit * 0.5) * yPercentage) / 100) * -1;
      //I don't because this is a joystick not a head
      dy = ((degreeLimit * yPercentage) / 100) * -1;
    }
  
    // Down (Rotates neck down between 0 and degreeLimit)
    if (y >= w.y / 2) {
      ydiff = y - w.y / 2;
      yPercentage = (ydiff / (w.y / 2)) * 100;
      dy = (degreeLimit * yPercentage) / 100;
    }
    return { x: dx, y: dy };
  }
  

