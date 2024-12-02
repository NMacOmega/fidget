<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { initializeThreeJSSceneFromModelURL, onWindowResize } from './ThreeJsInit';
	import { onMouseDown, onMouseUp, onMouseDrag } from './ThreeJsEvents';
	import { selectedUUID } from '$stores/activeMaterial';

	/**URL to model, stored in environment and provided by page.svelte*/
	export let modelURL: string;
	/**Optional Hex Color code for the scene background, on #000000 string format*/
	export let backgroundColorHex: string = 'N/A';
	/**Optional opacity of  the background color, 0.0 <--> 1.0*/
	export let backgroundOpacity: number = -1;

	let threeCanvas: HTMLCanvasElement;

	if (browser && modelURL) {
		onMount(() => initializeThreeJSSceneFromModelURL(threeCanvas, modelURL, '', -1));
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
		/* max-height: 100%; */
		/* margin: auto; */
	}
</style>
