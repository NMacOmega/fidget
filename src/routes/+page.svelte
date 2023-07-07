<script lang="ts">
	import ThreeJsScene from '$lib/ThreeJsScene/ThreeJsScene.svelte';
	import Icon from '$lib/Icon/Icon.svelte';
	import { changeCameraFocus } from '$lib/ThreeJsScene/ThreeJsCamera';
	import ZoomSlider from '$lib/ZoomSlider/ZoomSlider.svelte';
	import AnimationStartButton from '$lib/AnimationStartButton/AnimationStartButton.svelte';
	import ColorPicker from '$lib/ColorPicker/ColorPicker.svelte';

	const cameraNext = () => changeCameraFocus('next');
	const cameraPrev = () => changeCameraFocus('prev');
</script>

<section class="firstSection">
	<h3 class="title">Fidget Play Page</h3>
	<p class="intro">
		I made these fidget models in
		<a href="https://www.blender.org/">Blender</a> and added interactivity to them with
		<a href="https://threejs.org/">threeJS</a>.
	</p>
</section>

<section class="secondSection">
	<div class="demo">
		<ThreeJsScene />
		<button class="cameraButton prev" on:click={cameraPrev}
			><Icon class="fa-solid fa-angle-left" /></button
		>
		<button class="cameraButton next" on:click={cameraNext}
			><Icon class="fa-solid fa-angle-right" /></button
		>
		<ColorPicker />
		<AnimationStartButton />
		<ZoomSlider />
	</div>
</section>

<section class="thirdSection">
	<h3 class="cta">Hey, Here is a check to see if you really need that dist directory</h3>
</section>

<style>
	:global(body) {
		display: grid;

		grid-template-rows: repeat(5, auto);

		grid-template-areas:
			'header'
			'intro'
			'demo'
			'outro'
			'footer';
	}

	.firstSection {
		grid-area: intro;
	}

	.secondSection {
		grid-area: demo;
	}

	.thirdSection {
		grid-area: outro;
	}
	.firstSection,
	.thirdSection {
		padding: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.title {
		font-size: 2rem;
	}

	.intro {
		font-size: 1.2rem;
	}

	.secondSection {
		position: relative;
		overflow: hidden;
		background-color: hsla(220, 100%, 2%, 0.2);
		border-radius: 16px;
	}

	.cta {
		font-size: 2rem;
	}

	.cameraButton {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: transparent;
		border: none;
		color: #fff;
		font-size: 10rem;
	}

	.cameraButton.next {
		right: 0;
	}

	.cameraButton.prev {
		left: 0;
	}
</style>
