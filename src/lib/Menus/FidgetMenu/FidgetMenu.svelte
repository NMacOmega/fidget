<script lang="ts">
	import FidgetIcon from '../MenuComponents/FidgetIcon/FidgetIcon.svelte';
	import { fidgetReference, sceneHighlights, highlightFidget } from '$stores/threeJSObjectStores';
	import { camera } from '$stores/camera';
	import type { FidgetName } from '$stores/threeJSObjectStores';
	import Icon from '../MenuComponents/Icon/Icon.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	let centerSlide: HTMLElement;

	let captureScroll = false;

	function onWindowScroll(
		e: UIEvent & {
			currentTarget: EventTarget & Window;
		}
	) {
		if (captureScroll) e.stopPropagation();
	}
	// @todo: Set button behavior and hid scroll progressbar
	//@todo: also improve scrollwheel behavior over element
	//May need to use onWheelEvent to stop wierd scrolling over eleemnt
	function onScrollFromCenter(entries: IntersectionObserverEntry[]) {
		entries.forEach((entry) => {
			if (entry.target.className.includes('second') && !entry.isIntersecting)
				centerSlide?.scrollIntoView({ behavior: 'instant', inline: 'center' });
		});
	}
	function onReady() {
		const centerScrollObserver = new IntersectionObserver(onScrollFromCenter, {
			root: document.querySelector('.fidgetGallery'),
			rootMargin: '0px',
			threshold: 0.01
		}).observe(centerSlide);
	}
	setTimeout(onReady, 150);
</script>

<svelte:window on:scroll|preventDefault|stopPropagation={(e) => onWindowScroll(e)} />

<div class="fidgetMenu">
	<div class="fidgetChoiceMenu">
		<div
			class="fidgetGallery"
			on:mouseenter={() => (captureScroll = true)}
			on:mouseleave={() => (captureScroll = false)}
		>
			<div class="fidgetGallerySlide first">
				{#each fidgetReference.names as fidget}
					<div class="fidgetOption">
						<FidgetIcon icon={fidget} />
					</div>
				{/each}
			</div>
			<div class="fidgetGallerySlide second" bind:this={centerSlide}>
				{#each fidgetReference.names as fidget}
					<div class="fidgetOption">
						<FidgetIcon icon={fidget} />
					</div>
				{/each}
			</div>
			<div class="fidgetGallerySlide third">
				{#each fidgetReference.names as fidget}
					<div class="fidgetOption">
						<FidgetIcon icon={fidget} />
					</div>
				{/each}
			</div>
		</div>

		<button class="close" on:click={() => dispatch('close')}>Close</button>
	</div>
</div>

<style>
	.fidgetMenu {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 10px min(45vw, 15rem);
		grid-template-areas:
			'.'
			'.'
			'controls';
	}

	.fidgetChoiceMenu {
		border-radius: 30px 30px 0 0;
		background-color: hsla(1, 100%, 0%, 0.2);
		pointer-events: auto;
		grid-area: controls;
		display: grid;
		grid-template-columns: 10px 1fr 1fr 1fr 10px;
		grid-template-rows: 1px 1fr auto;
		grid-template-areas:
			'. . . . .'
			'. gallery gallery gallery .'
			'. prev next close. ';
	}

	.fidgetGallery {
		grid-area: gallery;
		display: flex;
		flex-direction: row;
		overflow-x: scroll;
	}

	.fidgetGallerySlide {
		display: flex;
		flex-direction: row;
		min-width: 100%;
		height: 100%;
		align-items: center;
		justify-content: space-around;
	}

	.fidgetOption {
		--size: 6rem;
		width: var(--size);
		height: var(--size);
		flex-shrink: 0;
	}

	.close {
		grid-area: close;
		background-color: hsl(10, 90%, 90%);
		color: black;
		grid-area: close;
		margin: auto 20px 10px auto;
		padding: 10px 20px;
		border-radius: 15px;
	}
</style>
