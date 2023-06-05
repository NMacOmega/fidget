function onCopyMaterialClick() {
  if (!selectedMaterial || !("color" in selectedMaterial)) return;
  let color = "#" + selectedMaterial.color.getHexString();
  let metalic = metalSlider.value / 100;
  let roughness = roughSlider.value / 100;

  if (color && metalic && roughness) {
    materialClipboard = { color, metalic, roughness };
    setPasteMaterialButtonActive(true);
  }
}

function onPasteMaterialClick() {
  if (!pastePropsButton.classList.contains("pastePropsButtonActive")) return;
  if (!selectedMaterial || !("color" in selectedMaterial)) return;
  let { color, metalic, roughness } = materialClipboard;
  if (color && "color" in selectedMaterial) selectedMaterial.color.set(color);
  if (metalic && "metalness" in selectedMaterial)
    selectedMaterial.metalness = metalic;
  if (roughness && "roughness" in selectedMaterial)
    selectedMaterial.roughness = roughness;
  updateColorPickerButton(color);
  updateColorPicker(color);
  metalSlider.value = metalic * 100;
  roughSlider.value = roughness * 100;
}

function setCopyMaterialButtonActive(isActive) {
  if (isActive) copyPropsButton.classList.add("copyPropsButtonActive");
  else copyPropsButton.classList.remove("copyPropsButtonActive");
}

function setPasteMaterialButtonActive(isActive) {
  if (isActive) {
    pastePropsButton.classList.add("pastePropsButtonActive");
    pastePropsIcon.textContent = "content_paste";
    let { color, metalic, roughness } = materialClipboard;
    pastePropsButton.style.setProperty("--background-color", color);
    colorPasteSwatch.style.backgroundColor = color;
    colorPasteSwatch.style.display = "block";
    metalPasteSwatch.style.display = "block";
    roughPasteSwatch.style.display = "block";

    pasteProps.style.setProperty("--metalness", `${metalic * 100}%`);
    pasteProps.style.setProperty("--roughness", `${roughness * 100}%`);
  } else {
    pastePropsButton.classList.remove("pastePropsButtonActive");
    pastePropsIcon.textContent = "content_paste_off";
    pastePropsButton.style.setProperty("--background-color", "none");
    colorPasteSwatch.style.display = "none";
    metalPasteSwatch.style.display = "none";
    roughPasteSwatch.style.display = "none";
  }
}
