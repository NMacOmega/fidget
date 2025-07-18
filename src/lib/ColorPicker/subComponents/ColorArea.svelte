<script lang="ts">
	import { selectedUUID } from '$stores/threeJSObjectStores';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	let thisElement: HTMLElement,
		isMouseCaptured = false;

	//CSS Variables
	let leftOffset = 0,
		topOffset = 0;

	/**
	 * Utility function to clamp a number between the provieded max and min values
	 * @param num will return this if it is min > num < max
	 * @param max returns this if num is larger
	 * @param min returns this if num is less
	 * @returns min > num < max
	 */
	const clamp = (num: number, max: number, min: number) => Math.min(Math.max(num, min), max);

	/**
	 * Moves the marker to x,y coordinates that match saturation and value from HSV.
	 *
	 * Clamps the values to allow some margin to run outside of it's border
	 *
	 * exported to enable triggering by parrent
	 * @param _optionalTrigger used to trigger this action when a variable changes
	 * @param s current HSV saturation, taken from HSV store by default
	 * @param v current HSV value, taken from HSV store by default
	 * @void updates the left and top properties of the marker element
	 */
	export const updateOffset = (
		_optionalTrigger: typeof $selectedUUID | null,
		s = $hsv.s,
		v = 100 - $hsv.v
	) => {
		leftOffset = clamp(s, 95.5, -6.5);
		topOffset = clamp(v, 95.5, -6.5);
	};

	/**
	 * When mouse click occurs, takes the location of the click relative to color area
	 * and converts into HSV saturation and value parameters.
	 *
	 * Updates the HSV store with the results.
	 * @param e the mouse click event
	 * @shortcircuits-if
	 * - global isMouseCaptures is false, and we are thus not listening for events on this element
	 * - There is no detected colorArea element in the DOM to measure
	 * @void updates HSV store with new S and V from marker location
	 */
	const updateSaturationAndValueOnClick = (
		e: MouseEvent & {
			currentTarget: (EventTarget & HTMLDivElement) | Window;
		}
	) => {
		if (!isMouseCaptured || !thisElement) return;
		const { clientX, clientY } = e;
		const { top, left, width, height } = thisElement.getBoundingClientRect();
		const leftPoint = ((clientX - left) / width) * 100;
		const topPoint = ((clientY - top) / height) * 100;

		const s = clamp(leftPoint, 100, 0.0001);
		const v = clamp(100 - topPoint, 100, 0.0001);
		updateOffset(null, leftPoint, topPoint);
		dispatch('colorAreaChange', { value: { h: $hsv.h, s, v } });
	};
</script>

<svelte:window
	on:mousemove={updateSaturationAndValueOnClick}
	on:mouseup={() => (isMouseCaptured = false)}
/>
<div
	class="colorArea"
	style:--left={`${leftOffset}%`}
	style:--top={`${topOffset}%`}
	style:--color={$hex}
	style:--flatcolor={`hsl(${$hsv.h || '0'}, 100%, 50%)`}
	on:mousedown={(e) => {
		isMouseCaptured = true;
		updateSaturationAndValueOnClick(e);
	}}
	bind:this={thisElement}
>
	<div class="colorMarker" />
</div>

<style>
	.colorArea {
		position: relative;
		width: 95%;
		margin: auto;
		height: 100px;
		background-image: linear-gradient(rgba(0, 0, 0, 0), #000),
			linear-gradient(90deg, #fff, 44%, var(--flatcolor));
	}

	.colorMarker {
		position: absolute;
		border: 1px solid #fff;
		border-radius: 50%;
		cursor: pointer;
		left: var(--left, 0);
		top: var(--top, 0);
		width: 12px;
		height: 12px;
		background-color: var(--color);
	}
</style>
