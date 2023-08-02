import { Raycaster } from 'three';
import { canvas, camera, scene} from '$lib/stores';
import {get} from 'svelte/store';

export function getPickPosition(event) {
	const c = get(canvas);
	const pos = getCanvasRelativePosition(event);
	return {x: (pos.x / c.clientWidth) * 2 - 1, 
		y:(pos.y / c.clientHeight) * -2 + 1 // note we flip Y
	};
}

export function pickObjectFromPosition(normalizedPosition) {
	const cam = get(camera);
	const raycaster = new Raycaster();
	raycaster.setFromCamera(normalizedPosition, cam);
	const intersectedObjects = raycaster.intersectObjects(get(scene).children);

	for (const intersect of intersectedObjects) {
		// Pick the first visible object hit
		if (intersect.object.visible) return intersect.object;
	}
	return undefined;
}

export function getCanvasRelativePosition(event) {
	const c = get(canvas);
	const rect = c.getBoundingClientRect();
	return {
		x: ((event.clientX - rect.left) * c.clientWidth) / rect.width,
		y: ((event.clientY - rect.top) * c.clientHeight) / rect.height
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
