function addEventListeners() {
  window.addEventListener("pointerdown", onMouseDown);
  window.addEventListener("pointermove", onMouseDrag);
  window.addEventListener("pointerup", onMouseUp);
  window.addEventListener("resize", onWindowResize);

  document.addEventListener("coloris:pick", (event) => {
    setMaterialProperty("color", selectedMaterial, event.detail.color);
  });

  colorPickerOpenButton.addEventListener("click", () => {
    openColorPicker();
  });
  colorPickerLockButton.addEventListener("click", onLockColorMenuButtonClick);
  copyPropsButton.addEventListener("click", onCopyMaterialClick);
  enableDragbutton.addEventListener("click", onToggleDragClick);
  orbit.addEventListener("change", () => {
    onZoomChange(null, "orbit");
  });
  pastePropsButton.addEventListener("click", onPasteMaterialClick);
  playAnimationButton.addEventListener("click", playFidgetAnimations);
  prevNavButton.addEventListener("click", moveCamera);
  resetDragButton.addEventListener("click", resetDrag);
  zoomSlider.addEventListener("input", (e) => {
    onZoomChange(e, "slider");
  });

  helpButton?.addEventListener("click", () => {
    setHelpScreen(true);
  });
  nextNavButton?.addEventListener("click", () => {
    moveCamera("next");
  });

  metalSlider.addEventListener("input", (e) =>
    setMaterialProperty("metalness", selectedMaterial, e.target.value)
  );

  roughSlider.addEventListener("input", (e) =>
    setMaterialProperty("roughness", selectedMaterial, e.target.value)
  );
}
