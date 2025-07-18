import { Raycaster, Vector2 } from 'three';
import { canvas, scene} from '$stores/threeJSObjectStores';
import { camera } from '$stores/camera';
import {get} from 'svelte/store';


/**
 * Returns the coordinates of the click position of the mouse over the 
 * canvas stored in {@link canvas}
 * @param event a mouse click event
 * @returns  threeJS {@link Vector2} of the click event
 */
export function getPickPosition(event: MouseEvent) {
	const c = get(canvas);
	const pos = getCanvasRelativePosition(c, event);
	// return {x: (pos.x / c.clientWidth) * 2 - 1, 
	// 	y:(pos.y / c.clientHeight) * -2 + 1 // note we flip Y
	// };
	return new Vector2(
		    (pos.x / c.clientWidth) * 2 - 1,
		   (pos.y / c.clientHeight) * -2 + 1 // note we flip Y);
	)
		}

/**
 * Queries the threeJS scene where {@link camera} exists and checks if there is an object
 * located at the coordinates provided 
 * @param normalizedPosition x and y coordinates to pick an object from
 * @returns an {@link Object3D} if one is found or undefined if nothing is there
 */
export function pickObjectFromPosition(normalizedPosition: Vector2) {
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

/**
 * Given the HTMLCanvasElement and a mouse click event, 
 * calculates the location of the click relative to bounding rect of the canvas
 * @param canvas the HTMLCanvas
 * @param event the mouse click event
 * @returns x and y coordinates of the event
 */
export function getCanvasRelativePosition(canvas:HTMLCanvasElement, event:MouseEvent) {
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
