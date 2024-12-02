<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	let thisElement: HTMLElement,
		isInteractionCaptured = false;
	export let h = 0,
		s = 0,
		v = 0;
	//CSS Variables
	let leftOffset = 0,
		topOffset = 0;
	let baseColor, flatColor;

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
	 * @param saturation current HSV saturation, taken from HSV store by default
	 * @param value current HSV value, taken from HSV store by default
	 * @void updates the left and top properties of the marker element
	 */
	export const updateOffset = (saturation = s, value = 100 - v) => {
		leftOffset = clamp(saturation, 95.5, -6.5);
		topOffset = clamp(value, 95.5, -6.5);
	};

	function onMouseInteraction(e: MouseEvent) {
		updateSaturationAndValue(e.clientX, e.clientY);
	}

	function onTouchInteraction(e: TouchEvent) {
		if (!isInteractionCaptured) return;
		e.stopPropagation();
		e.preventDefault();
		updateSaturationAndValue(e.touches[0].clientX, e.touches[0].clientY);
	}

	function updateSaturationAndValue(clientX: number, clientY: number) {
		if (!isInteractionCaptured || !thisElement) return;
		if (clientX < 0 || clientY < 0) return;
		const { top, left, width, height } = thisElement.getBoundingClientRect();
		const leftPoint = ((clientX - left) / width) * 100;
		const topPoint = ((clientY - top) / height) * 100;

		const saturation = clamp(leftPoint, 100, 0.0001);
		const value = clamp(100 - topPoint, 100, 0.0001);
		updateOffset(leftPoint, topPoint);
		dispatch('newHSV', { value: { h, s: saturation, v: value } });
	}

	$: baseColor = `hsl(${h}, ${s}%, ${v}%)`;
	$: flatColor = `hsl(${h}, 100%, 50%)`;
	updateOffset(); //For Positioning the icon at render, may need a delay;
</script>

<svelte:window
	on:mousemove={onMouseInteraction}
	on:touchmove|nonpassive={onTouchInteraction}
	on:mouseup={() => (isInteractionCaptured = false)}
	on:touchend={() => (isInteractionCaptured = false)}
/>
<div
	class="colorArea"
	style:--left={`${leftOffset}%`}
	style:--top={`${topOffset}%`}
	style:--color={baseColor}
	style:--flatcolor={flatColor}
	on:mousedown={(e) => {
		isInteractionCaptured = true;
		onMouseInteraction(e);
	}}
	on:touchstart={(e) => {
		isInteractionCaptured = true;
		onTouchInteraction(e);
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
