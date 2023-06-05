function pickObjectFromRaycaster(normalizedPosition) {
  let raycaster = new three.Raycaster();
  raycaster.setFromCamera(normalizedPosition, camera);
  const intersectedObjects = raycaster.intersectObjects(scene.children);

  for (let intersect of intersectedObjects) {
    // Pick the first visible object hit
    if (intersect.object.visible) return intersect.object;
  }
  return undefined;
}

function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) * canvas.clientWidth) / rect.width,
    y: ((event.clientY - rect.top) * canvas.clientHeight) / rect.height,
  };
}

function setPickPosition(event) {
  const pos = getCanvasRelativePosition(event);
  pickPosition.x = (pos.x / canvas.clientWidth) * 2 - 1;
  pickPosition.y = (pos.y / canvas.clientHeight) * -2 + 1; // note we flip Y
}

function clearPickPosition() {
  // unlike the mouse which always has a position
  // if the user stops touching the screen we want
  // to stop picking. For now we just pick a value
  // unlikely to pick something
  pickPosition.x = -100000;
  pickPosition.y = -100000;
}
