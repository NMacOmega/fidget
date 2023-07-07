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

<button
	class={`animationButton startAnimationButton ${!$enabled ? ' disabled' : ''}`}
	disabled={!$enabled}
	on:click={playAnimations}><Icon class="fa-solid fa-play" /></button
>

<style>
	.startAnimationButton {
		position: absolute;
		right: 10%;
		top: 20%;
		background-color: #292929;
		color: hsl(220, 20%, 50%);

		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 15px;
		border-radius: 16px;
	}

	.startAnimationButton.disabled {
		/* background-color: red; */
	}
</style>
