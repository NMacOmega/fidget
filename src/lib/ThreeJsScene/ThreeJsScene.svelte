<script lang="ts">
	import { browser } from '$app/environment';
	import { get } from 'svelte/store';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
	import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
	import { onMount } from 'svelte';

	import {
		cameraStore,
		sceneStore,
		orbitStore,
		canvasStore,
		animationsStore,
		cameraPositionsStore,
		focalPositionsStore,
		sceneObjectsStore,
		sceneInteractionsStore,
		zoomStore
	} from '$lib/stores';

	import { highlightFidget, onMouseDown, onMouseUp, onMouseDrag } from './ThreeJsScene';
	const modelURL = import.meta.env.DEV
		? '/models/fidgetgallery.glb'
		: '/fidget/static/models/fidgetgallery.glb';

	let cameraPositions = [],
		focalPositions = [],
		objects = {};

	let threeCanvas: HTMLCanvasElement;
	let onWindowResize = () => {};

	if (browser) {
		let camera: THREE.PerspectiveCamera;
		let orbit: OrbitControls;
		let scene: THREE.Scene;

		let environment: RoomEnvironment;
		let pmremGenerator: THREE.PMREMGenerator;
		let renderer: THREE.WebGLRenderer;
		let loader: GLTFLoader;
		let mixer: THREE.AnimationMixer;
		let clock: THREE.Clock;

		const getAspectRatio = (width, height) => {
			let aspect = (width / height) * 2;
			return aspect;
		};

		const init = () => {
			scene = new THREE.Scene();
			scene.background = null;
			const { height = 0, width = 0 } = threeCanvas.getBoundingClientRect();
			camera = new THREE.PerspectiveCamera(75, getAspectRatio(width, height), 0.1, 1000);
			renderer = new THREE.WebGL1Renderer({ antialias: true, canvas: threeCanvas, alpha: true });
			environment = new RoomEnvironment();
			pmremGenerator = new THREE.PMREMGenerator(renderer);
			scene.environment = pmremGenerator.fromScene(environment).texture;
			renderer.setSize(window.innerWidth, window.innerHeight);
			clock = new THREE.Clock();
			orbit = new OrbitControls(camera, threeCanvas);
			orbit.maxDistance = zoomStore.limit.max;
			orbit.minDistance = zoomStore.limit.min;
			orbit.enablePan = false;

			orbit.addEventListener('change', () => {
				zoomStore.setFromOrbit();
			});

			cameraStore.init(camera);
			sceneStore.init(scene);
			orbitStore.init(orbit);
			canvasStore.set(threeCanvas);

			loader = new GLTFLoader();
			loader.load(modelURL, processModel, undefined, onModelError);
		};

		const processModel = (gltf: GLTF) => {
			let animationsMap = get(animationsStore);
			const sceneInteractions = get(sceneInteractionsStore);

			const model = gltf.scene;
			scene.add(model);
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
				let { name } = obj;
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
				objects[obj.uuid] = obj;
			});

			sceneObjectsStore.init(objects);
			cameraPositionsStore.init(cameraPositions);
			focalPositionsStore.init(focalPositions);
			animationsStore.init(animationsMap);

			onModelReady();
		};

		const onModelReady = () => {
			let startingPosition = cameraPositions[0]?.position;
			if (startingPosition) camera.position.copy(startingPosition);
			orbit.update();
			highlightFidget('focus1');
		};

		const onModelError = (error: ErrorEvent) => {
			console.log(error);
		};

		const render = () => {
			if (mixer) mixer.update(clock.getDelta());
			renderer.clear();
			renderer.render(scene, camera);
		};

		const animate = () => {
			requestAnimationFrame(animate);
			render();
		};

		onWindowResize = () => {
			const { height = 0, width = 0 } = threeCanvas.getBoundingClientRect();
			const aspectRatio = getAspectRatio(width, height);
			camera.aspect = aspectRatio;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
		};

		onMount(() => {
			init();
			onWindowResize();
			animate();
		});
	}
</script>

<svelte:window on:resize={onWindowResize} on:mouseup={onMouseUp} />
<canvas
	id="threeCanvas"
	class="canvas"
	on:pointerdown={onMouseDown}
	on:pointermove={onMouseDrag}
	bind:this={threeCanvas}
/>

<style>
	.canvas {
		width: 100% !important;
		max-height: 100%;
		height: 100% !important;
	}
</style>
