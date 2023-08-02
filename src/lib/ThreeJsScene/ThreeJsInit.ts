
	import { get } from 'svelte/store';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
	import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';

	import {
		scene,
		canvas,
		animations,
		sceneObjects,
        sceneHighlights,
		interactions,
		zoom,
        highlightFidget
	} from '$lib/stores';

    import { camera, orbit } from '$lib/stores';

    let threeCamera: THREE.PerspectiveCamera;
    let threeOrbit: OrbitControls;
    let threeScene: THREE.Scene;
    let environment: RoomEnvironment;
    let pmremGenerator: THREE.PMREMGenerator;
    let renderer: THREE.WebGLRenderer;
    let loader: GLTFLoader;
    let mixer: THREE.AnimationMixer;
    let clock: THREE.Clock;


    export function init (canvasElem: HTMLCanvasElement, modelURL: string){
        threeScene = new THREE.Scene();
        threeScene.background = null;
        const { height = 0, width = 0 } = canvasElem.getBoundingClientRect();
        threeCamera = new THREE.PerspectiveCamera(75, getAspectRatio(width, height), 0.1, 1000);
        renderer = new THREE.WebGL1Renderer({ antialias: true, canvas: canvasElem, alpha: true });
        environment = new RoomEnvironment();
        pmremGenerator = new THREE.PMREMGenerator(renderer);
        threeScene.environment = pmremGenerator.fromScene(environment).texture;
        renderer.setSize(window.innerWidth, window.innerHeight);
        clock = new THREE.Clock();
        threeOrbit = new OrbitControls(threeCamera, canvasElem);
        threeOrbit.maxDistance = zoom.limit.max;
        threeOrbit.minDistance = zoom.limit.min;
        threeOrbit.enablePan = false;

        threeOrbit.addEventListener('change', () => {
            zoom.setFromOrbit();
        });

        scene.init(threeScene);
        orbit.set(threeOrbit);
        canvas.set(canvasElem);

        loader = new GLTFLoader();
        loader.load(modelURL, loadModel, undefined, onModelError);
    }



    function loadModel(gltf: GLTF){
        const highlightsMap = {
            'cubeBase': 'focus1',
            'sphereBase' : 'focus2',
            'baseInner': 'focus3'
        }, highlightsObject = {};
        
        let cameraPositions = [],
		focalPositions = [],
		objects = {};

        let animationsMap = get(animations);
        const sceneInteractions = get(interactions);

        const model = gltf.scene;
        threeScene.add(model);
        mixer = new THREE.AnimationMixer(model);
        const clips = gltf.animations;

        clips.forEach((clip) => {
            Object.entries(animationsMap).map(([obj, objAnims]) => {
                if (objAnims && Object.keys(objAnims).includes(clip.name)) {
                    animationsMap[obj][clip.name] = mixer.clipAction(clip);
                }
            });
        });

        model.children.forEach((obj) => {
            let { name, uuid } = obj;
            let action = obj.userData.type;
            let isVisibleInScene = obj?.userData?.group;

            if (name.includes('camera')) return cameraPositions.push(obj);
            if (name.includes('focus')) return focalPositions.push(obj);
            if (name.includes('hidden') || !isVisibleInScene) return (obj.visible = false);

            if (action === 'rotate' && sceneInteractions[name]) {
                obj.userData.limit = { ...sceneInteractions[name] };
                obj.userData.update = () =>
                    obj.position.clamp(obj.userData.limit.min, obj.userData.limit.max);
            }
            if(highlightsMap[name]) highlightsObject[highlightsMap[name]] = uuid;
            objects[obj.uuid] = obj;
        });

        camera.init(threeCamera, cameraPositions, focalPositions);
        sceneObjects.init(objects);
        animations.init(animationsMap);
        sceneHighlights.init(highlightsObject);

        let startingPosition = cameraPositions[0]?.position;
        if (startingPosition) threeCamera.position.copy(startingPosition);
        threeOrbit.update();
        highlightFidget('focus1');
    }



		function onModelError (error: ErrorEvent) {
			console.log(error);
		};

		function render () {
			if (mixer) mixer.update(clock.getDelta());
			renderer.clear();
			renderer.render(threeScene, threeCamera);
		};

		export function animate() {
			requestAnimationFrame(animate);
			render();
		};

		export function onWindowResize(canvas: HTMLCanvasElement) {
			const { height = 0, width = 0 } = canvas.getBoundingClientRect();
			const aspectRatio = getAspectRatio(width, height);
			threeCamera.aspect = aspectRatio;
			threeCamera.updateProjectionMatrix();
			renderer.setSize(width, height);
		};

        function getAspectRatio(width: number, height: number){
            //Was set to multiply by 2, not sure why
            const aspect = (width / height) * 1;
            return aspect;
    
        }