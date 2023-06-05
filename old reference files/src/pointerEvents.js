function onMouseUp() {
  selectedObject = {};
  orbit.enableRotate = true;
  mouseDown = false;
}

function onMouseDown(event) {
  mouseDown = true;

  if (displayingHelp) setHelpScreen(false);
  checkColorPickerLock(event);

  setPickPosition(event);
  let pickedObject = pickObjectFromRaycaster(pickPosition);
  let objectName = pickedObject?.name || undefined;
  if (!objectName) return;

  if (objectName !== selectedObject?.name) {
    selectedObject = pickedObject;

    if (interactives.indexOf(objectName) >= 0) orbit.enableRotate = false;

    setColorMenu(selectedObject.material);
  }
  // Used to track dragging, do we still want this?
  let click = getVector(event, true);
  dragOrigin = { ...click };
}

function onMouseDrag(event) {
  if (!mouseDown || !selectedObject.name) return;
  dragPoint = getVector(event, true);

  if (selectedObject?.userData?.limit?.rotation) {
    handleRotation(event);
  }
}

function dragMouseDown(e, dragElemID, dragObject, dragHandle) {
  if (!draggingEnabled) return;
  e = e || window.event;
  // e.preventDefault(); // From example, prevents slidebars from working
  if (dragHandle.id !== e.target.id) return;
  if (dragHandle.id === "dragHandleColor") {
    lockColorMenuOpen = false;
    setColorPickerLockActive(false);
  }

  draggingElement = dragObject;
  // get the mouse cursor position at startup:
  let { x, y } = getVector(e);
  pos3 = x;
  pos4 = y;

  document.onpointerup = closeDragElement;
  document.onpointermove = elementDrag;
}

function getVector(event, adjustForResolution) {
  let isTouch = event.type.indexOf("touch") > -1;

  let { clientX, clientY } = (() => {
    if (isTouch) return event.touches[0];
    return event;
  })();

  if (adjustForResolution)
    return {
      x: (clientX / window.innerWidth) * 2 - 1,
      y: -(clientY / window.innerHeight) * 2 + 1,
    };

  return { x: clientX, y: clientY };
}
