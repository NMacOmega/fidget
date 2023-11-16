<script lang="ts">
	import { PUBLIC_MODEL_URL } from '$env/static/public';
	import ThreeJsScene from '$lib/ThreeJsScene/ThreeJsScene.svelte';
	// import Icon from '$lib/Icon/Icon.svelte';
	// import { camera } from '$stores/camera';
	// import ZoomSlider from '$lib/ZoomSlider/ZoomSlider.svelte';
	// import AnimationStartButton from '$lib/AnimationStartButton/AnimationStartButton.svelte';
	// import ColorPicker from '$lib/ColorPicker/ColorPicker.svelte';
	// import ColorPickerMock from '@comps/ColorPickerMock/ColorPickerMock.svelte';
	// import ColorOptionsMock from '@comps/ColorOptionsMock/ColorOptionsMock.svelte';
	// import ZoomMock from '@comps/ZoomMock/ZoomMock.svelte';
	import Controls from '$lib/Controls/Controls.svelte';
</script>

<section class="firstSection">
	<h3 class="title">Fidget Play Page</h3>
	<p class="intro">
		I made these fidget models in
		<a href="https://www.blender.org/">Blender</a> and added interactivity to them with
		<a href="https://threejs.org/">threejs!</a>.
	</p>
</section>

<section class="secondSection">
	<div class="demo">
		<ThreeJsScene
			modelURL={PUBLIC_MODEL_URL || ''}
			backgroundColorHex={'#000000'}
			backgroundOpacity={0.5}
		/>
		<!-- <button class="cameraButton prev" on:click={camera.prev}
			><Icon class="fa-solid fa-angle-left" /></button
		>
		<button class="cameraButton next" on:click={camera.next}
			><Icon class="fa-solid fa-angle-right" /></button
		> -->
		<!-- <ColorPicker /> -->
		<!-- <AnimationStartButton /> -->
		<!-- <ZoomSlider /> -->
		<!-- <ColorPickerMock /> -->
		<!-- <ColorOptionsMock /> -->
		<Controls />
	</div>
</section>

<section class="thirdSection">
	<h3 class="cta">Hope you enjoy these fidgets!</h3>
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
		border-radius: 16px;
	}
	.demo {
		background-color: #00000050;
		height: 100vh;
		min-width: 100vw;
		margin: auto;
		position: relative;
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
