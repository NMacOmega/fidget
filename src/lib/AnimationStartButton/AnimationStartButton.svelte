<script lang="ts">
	import Icon from '$lib/Icon/Icon.svelte';
	import { animations, isAnimationsAvailable } from '$stores/animation';
</script>

<!-- Remove !enabled when styling is done -->
{#if $isAnimationsAvailable}
	<button class="animationButton startAnimationButton" on:click={animations.playAvailable}
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
