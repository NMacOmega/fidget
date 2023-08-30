<script lang="ts">
	import { hsv, hex, selectedUUID } from '$stores/material';
	let element: HTMLElement,
		isMouseCaptured = false;

	//CSS Variables
	let leftOffset = 0,
		topOffset = 0;
	const clamp = (num: number, max: number, min: number) => Math.min(Math.max(num, min), max);

	const updateOffset = (
		_optionalTrigger: typeof $selectedUUID | null,
		s = $hsv.s,
		v = 1 - $hsv.v
	) => {
		s *= 100;
		v *= 100;
		leftOffset = clamp(s, 95.5, -6.5);
		topOffset = clamp(v, 95.5, -6.5);
	};

	const updateSaturationAndValueOnClick = (
		e: MouseEvent & {
			currentTarget: (EventTarget & HTMLDivElement) | Window;
		}
	) => {
		if (!isMouseCaptured || !element) return;
		const { clientX, clientY } = e;
		const { top, left, width, height } = element.getBoundingClientRect();

		const leftPoint = (clientX - left) / width;
		const topPoint = (clientY - top) / height;

		const s = clamp(leftPoint, 1, 0);
		const v = clamp(1 - topPoint, 1, 0.0001);
		updateOffset(null, leftPoint, topPoint);
		$hsv = { h: $hsv.h, s, v };
	};
	$: updateOffset($selectedUUID);
</script>

<svelte:window
	on:mousemove={(e) => updateSaturationAndValueOnClick(e)}
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
	bind:this={element}
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
