import * as THREE from "https://unpkg.com/three/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "https://unpkg.com/three/examples/jsm/environments/RoomEnvironment.js";

// Mobile Optimizations, especially with breakpoints
//Locking color picker causes problems on mobile

let modelUrl = `${import.meta.env.DEV ? "" : "/fidget/"}/fidgetgallery.glb`;

Coloris &&
  Coloris.setInstance(".colorPicker", {
    theme: "polaroid",
    themeMode: "dark",
    alpha: false,
    formatToggle: true,
    swatches: ["#264653", "#2a9d8f", "#e9c46a"],
  });

const interactivesMap = {
  joystick: {
    rotation: {
      min: 10,
      max: 10,
    },
  },
};

const interactives = Object.keys(interactivesMap);

let zoomLimit = { max: 10, min: 5 };
var currentFocusPoint = {};

const draggableElementsToHandlesMap = {
  "#colorMenuDraggable": {
    handle: "#dragHandleColor",
    origin: {
      top: "80px",
      left: "110px",
    },
  },
  "#materialsMenuDraggable": {
    handle: "#dragHandleMaterial",
    origin: {
      top: "150px",
      left: "100px",
    },
  },
  "#zoomMenuDraggable": {
    handle: "#dragHandleZoom",
    origin: {
      top: "90%",
      left: "60%",
    },
  },
};

const draggables = Object.entries(draggableElementsToHandlesMap).reduce(
  (acc, [objId, { handle: handleId, origin }]) => {
    let object = document.querySelector(objId);
    let handle = document.querySelector(handleId);
    if (origin.top) object.style.top = origin.top;
    if (origin.left) object.style.left = origin.left;
    return { ...acc, [objId]: { object, handle, origin } };
  },
  {}
);

let draggingElement; //the element we will move one at a time
var materialClipboard = {}; //Used to store color, metalic, and roughness

const animations = {
  sphere: {
    spin: {},
  },
  discs: {
    spinDiscA: {},
    spinDiscB: {},
    spinDiscC: {},
    spinDiscD: {},
  },
};

let scene,
  renderer,
  environment,
  pmremGenerator,
  loader,
  camera,
  mixer,
  orbit,
  raycaster,
  clock;
let dragPoint, dragOrigin;
let selectedObject = {},
  selectedMaterial = {};
let objects = [],
  cameras = [],
  focusPoints = [],
  cameraLimits = [];

let threeCanvasDiv,
  colorPicker,
  colorPickerOpenButton,
  colorPickerLockButton,
  colorPickerPasteButton,
  materialsMenu,
  roughSlider,
  metalSlider,
  enableDragbutton,
  resetDragButton,
  colorDragHandle,
  materialDragHandle,
  prevNavButton,
  nextNavButton,
  lockButtonSpan,
  lockPropsButton,
  helpButton,
  colorPasteSwatch,
  metalPasteSwatch,
  roughPasteSwatch,
  zoomSlider,
  copyPropsButton,
  pasteProps,
  pastePropsButton,
  pastePropsButtonIcon,
  playAnimationButton;

let mouseDown = false;
let lockColorMenuOpen = false;
let draggingEnabled = false;
let displayingHelp = false;

let currentCameraPosition = 0;

var backupCopyText = "";

var pos1 = 0,
  pos2 = 0,
  pos3 = 0,
  pos4 = 0; //For Element Dragging
threeCanvasDiv = document.querySelector("#app");

scene = new THREE.Scene();
scene.background = null;
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
environment = new RoomEnvironment();
pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(environment).texture;

loader = new GLTFLoader();
camera = new THREE.PerspectiveCamera(
  75,
  threeCanvasDiv.offsetWidth / threeCanvasDiv.offsetHeight,
  0.1,
  1000
);
orbit = new OrbitControls(camera, renderer.domElement);
orbit.maxDistance = zoomLimit.max;
orbit.minDistance = zoomLimit.min;
orbit.enablePan = false;
raycaster = new THREE.Raycaster();
dragPoint = new THREE.Vector2();
dragOrigin = new THREE.Vector2();
clock = new THREE.Clock();

renderer.setSize(threeCanvasDiv.offsetWidth, threeCanvasDiv.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(0x000000, 0);
threeCanvasDiv.appendChild(renderer.domElement);

colorPicker = document.getElementById("colorPicker");
colorPickerOpenButton = document.getElementById("colorOpenButton");
colorPickerLockButton = document.getElementById("colorPickerLockButton");
lockButtonSpan = document.querySelector("#colorLockSpan");
metalSlider = document.getElementById("metalSlider");
roughSlider = document.getElementById("roughSlider");
prevNavButton = document.getElementById("prevNavButton");
nextNavButton = document.getElementById("nextNavButton");
materialsMenu = document.getElementById("materialMenu");
enableDragbutton = document.querySelector("#dragToggle");
resetDragButton = document.querySelector("#resetDrag");
copyPropsButton = document.querySelector("#copyPropsButton");
pasteProps = document.querySelector(".pasteProps");
pastePropsButton = document.querySelector("#pastePropsButton");
pastePropsButtonIcon = document.querySelector("#pastePropsIcon");
colorPasteSwatch = document.querySelector("#colorPasteSwatch");
metalPasteSwatch = document.querySelector("#metalPasteSwatch");
roughPasteSwatch = document.querySelector("#roughPasteSwatch");
helpButton = document.querySelector("#helpButton");
playAnimationButton = document.querySelector("#playAnimationButton");
zoomSlider = document.querySelector("#zoomSlider");

renderer.setAnimationLoop(render); //Needed for animations

loader.load(modelUrl, loadModel, undefined, function (error) {
  console.log(error);
});

window.addEventListener("pointerdown", onMouseDown);
window.addEventListener("pointermove", onMouseDrag);
window.addEventListener("pointerup", onMouseUp);
window.addEventListener("resize", onWindowResize);

orbit.addEventListener("change", onZoomChangeFromControls);

colorPickerOpenButton.addEventListener("click", openColorPicker);
colorPickerLockButton.addEventListener("click", onLockColorMenuButtonClick);
metalSlider.addEventListener("input", setMaterialMetalness);
roughSlider.addEventListener("input", setMaterialRoughness);
zoomSlider?.addEventListener("input", onZoomChangeFromSlider);
prevNavButton?.addEventListener("click", moveCamera);
nextNavButton?.addEventListener("click", () => {
  moveCamera("next");
});
enableDragbutton.addEventListener("click", onToggleDragClick);
resetDragButton?.addEventListener("click", resetDrag);
copyPropsButton?.addEventListener("click", onCopyMaterialClick);
pastePropsButton?.addEventListener("click", onPasteMaterialClick);
helpButton?.addEventListener("click", () => {
  setHelpScreen(true);
});

document.addEventListener("coloris:pick", (event) => {
  setMaterialColor(selectedMaterial, event.detail.color);
});

Object.entries(draggables).forEach(([id, { object, handle }]) => {
  object.onpointerdown = (e) => dragMouseDown(e, id, object, handle);
});

function render(e) {
  if (mixer) {
    mixer.update(clock.getDelta());
  }
  renderer.render(scene, camera);
}

function onToggleDragClick() {
  draggingEnabled = !draggingEnabled;
  Object.values(draggables).forEach(({ _, handle }) => {
    handle.style.display = draggingEnabled ? "flex" : "none";
  });
  if (draggingEnabled) enableDragbutton.classList.add("toggleDragButtonActive");
  else enableDragbutton.classList.remove("toggleDragButtonActive");
}

function resetDrag() {
  draggingEnabled = false;
  Object.values(draggables).forEach(({ object, handle, origin }) => {
    handle.style.display = "none";
    if (origin.top) object.style.top = origin.top;
    if (origin.left) object.style.left = origin.left;
    if (origin.bottom) object.style.bottom = origin.bottom;
    if (origin.right) object.style.right = origin.right;
  });
  enableDragbutton.classList.remove("toggleDragButtonActive");
  setCopyMaterialButtonActive(false);
  setPasteMaterialButtonActive(false);
  materialClipboard = {};
  updateColorPickerButton(undefined);
}

function onLockColorMenuButtonClick() {
  lockColorMenuOpen = !lockColorMenuOpen;
  setColorPickerLockActive(lockColorMenuOpen);
}

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

function onZoomChangeFromControls(e) {
  if (!orbit.enableZoom) return;
  // console.log(e);
  let currentZoomFromCamera =
    camera.position.distanceTo(currentFocusPoint.position) || undefined;
  let currentPercentage =
    ((currentZoomFromCamera - zoomLimit.min) / zoomLimit.min) * 100;
  let result = 100 - currentPercentage;
  if (result < 0) result = 0;
  zoomSlider.value = result;
}

function onZoomChangeFromSlider(e) {
  let {
    target: { value },
  } = e || undefined;
  if (!value) return;
  value /= 100;

  let currentDistance = camera.position.distanceTo(currentFocusPoint.position);
  const desiredMovement = zoomLimit.max - zoomLimit.min * value;
  camera.position.lerpVectors(
    currentFocusPoint.position,
    camera.position,
    desiredMovement / currentDistance
  );
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

function onMouseDown(event) {
  if (displayingHelp) {
    setHelpScreen(false);
  }
  mouseDown = true;
  let click = getVector(event, true);
  dragOrigin = { ...click };

  raycaster.setFromCamera(click, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  let isObjectSelected = false;
  let isMaterialSelected = false;
  let isAnimationSelected = false;

  for (let intersect of intersects) {
    if (isObjectSelected && isMaterialSelected) break;

    if (!intersect.object.visible) continue;

    if (intersect.object.material && !isMaterialSelected) {
      setColorMenu(intersect.object.material);
      isMaterialSelected = true;
    }

    if (interactives.indexOf(intersect.object.name) >= 0) {
      selectedObject = intersect.object;
      orbit.enableRotate = false;
      isObjectSelected = true;
    }
  }

  checkColorPickerLock(event);
}

function onMouseUp() {
  selectedObject = {};
  orbit.enableRotate = true;
  mouseDown = false;
}

function onMouseDrag(event) {
  if (!mouseDown || !selectedObject.name) return;
  dragPoint = getVector(event, true);

  if (selectedObject.userData.limit.rotation) {
    handleRotation(event);
  }
  render();
}

function loadModel(gltf) {
  const model = gltf.scene;
  scene.add(model);
  mixer = new THREE.AnimationMixer(model);
  const clips = gltf.animations;

  clips.forEach((clip) => {
    Object.entries(animations).forEach(([objectName, objectAnimations]) => {
      if (
        objectAnimations &&
        Object.keys(objectAnimations).indexOf(clip.name) > -1
      )
        return (animations[objectName][clip.name] = mixer.clipAction(clip));
    });
  });

  model.children.forEach((obj) => {
    if (obj.name.indexOf("camera") > -1) return cameras.push(obj);
    if (obj.name.indexOf("focus") > -1) return focusPoints.push(obj);
    if (obj.name.indexOf("hidden") > -1 || !obj.userData.group) {
      console.log("Needs Group ID to be visible");
      return (obj.visible = false);
    }

    if (obj.userData.type === "rotate" && interactivesMap[obj.name]) {
      obj.userData.limit = { ...interactivesMap[obj.name] };
      obj.userData.update = () =>
        obj.position.clamp(obj.userData.limit.min, obj.userData.limit.max);
    }
    objects.push(obj);
  });

  highlightObject("focus1");
  camera.position.copy(cameras[0].position);
  orbit.update();
}

function moveCamera(direction) {
  let next = direction === "next";
  const newCameraPosition = (function () {
    if (currentCameraPosition >= cameras.length - 1 && next) return 0;
    if (currentCameraPosition < 1 && !next) return cameras.length - 1;

    return next ? currentCameraPosition + 1 : currentCameraPosition - 1;
  })();

  const newCamera = cameras[newCameraPosition];
  const newFocusPoint = focusPoints[newCameraPosition];

  camera.position.copy(newCamera.position);
  if (newFocusPoint) {
    orbit.target.copy(newFocusPoint.position);
    highlightObject(newFocusPoint.name);
  }
  currentCameraPosition = newCameraPosition;
  orbit.update();
}

function onWindowResize() {
  camera.aspect = threeCanvasDiv.offsetWidth / threeCanvasDiv.offsetHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(threeCanvasDiv.offsetWidth, threeCanvasDiv.offsetHeight);
}

function setHelpScreen(value) {
  let classToggle = "helpItemHidden";
  document.querySelectorAll(".helpItem").forEach((elem) => {
    if (value === true) return elem.classList.remove(classToggle);
    elem.classList.add(classToggle);
  });
  displayingHelp = value;
}

function highlightObject(focusPointName) {
  let focus = scene.getObjectByProperty("name", focusPointName);
  if (focus) currentFocusPoint = focus;
  let newObjectGroup = "";
  let isAnimationSelected = false;
  let isMaterialSelected = false;
  objects.forEach((obj) => {
    if (obj.userData.focus === focusPointName) {
      if (newObjectGroup === "" && obj.userData?.group)
        newObjectGroup = obj.userData.group;
      if (obj?.userData?.group && animations[obj.userData.group]) {
        setAnimationButton(true, animations[obj.userData.group]);
        isAnimationSelected = true;
      }
      if (!isMaterialSelected && obj.material) setColorMenu(obj.material);
      return (obj.visible = true);
    }
    obj.visible = false;
  });
  if (!isAnimationSelected) setAnimationButton(false, undefined);
}

function handleRotation(e) {
  // https://tympanus.net/codrops/2019/10/14/how-to-create-an-interactive-3d-character-with-three-js/
  // var mousecoords = {x: e.clientX, y: e.clientY}
  var mousecoords = getVector(e);
  moveJoint(mousecoords, selectedObject, 30);
  // const {_x:x, _y:y, _z:z} = selectedObject.rotation;
  // console.log("rotation", x, y, z);
  // const {x:xLimit, y:yLimit, z:zLimit} = selectedObject.userData.limit.rotation;

  // const newLookAt = {...pointer, isVector3: true};

  // const outOfBounds = false;
  // if(outOfBounds) return;

  // console.log(pointer);

  // console.log(selectedObject);
  // // newLookAt.z = 0.2;

  // console.log(newLookAt);

  // selectedObject.lookAt(pointer);
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

function elementDrag(e) {
  e = e || window.event;
  // e.preventDefault();
  // calculate the new cursor position:
  let { x, y } = getVector(e);
  pos1 = pos3 - x;
  pos2 = pos4 - y;
  pos3 = x;
  pos4 = y;
  draggingElement.style.top = draggingElement.offsetTop - pos2 + "px";
  draggingElement.style.left = draggingElement.offsetLeft - pos1 + "px";
}

function closeDragElement() {
  // stop moving when mouse button is released:
  document.onpointerup = null;
  document.onpointermove = null;
}

// if ( OOI.head && OOI.sphere && conf.turnHead ) {

//   // turn head
//   OOI.sphere.getWorldPosition( v0 );
//   OOI.head.lookAt( v0 );
//   OOI.head.rotation.set( OOI.head.rotation.x, OOI.head.rotation.y + Math.PI, OOI.head.rotation.z );

// }

// const calculateAxisRotation = (dragPointValue, dragOriginValue, currentRotation, limit, offset) =>{

//   if(dragPointValue === dragOriginValue )
//     return 0;

// if(currentRotation + offset > limit)
// return 0;

//   if(dragPointValue > dragOriginValue)
//     return offset;

//   else if(dragPointValue < dragOriginValue)
//    return - offset;
// }

// const newXRotation = calculateAxisRotation(dragPoint.x, dragOrigin.x, x, xLimit, 0.02 );
// const newYRotation = calculateAxisRotation(dragPoint.y, dragOrigin.y, y, yLimit, 0.02 );
// const newZRotation = calculateAxisRotation(dragPoint.z, dragOrigin.z, z, zLimit, 0.02 );

// selectedObject.rotateX(newXRotation);
// selectedObject.rotateY(newYRotation);
// selectedObject.rotateZ(newZRotation);

function getMouseDegrees(x, y, degreeLimit) {
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

function moveJoint(mouse, joint, degreeLimit) {
  let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
  // joint.rotation.x = THREE.MathUtils.degToRad(degrees.x);
  joint.rotation.y = THREE.MathUtils.degToRad(degrees.x);
  joint.rotation.z = THREE.MathUtils.degToRad(degrees.y);
}

function setColorMenu(material) {
  selectedMaterial = material;
  metalSlider.value = material.metalness * 100;
  roughSlider.value = material.roughness * 100;
  let currentHexColor = material.color.getHexString();
  updateColorPicker(`#${currentHexColor}`);
  setCopyMaterialButtonActive(true);
  updateColorPickerButton(`#${currentHexColor}`);
}

function setAnimationButton(active, animationsMap) {
  if (!active) {
    playAnimationButton.classList.remove("playAnimationButtonActive");
    playAnimationButton.enabled = false;
    return;
  }

  playAnimationButton.onclick = () => {
    Object.values(animationsMap).forEach((clip) => {
      if (clip?.play) {
        clip.setLoop(THREE.LoopOnce).play().reset();
      }
    });
  };
  playAnimationButton.classList.add("playAnimationButtonActive");
  playAnimationButton.enabled = true;
}

function setMaterialColor(material, colorValue) {
  const hexColor = convertColorToHex(colorValue);
  if (!hexColor) return;
  updateColorPickerButton(hexColor);
  if (!("color" in material)) return;
  material.color.set(hexColor);
}

function setMaterialMetalness(event) {
  let value = event.target.value;
  if (!value || !("metalness" in selectedMaterial)) return;
  selectedMaterial.metalness = value / 100;
}

function setMaterialRoughness(event) {
  let value = event.target.value;
  if (!value || !("roughness" in selectedMaterial)) return;
  selectedMaterial.roughness = value / 100;
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

function convertColorToHex(string) {
  if (string.indexOf("#") > -1) return string;

  let value = string
    .replaceAll(" ", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("%", "")
    .replaceAll("rgb", "")
    .replaceAll("hsl", "");

  let rgb;

  if (string.indexOf("rgb") > -1) {
    rgb = value.split(",");
  }

  if (string.indexOf("hsl") > -1) {
    let [h, s, l] = value.split(",");
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    rgb = [r, g, b];
  }

  if (!rgb || !rgb[2]) return undefined;

  var hex = rgb.map(function (x) {
    x = parseInt(x).toString(16);
    return x.length == 1 ? "0" + x : x;
  });
  return "#" + hex.join("");
}
