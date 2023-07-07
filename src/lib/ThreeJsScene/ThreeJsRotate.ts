// How to do rotation correctly
// https://tympanus.net/codrops/2019/10/14/how-to-create-an-interactive-3d-character-with-three-js/

import { MathUtils } from 'three';

export function handleRotation(event, object) {
    const {x, y} = getRotationPointFromClick(event, false);
    const degreesToMove = getRotationDegrees(x, y, 30);
    object.rotation.y = MathUtils.degToRad(degreesToMove.x);
    object.rotation.z = MathUtils.degToRad(degreesToMove.y);

  }

  function getRotationPointFromClick(event, adjustForResolution) {
    let isTouch = event.type.indexOf('touch') > -1;
  
    let { clientX, clientY } = (() => {
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
  
  function getRotationDegrees(x, y, degreeLimit) {
    let dx = 0,
      dy = 0,
      xdiff,
      xPercentage,
      ydiff,
      yPercentage;
  
    let w = { x: window.innerWidth, y: window.innerHeight };
  
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
  

