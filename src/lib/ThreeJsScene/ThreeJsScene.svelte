<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { init, animate, onWindowResize } from './ThreeJsInit';
	import { onMouseDown, onMouseUp, onMouseDrag } from './ThreeJsEvents';
	import { selectedUUID } from '$lib/stores';

	export let modelURL: string;

	let threeCanvas: HTMLCanvasElement;

	if (browser && modelURL) {
		onMount(() => {
			init(threeCanvas, modelURL);
			onWindowResize(threeCanvas);
			animate();
		});
	}
</script>

<svelte:window on:resize={() => onWindowResize(threeCanvas)} on:mouseup={onMouseUp} />
<canvas
	id="threeCanvas"
	class="canvas"
	on:pointerdown={onMouseDown}
	on:pointermove={onMouseDrag}
	bind:this={threeCanvas}
>
	<!-- Input Necessary to force renders when the active material changes -->
	<input type="hidden" bind:value={$selectedUUID} />
</canvas>

<style>
	.canvas {
		width: 100% !important;
		max-height: 100%;
		height: 100% !important;
	}
</style>
