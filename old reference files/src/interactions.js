function highlightObject(target) {
  let focus = scene.getObjectByProperty("name", target);
  if (focus) currentFocusPoint = focus;
  let newObjectGroup = "";
  let isAnimationSelected = false;
  let isMaterialSelected = false;
  objects.forEach((obj) => {
    if (obj.userData.focus === target) {
      if (newObjectGroup === "" && obj.userData?.group)
        newObjectGroup = obj.userData.group;
      if (obj?.userData?.group && animations[obj.userData.group]) {
        activeAnimations = Object.values(animations[obj.userData.group]);
        setAnimationButton(true);
        isAnimationSelected = true;
      }
      if (!isMaterialSelected && obj.material) setColorMenu(obj.material);
      return (obj.visible = true);
    }
    obj.visible = false;
  });
  if (!isAnimationSelected) setAnimationButton(false);
}
