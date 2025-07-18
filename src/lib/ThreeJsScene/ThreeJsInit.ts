
    import { get } from 'svelte/store';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
	import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
    import { sceneObjects, sceneDefaultMaterials, canvas, scene as sceneStore, sceneHighlights, highlightFidget, interactions} from '$stores/threeJSObjectStores';
    import { camera as cameraStore, orbit as orbitStore, zoom as zoomStore } from '$stores/camera';
    import { animations } from '$stores/animation';
    import { materialsOptionsStore, initializeCurrentMaterialOptions } from '$stores/materialList';
    import type { SceneObjects, SceneHighlights, SceneDefaultMaterials} from '$types';
    import {fidgetReference, defaultMaterialOptions } from '$stores/threeJSObjectStores';
    
    //These global variables store theeJS elements needed across intialization, render, and animate
    let threeScene: THREE.Scene;
    let threeCamera: THREE.PerspectiveCamera;
    let threeRenderer: THREE.WebGLRenderer;
    let threeMixer: THREE.AnimationMixer;
    const clock = new THREE.Clock();

    /**
     * Loads model at provided URL into threeJS. 
     * 
     * If successful, the scene is built and connected to provided canvas element,
     * 
     * otherwise, prints an error
     * @param canvasElem The canvas element on the page
     * @param modelURL Where the model file is located
     * @void calls {@link onModelSuccess} if successful
     * 
     * calls {@link onModelFail} if failed
     */
    export function initializeThreeJSSceneFromModelURL(canvasElem: HTMLCanvasElement, modelURL: string, bgColorHex: string, bgAlpha: number){
        new GLTFLoader().load(modelURL, 
            (gltf)=>onModelSuccess(gltf, canvasElem, bgColorHex, bgAlpha), 
            undefined, //No callback while loading has been made
            (error)=>onModelFail(canvasElem, error));
    }

    /**
     * Builds a threeJS scene from the loaded GLTF instance and connects it to the provided canvas element.
     * 
     * Also sets the background color and opacity, if optional {@link bgColorHex} or {@link bgAlpha} are not provided, 
     * the background will be transparent.
     * 
     * esential threeJS components asre saved in global stores for later use.
     * @param gltf The loaded GLTF Model
     * @param canvasElem The Canvas element to build scene on
     * @param bgColorHex An optional color string for the background, format #000000
     * @param bgAlpha An optional opacity for the background
     * @void 
     * 
     * Builds Scene and connects to {@link canvasElem}
     * 
     * Stores ready components to the following stores:
     * - {@link sceneStore scene}
     * - {@link sceneObjects}
     * - {@link sceneHighlights}
     * - {@link canvas}
     * - {@link cameraStore camera}
     * - {@link orbitStore orbit}
     * - {@link animations}
     */
    function onModelSuccess(gltf: GLTF, canvasElem: HTMLCanvasElement, bgColorHex: string, bgAlpha: number){
        //scene
        const scene = new THREE.Scene();
        scene.add(gltf.scene);
        //camera
        const { height = 0, width = 0 } = canvasElem.getBoundingClientRect();
        const camera = new THREE.PerspectiveCamera(75, calcAspectRatio(width, height), 0.1, 1000);
        //renderer
        const renderer = new THREE.WebGL1Renderer({ antialias: true, canvas: canvasElem, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        const validBGHex = parseHexValue(bgColorHex);
        const validBGAlpha = typeof(bgAlpha) === 'number' && bgAlpha > 0 && bgAlpha <= 1;
        if(validBGHex && validBGAlpha) renderer.setClearColor(new THREE.Color(validBGHex), bgAlpha);
        else renderer.setClearColor(0x000000, 0);
        //environemnt & pmrem
        const environment = new RoomEnvironment();
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        scene.environment = pmremGenerator.fromScene(environment).texture;
        //orbit controls
        const orbit = new OrbitControls(camera, canvasElem);
        orbit.maxDistance = zoomStore.limit.max;
        orbit.minDistance = zoomStore.limit.min;
        orbit.enablePan = false;
        orbit.addEventListener('change', () => {zoomStore.setFromOrbit();});
        //mixer for animations
        const mixer = new THREE.AnimationMixer(gltf.scene);
        
        //Extract objects, animations, and reference points for focus and cameras from the children of this model scene
        const animationActions:THREE.AnimationAction[] = gltf.animations.reduce((acc, clip)=>{return [...acc, mixer.clipAction(clip)]}, [] as THREE.AnimationAction[]);
        const interactionsMap = get(interactions)

        const cameras: THREE.Object3D[] = [];
        const focals: THREE.Object3D[] = [];
        const highlights: SceneHighlights = {};
        const objects: SceneObjects = {};
        const defaultMaterials: SceneDefaultMaterials = {};
        const initialMaterials = {};

        gltf.scene.children.forEach((obj) => {
            const { name } = obj;      
            if (name.includes('camera')) return cameras.push(obj);
            if (name.includes('focus')) return focals.push(obj);
            
            
            const isVisibleInScene = obj?.userData?.group;
            if (obj.name.includes('hidden') || !isVisibleInScene) return (obj.visible = false);

            const nameToHighlight = fidgetReference.lookup.byObjectName(name)?.name;
            if(nameToHighlight && obj.isMesh) highlights[nameToHighlight] = obj as THREE.Mesh; 
            
            const action = obj.userData.type;
            if (action === 'rotate' && interactionsMap[name]) {
                obj.userData.limit = { ...interactionsMap[name] };
                obj.userData.update = () =>
                    obj.position.clamp(obj.userData.limit.min, obj.userData.limit.max);
            }
            if(obj.isMesh) {
                objects[obj.uuid] = obj as THREE.Mesh;
                defaultMaterials[obj.uuid] = {
                    metalness: obj.material.metalness,
                    roughness: obj.material.roughness,
                    opacity: obj.material.opacity,
                    color: obj.material.color.getHexString()};
            }

            initialMaterials[obj.uuid] = {
                activeOption: 0, //option 0 is default
                options: [
                    {
                        metalness: obj.material.metalness*100,
                        roughness: obj.material.roughness*100,
                        opacity: obj.material.opacity*100,
                        color: obj.material.color.getHexString()
                    },
               ...defaultMaterialOptions
                ]
            }
        });

        //Store data in global stores
        sceneStore.init(scene);
        orbitStore.set(orbit);
        canvas.set(canvasElem);
        cameraStore.init(camera, cameras, focals);
        sceneObjects.init(objects);
        sceneDefaultMaterials.init(defaultMaterials);
        materialsOptionsStore.set(initialMaterials);
        sceneHighlights.init(highlights);
        animations.initFromActions(animationActions);

        //Store to local globals so we don't need to use get()
        threeScene = scene;
        threeCamera = camera;
        threeRenderer = renderer;
        threeMixer = mixer;
        
        //Set camera to position 0
        const startingPosition = cameras[0]?.position;
        if (startingPosition) camera.position.copy(startingPosition);

        //Tell THREEJS to refresh and focus on the initial focus point
        orbit.update();
        highlightFidget(get(fidgetReference.current).name);  
        initializeCurrentMaterialOptions();
        onWindowResize(canvasElem);
        animate();
    }

    /**
     * Consoles an error when failed
     * @param canvasElem 
     * @param error 
     */
    function onModelFail(canvasElem: HTMLCanvasElement, error: ErrorEvent){
        console.log(error);
    }

    /**
     * Queues a new frame render at the cuurrent frame by calling the render function
     * 
     * see {@link https://threejs.org/docs/#manual/en/introduction/Creating-a-scene threeJS animation tutorial}
     * @void calls render function
     */
    export function animate() {
        requestAnimationFrame(animate);
        render();
    };

    /**
     * Renders a new threeJS frame. see {@link https://threejs.org/docs/#api/en/renderers/WebGLRenderer threeJS / WebGLRenderers}
     * @void performs threeJS frame render
     */
    function render () {
        if (threeMixer) threeMixer.update(clock.getDelta());
        threeRenderer.clear();
        threeRenderer.render(threeScene, threeCamera);
    };

    /**
     * Calculates the aspect ratio from canvas dimensions when resized.
     * 
     * Updates the camera and renderer to match the aspect ratio.
     * @param canvas the Canvas element to measure
     * @void updates threeJS camera and renderer
     */
    export function onWindowResize(canvas: HTMLCanvasElement) {
        const { height = 0, width = 0 } = canvas.getBoundingClientRect();
        const aspectRatio = calcAspectRatio(width, height);
        threeCamera.aspect = aspectRatio;
        threeCamera.updateProjectionMatrix();
        threeRenderer.setSize(width, height);
    };

    /** 
     * Calculates the apect ration between width and height
     * @param width
     * @param height
     * @returns width / height
     */
    function calcAspectRatio(width: number, height: number){
            //Was set to multiply by 2, not sure why
            const aspect = (width / height) * 1;
            return aspect;
    
        }

    /**
 * Returns a string #000000 <-> #ffffff if the provided value is a valid hex color string.
 * - otherwise, returns undefined
 * @param {string} val a string value in hexidecimal format
 * @returns {string | undefined} The Hexadecimal result string or undefined if failed
 */
function parseHexValue(val: string) {
    if(val === undefined) return;
	let str = val.toString() || '';
	str = str.match(/[\dA-Fa-f]/g)?.join('') || '';
	if (str.length > 6) str = str.substring(0, 5);
	if (str.length === 3) str = `${str}${str}`;
	if (str.length === 6) return `#${str}`;
}