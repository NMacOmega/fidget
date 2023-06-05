function moveCamera(direction) {
  const next = direction === "next";
  const prev = !next;
  let newPos = currentCameraPosition + (next ? 1 : -1);
  if (prev && newPos < 0) newPos = cameras.length - 1;
  if (next && newPos > cameras.length - 1) newPos = 0;
  currentCameraPosition = newPos;
  camera.position.copy(cameras[newPos].position);

  const newFocus = focusPoints[newPos];
  if (newFocus) {
    orbit.target.copy(newFocus.position);
    highlightObject(newFocus.name);
  }
  orbit.update();
}

function onZoomChange(e, src) {
  if (src === "slider") {
    if (!e.target?.value) return;
    let value = e.target.value / 100;
    const desiredMovement = zoomLimit.max - zoomLimit.min * value;

    const currentDistance = camera.position.distanceTo(
      currentFocusPoint.position
    );

    camera.position.lerpVectors(
      currentFocusPoint.position,
      camera.position,
      desiredMovement / currentDistance
    );
  }

  if (src === "orbit") {
    if (!orbit.enableZoom) return;

    let newZoom = camera.position.distanceTo(currentFocusPoint.position);
    let zoomAsPercent = ((newZoom - zoomLimit.min) / zoomLimit.min) * 100;
    let result = 100 - zoomAsPercent;
    zoomSlider.value = result < 0 ? 0 : result;
  }
}

function setAnimationButton(active) {
  const className = "playAnimationButtonActive";
  active && playAnimationButton.classList.add(className);
  !active && playAnimationButton.classList.remove(className);
  playAnimationButton.enabled = active;
}

function playFidgetAnimations() {
  activeAnimations.forEach((clip) => {
    if (clip?.play) clip.setLoop(three.LoopOnce).play().reset();
  });
}

function setHelpScreen(value) {
  displayingHelp = value;
  let classToggle = "helpItemHidden";
  document.querySelectorAll(".helpItem").forEach((elem) => {
    if (value === true) return elem.classList.remove(classToggle);
    elem.classList.add(classToggle);
  });
}

function onWindowResize() {
  camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
}
