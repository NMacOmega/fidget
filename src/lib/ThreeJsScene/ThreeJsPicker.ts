import { Raycaster } from 'three';
import { canvasStore, cameraStore, sceneStore} from '$lib/stores';
import {get} from 'svelte/store';

export function getPickPosition(event) {
	const canvas = get(canvasStore);
	const pos = getCanvasRelativePosition(event);
	return {x: (pos.x / canvas.clientWidth) * 2 - 1, 
		y:(pos.y / canvas.clientHeight) * -2 + 1 // note we flip Y
	};
}

export function pickObjectFromPosition(normalizedPosition) {
	const camera = get(cameraStore);
	const scene = get(sceneStore);
	const raycaster = new Raycaster();
	raycaster.setFromCamera(normalizedPosition, camera);
	const intersectedObjects = raycaster.intersectObjects(scene.children);

	for (const intersect of intersectedObjects) {
		// Pick the first visible object hit
		if (intersect.object.visible) return intersect.object;
	}
	return undefined;
}

export function getCanvasRelativePosition(event) {
	const canvas = get(canvasStore);
	const rect = canvas.getBoundingClientRect();
	return {
		x: ((event.clientX - rect.left) * canvas.clientWidth) / rect.width,
		y: ((event.clientY - rect.top) * canvas.clientHeight) / rect.height
	};
}


export function clearPickPosition() {
	//Should move this to the pick position as an overloaded store




	// unlike the mouse which always has a position
	// if the user stops touching the screen we want
	// to stop picking. For now we just pick a value
	// unlikely to pick something
	// globals.pickPosition =
	// 	{x: -100000, y: -100000};
}
