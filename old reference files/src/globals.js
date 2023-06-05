let selectedObject = {},
  selectedMaterial = {},
  currentFocusPoint = {},
  activeAnimations = {}, //Keeps track of which animations are active now
  draggingElement = {}, //the element we will move one at a time
  materialClipboard = {}; //Used to store color; metalic; and roughness

let colorPickerSet = {};

let mouseDown = false,
  lockColorMenuOpen = false,
  draggingEnabled = false,
  displayingHelp = false;

let currentCameraPosition = 0,
  pos1 = 0,
  pos2 = 0,
  pos3 = 0,
  pos4 = 0; //For Element Dragging;

let objects = [],
  cameras = [],
  focusPoints = [],
  cameraLimits = [];

//THREEJS Variables
let three,
  scene,
  renderer,
  environment,
  pmremGenerator,
  camera,
  orbit,
  raycaster,
  dragPoint,
  dragOrigin,
  clock,
  canvas,
  mixer,
  pickHelper;

const interactivesMap = {
  joystick: {
    rotation: {
      min: 10,
      max: 10,
    },
  },
};

const interactives = Object.keys(interactivesMap);

const zoomLimit = { max: 10, min: 5 };

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

let pickPosition = { x: 0, y: 0 };

const elementTargets = {
  colorPasteSwatch: "#colorPasteSwatch",
  colorPicker: "#colorPicker",
  colorPickerLockButton: "#colorPickerLockButton",
  colorPickerOpenButton: "#colorOpenButton",
  copyPropsButton: "#copyPropsButton",
  enableDragbutton: "#dragToggle",
  helpButton: "#helpButton",
  lockButtonSpan: "#colorLockSpan",
  materialsMenu: "#materialsMenu",
  metalPasteSwatch: "#metalPasteSwatch",
  metalSlider: "#metalSlider",
  nextNavButton: "#nextNavButton",
  pasteProps: ".pasteProps",
  pastePropsButton: "#pastePropsButton",
  pastePropsIcon: "#pastePropsIcon",
  playAnimationButton: "#playAnimationButton",
  prevNavButton: "#prevNavButton",
  roughPasteSwatch: "#roughPasteSwatch",
  roughSlider: "#roughSlider",
  resetDragButton: "#resetDrag",
  zoomSlider: "#zoomSlider",
};

const elements = Object.entries(elementTargets).reduce((acc, [name, id]) => {
  return { ...acc, [name]: document.querySelector(id) };
}, {});

const {
  colorPicker,
  lockButtonSpan,
  pastePropsIcon,
  colorPasteSwatch,
  metalPasteSwatch,
  roughPasteSwatch,
  pasteProps,
  playAnimationButton,
  colorPickerOpenButton,
  colorPickerLockButton,
  metalSlider,
  roughSlider,
  zoomSlider,
  prevNavButton,
  nextNavButton,
  materialsMenu,
  enableDragbutton,
  resetDragButton,
  copyPropsButton,
  pastePropsButton,
  helpButton,
} = elements;
