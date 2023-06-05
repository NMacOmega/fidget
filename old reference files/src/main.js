import * as THREE from "https://unpkg.com/three/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "https://unpkg.com/three/examples/jsm/environments/RoomEnvironment.js";

// Mobile Optimizations, especially with breakpoints
//Locking color picker causes problems on mobile
//Exposes imported functions when using multiple scripts
three = THREE;

let modelUrl = `${import.meta.env.DEV ? "" : "/fidget/"}/fidgetgallery.glb`;

Coloris &&
  Coloris.setInstance(".colorPicker", {
    theme: "polaroid",
    themeMode: "dark",
    alpha: false,
    formatToggle: true,
    swatches: ["#264653", "#2a9d8f", "#e9c46a"],
  });

scene = new THREE.Scene();
scene.background = null;
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
environment = new RoomEnvironment();
pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(environment).texture;

canvas = document.querySelector("#app");
canvas.appendChild(renderer.domElement);

camera = new THREE.PerspectiveCamera(
  75,
  canvas.offsetWidth / canvas.offsetHeight,
  0.1,
  1000
);

orbit = new OrbitControls(camera, renderer.domElement);
orbit.maxDistance = zoomLimit.max;
orbit.minDistance = zoomLimit.min;
orbit.enablePan = false;

renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(0x000000, 0);

clearPickPosition();

function render() {
  if (mixer) {
    mixer.update(clock.getDelta());
  }
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(render); //Needed for animations

raycaster = new THREE.Raycaster();
dragPoint = new THREE.Vector2();
dragOrigin = new THREE.Vector2();
clock = new THREE.Clock();

let loader = new GLTFLoader();
loader.load(modelUrl, loadModel, undefined, function (error) {
  console.log(error);
});

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

  //Needed here because model loading is asyncronous
  camera.position.copy(cameras[0].position);
  orbit.update();

  addEventListeners();
  enableDragHandleControls();

  //Focus on the first object
  highlightObject("focus1");
}
