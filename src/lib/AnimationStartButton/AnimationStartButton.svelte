<script>
	import Icon from '$lib/Icon/Icon.svelte';
	import { LoopOnce } from 'three';
	import { availableAnimations as animations, isAnimationsAvailable as enabled } from '$lib/stores';
	const playAnimations = () => {
		$animations.map((anim) => {
			if (anim.play) anim.setLoop(LoopOnce).play().reset();
		});
	};
</script>

<!-- Remove !enabled when styling is done -->
{#if $enabled || !$enabled}
	<button class="animationButton startAnimationButton" on:click={playAnimations}
		><Icon class="fa-solid fa-play playIcon" /></button
	>
{/if}

<style>
	.startAnimationButton {
		position: absolute;
		right: 10%;
		bottom: 10%;
		width: 60px;
		height: 60px;
		background-color: #292929;
		color: hsl(220, 20%, 50%);

		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 15px;
		border-radius: 16px;
	}

	:global(.playIcon) {
		font-size: 25px;
	}
</style>
