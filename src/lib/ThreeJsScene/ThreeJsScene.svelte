<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { initializeThreeJSSceneFromModelURL, onWindowResize } from './ThreeJsInit';
	import { onMouseDown, onMouseUp, onMouseDrag } from './ThreeJsEvents';
	import { selectedUUID } from '$stores/material';

	/**URL to model, stored in environment and provided by page.svelte*/
	export let modelURL: string;

	let threeCanvas: HTMLCanvasElement;

	if (browser && modelURL) {
		onMount(() => initializeThreeJSSceneFromModelURL(threeCanvas, modelURL));
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
