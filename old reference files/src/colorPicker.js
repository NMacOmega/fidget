function onLockColorMenuButtonClick() {
  lockColorMenuOpen = !lockColorMenuOpen;
  setColorPickerLockActive(lockColorMenuOpen);
}

function setColorMenu(material) {
  selectedMaterial = material;
  metalSlider.value = material.metalness * 100;
  roughSlider.value = material.roughness * 100;
  let hexColor = `#${material.color.getHexString()}`;
  updateColorPicker(hexColor);
  updateColorPickerButton(hexColor);
  setCopyMaterialButtonActive(true);
}

function closeColorPicker() {
  //Doesn't listen when we use touch;
  colorPicker.dispatchEvent(new Event("close", { bubbles: true }));
}

function updateColorPicker(value) {
  colorPicker.value = value;
  colorPicker.dispatchEvent(new Event("input", { bubbles: true }));
  checkColorPickerLock();
}

function updateColorPickerButton(value) {
  let val =
    value || "conic-gradient(red, orange, yellow, green, blue, purple, red)";
  colorPickerOpenButton.style.background = val;
}

function openColorPicker() {
  colorPicker.dispatchEvent(new Event("click", { bubbles: true }));
  // colorPicker.focus();
}

function checkColorPickerLock(event) {
  if (!lockColorMenuOpen || !event || !event.target) return;
  let eventSource = event?.target?.id || "";
  let isClickingOnGradient = eventSource.includes("color-area");
  if (isClickingOnGradient) return;
  openColorPicker();
}

function setColorPickerLockActive(isActive) {
  if (isActive) {
    lockButtonSpan.innerText = "water_lock";
    colorPickerLockButton.classList.add("colorLockButtonActive");
    lockButtonSpan.classList.add("colorLockSpanActive");
    openColorPicker();
  } else {
    lockButtonSpan.innerText = "lock_open_right";
    colorPickerLockButton.classList.remove("colorLockButtonActive");
    lockButtonSpan.classList.remove("colorLockSpanActive");

    closeColorPicker();
  }
}
