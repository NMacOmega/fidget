<script lang="ts">
	import Icon from '$lib/Icon/Icon.svelte';
	import type { HSLColor } from '$lib/colorFunctions';
	import { colorOptionsDefaultOptions } from './colorOptionsDefaultOptions';

	type Option = {
		hsl: { h: number; s: number; l: number };
		opacity: number;
		roughness: number;
		metalness: number;
	};

	//To be updated by values from the current material
	let h = 220;
	let s = 75;
	let l = 65;
	let opacity = 100;
	let roughness = 50;
	let metalness = 50;

	let options = [...colorOptionsDefaultOptions] || [];
	let activeOption = 0;

	let displayOptions: Option[] = [];
	/**First entry will always be the default props of the selected material*/
	$: displayOptions = [{ hsl: { h, s, l }, opacity, roughness, metalness }, ...options];

	const colorStrings = {
		rough: ({ h = 0 }) => `hsl(${h}deg, 70%, 70%)`,
		roughBG: ({ h = 0 }) => `hsl(${h}deg, 40%, 40%)`,
		opacity: ({ h = 0 }) => `hsl(${h}deg, 70%, 70%)`,
		hsl: ({ h = 0, s = 0, l = 0 }) => `hsl(${h}deg, ${s}%, ${l}%)`
	};
	const clipPaths = {
		leftSide: {
			base: (v: number) => `polygon(0% ${v}%, 50% ${v}%, 50% 100%, 0% 100%)`,
			inverted: (v: number) => `polygon(0% ${v}%, 50% ${v}%, 50% 0%, 0% 0%)`
		},
		rightSide: {
			base: (v: number) => `polygon(50% ${v}%, 100% ${v}%, 100% 100%, 50% 100%)`,
			inverted: (v: number) => `polygon(50% ${v}%, 100% ${v}%, 100% 0%, 50% 0%)`
		}
	};

	/**Elements for Scroll binding*/
	let scrollElem: HTMLElement | null = null;
	let scrollbarElem: HTMLElement | null = null;
	let scrollMarkerElem: HTMLElement | null = null;
	let scrollbarWidth = -1;
	let scrollWidth = -1;
	let scrollMarkerWidth = -1;
	let scrollLeftEdge = -1;
	let scrollBarLeftEdge = -1;
	//Behavior controls
	let timer: number | null = null;
	let isMouseDown = false;
	let isScrolling = false;
	let activeScrollSource: ScrollEventType = null;

	type ScrollEventType =
		| 'scroll'
		| 'button'
		| 'wheel'
		| 'touch'
		| 'scrollbar'
		| 'marker-mouse'
		| 'scroll-touch'
		| 'marker-touch'
		| null;

	/**Scrolling record for container*/
	let scrollX = 0;
	let touchX = 0;
	/**location of the drag marker*/
	let scrollMarkerX = 0;
	let markerTouchX = 0;

	const scrollEventHandlers = {
		scroll: (newScrollX: number) => {
			//Only using we just did a swipe scroll getsture
			if (activeScrollSource !== 'scroll-touch' || !isScrolling) return;
			const newMarkerX = calcRatioValue(newScrollX, scrollWidth, scrollbarWidth);
			updateScrollValues({
				scrollX: newScrollX,
				markerX: clampMarkerX(newMarkerX)
			});
		},
		wheel: (movementX: number) => {
			activeScrollSource = 'wheel';
			const offset = (scrollWidth / 6) * (movementX > 0 ? 1 : -1);
			const newScrollX = scrollX + offset;
			const newMarkerX = calcRatioValue(newScrollX, scrollWidth, scrollbarWidth);
			updateScrollValues({
				scrollX: clampScrollX(newScrollX),
				markerX: clampMarkerX(newMarkerX),
				moveScroll: true
			});
			lockScrollTimer(10);
		},
		button: (type: 'prev' | 'next') => {
			activeScrollSource = 'button';
			let newScrollX = null;
			if (type === 'next') newScrollX = scrollX + scrollWidth / 3;
			if (type === 'prev') newScrollX = scrollX - scrollWidth / 3;
			if (newScrollX === null) return;
			const newMarkerX = calcRatioValue(newScrollX, scrollWidth, scrollbarWidth);
			updateScrollValues({
				scrollX: clampScrollX(newScrollX),
				markerX: clampMarkerX(newMarkerX),
				moveScroll: true
			});
			lockScrollTimer(500);
		},
		scrollbar: (newMarkerX: number) => {
			if (isScrollingLocked()) return;
			activeScrollSource = 'scrollbar';
			const newScrollX = calcRatioValue(newMarkerX, scrollbarWidth, scrollWidth);
			updateScrollValues({
				scrollX: clampScrollX(newScrollX),
				markerX: newMarkerX,
				moveScroll: true
			});
			lockScrollTimer(500);
		},
		marker: (movementX: number) => {
			if (!isMouseDown) return;
			activeScrollSource = 'marker-mouse';
			const newMarkerX = scrollMarkerX + movementX;
			const newScrollX = calcRatioValue(newMarkerX, scrollbarWidth, scrollWidth);
			updateScrollValues({
				scrollX: clampScrollX(newScrollX),
				markerX: clampMarkerX(newMarkerX),
				moveScroll: true
			});
			lockScrollTimer(1000);
		},
		scrollTouchSwipe: (newScrollLeft: number) => {
			let newScrollX = newScrollLeft;
			const newMarkerX = clampMarkerX(calcRatioValue(newScrollX, scrollWidth, scrollbarWidth));
			newScrollX = clampScrollX(newScrollX);
			touchX = newScrollX;
			markerTouchX = newMarkerX;
			updateScrollValues({ scrollX: newScrollX, markerX: newMarkerX });
			lockScrollTimer(1000);
			activeScrollSource = 'scroll-touch';
		},
		markerTouchSwipe: (touchClientX: number) => {
			activeScrollSource = 'marker-touch';
			let newMarkerTouchX = touchClientX - scrollBarLeftEdge;
			const newScrollX = clampScrollX(calcRatioValue(newMarkerTouchX, scrollbarWidth, scrollWidth));
			newMarkerTouchX = clampMarkerX(newMarkerTouchX);
			markerTouchX = newMarkerTouchX;
			updateScrollValues({ scrollX: newScrollX, markerX: newMarkerTouchX, moveScroll: true });
			lockScrollTimer();
		},
		activate: () => {
			isMouseDown = true;
		},
		reset: () => {
			isMouseDown = false;
		}
	};

	function lockScrollTimer(milliseconds = 250) {
		if (timer !== null) clearTimeout(timer);
		timer = setTimeout(() => {
			if (!isMouseDown) {
				activeScrollSource = null;
				isScrolling = false;
			}
		}, milliseconds);
	}

	function isScrollingLocked(type?: ScrollEventType) {
		if (type === undefined) return isScrolling;
		return isScrolling && type !== activeScrollSource;
	}

	function clampScrollX(x: number) {
		return x < 0 ? 0 : x > scrollWidth ? scrollWidth : x;
	}
	function clampMarkerX(x: number) {
		return x < 0 ? 0 : x > scrollbarWidth ? scrollbarWidth - scrollMarkerWidth : x;
	}
	function calcRatioValue(enumerator: number, denominator: number, testValue: number) {
		return testValue * (enumerator / denominator);
	}

	function updateScrollValues({
		scrollX: newScrollX = -1,
		markerX: newMarkerX = -1,
		moveScroll = false
	}: {
		scrollX?: number;
		markerX?: number;
		moveScroll?: boolean;
	}) {
		if (newMarkerX < 0 && newScrollX < 0) return;
		isScrolling = true;
		if (newMarkerX >= 0) scrollMarkerX = newMarkerX;
		if (newScrollX >= 0) scrollX = newScrollX;
		if (newScrollX >= 0 && moveScroll)
			scrollElem?.scrollTo({ left: newScrollX, behavior: 'smooth' });
	}

	function onResize() {
		scrollWidth = (scrollElem?.scrollWidth || -1) - (scrollElem?.clientWidth || -1);
		scrollbarWidth = scrollbarElem?.clientWidth || -1;
		scrollMarkerWidth = scrollMarkerElem?.clientWidth || -1;
		scrollLeftEdge = scrollElem?.getBoundingClientRect()?.left || -1;
		scrollBarLeftEdge = scrollbarElem?.getBoundingClientRect()?.left || -1;
		scrollX = scrollElem?.scrollLeft || 0;
		scrollMarkerX = calcRatioValue(scrollX, scrollWidth, scrollbarWidth);
	}

	/**Needed because elements do not get measured on first render;*/
	setTimeout(onResize, 150);
</script>

<!--Maybe if media query works in svelte, make a + component in the row OR outside of it? -->
<svelte:window
	on:mouseup={scrollEventHandlers.reset}
	on:touchend={scrollEventHandlers.reset}
	on:mousemove|preventDefault|stopPropagation={(e) => {
		scrollEventHandlers.marker(e.movementX);
	}}
	on:resize={onResize}
/>
<div
	class="colorOptions"
	style:--icon-size={'120px'}
	style:--first-spacing={'60px'}
	style:--icon-spacing={'120px'}
	style:--icon-vert-padding={'20px'}
	style:height={'calc(var(--icon-size) + var(--icon-vert-padding))'}
	style:--marker-size={'40px'}
	style:--marker-pos={`${scrollMarkerX}px`}
>
	<button class="nav-button nav-prev" on:click={() => scrollEventHandlers.button('prev')}
		><Icon class="fa-solid fa-angle-left" /></button
	>
	<div
		class="inner-container"
		bind:this={scrollElem}
		on:wheel|preventDefault|stopPropagation={(e) => scrollEventHandlers.wheel(e.deltaY)}
		on:scroll|preventDefault|stopPropagation={() =>
			scrollEventHandlers.scroll(scrollElem?.scrollLeft || 0)}
		on:touchmove={() => scrollEventHandlers.scrollTouchSwipe(scrollElem?.scrollLeft || 0)}
	>
		<div class="circles">
			{#each displayOptions as option, i}
				<div class="circle">
					{#if i === activeOption} <span class={'highlight-bg'} /> {/if}
					<span
						class="metalness-bg"
						style:clip-path={clipPaths.rightSide.inverted(100 - option.metalness)}
					/>
					<span
						class="metalness"
						style:clip-path={clipPaths.rightSide.base(100 - option.metalness)}
					/>
					<span
						class="roughness-bg"
						style:background-color={colorStrings.roughBG(option.hsl)}
						style:clip-path={clipPaths.leftSide.inverted(100 - option.roughness)}
					/>
					<span
						class="roughness"
						style:background-color={colorStrings.rough(option.hsl)}
						style:clip-path={clipPaths.leftSide.base(100 - option.roughness)}
					/>
					<div class="circle-inner">
						<span class="opacity" style:background-color={colorStrings.opacity(option.hsl)} />
						<span class="color" style:background-color={colorStrings.hsl(option.hsl)} />
					</div>
				</div>
			{/each}
		</div>
	</div>
	<button class="nav-button nav-next" on:click={() => scrollEventHandlers.button('next')}
		><Icon class="fa-solid fa-angle-right" /></button
	>
	<div
		class="scroll-bar"
		bind:this={scrollbarElem}
		on:mousedown={(e) => {
			scrollEventHandlers.scrollbar(e.offsetX);
		}}
	>
		<span
			id="scroll-marker"
			class="scroll-indicator"
			bind:this={scrollMarkerElem}
			on:mousedown={(e) => {
				scrollEventHandlers.activate();
				scrollEventHandlers.marker(e.movementX);
			}}
			on:touchstart={(e) => {
				scrollEventHandlers.activate();
				scrollEventHandlers.markerTouchSwipe(e.touches[0].clientX);
			}}
			on:touchmove|preventDefault|stopPropagation={(e) =>
				scrollEventHandlers.markerTouchSwipe(e.touches[0].clientX)}
		/>
	</div>
</div>

<style lang="postcss">
	@import 'static/breakpoints.postcss';

	.colorOptions {
		--bg-color: hsla(0, 0%, 0%, 50%);
		width: 100vw;
		position: absolute;
		bottom: 150px;
		left: 50%;
		transform: translateX(-50%);
		display: grid;
		grid-template-columns: 1rem min-content 1.2rem 1fr 1.2rem min-content 1rem;
		grid-template-rows: max-content 3rem var(--marker-size, max-content);
		grid-template-areas:
			'. prev . inner . next .'
			'. . . . . . .'
			'. . . scroll . . .';
		align-items: center;
		justify-content: center;
	}

	.nav-button {
		--clamp-size: clamp(4rem, 10vw, 6rem);
		width: var(--clamp-size);
		height: var(--clamp-size);
		padding: 0.1rem;
		font-size: clamp(2.2rem, 2vw + 1.5rem, 4rem);
		background-color: var(--bg-color);
		color: white;
		border-radius: 100%;
	}

	.nav-next {
		grid-area: next;
	}
	.nav-prev {
		grid-area: prev;
	}

	.inner-container {
		grid-area: inner;
		background-color: var(--bg-color);
		border-radius: 40px;
		overflow-x: scroll;
		scroll-behavior: smooth;
		scrollbar-width: none;
		overflow-y: clip;
		white-space: nowrap;
		height: 100%;
	}

	.inner-container::-webkit-scrollbar {
		display: none;
	}

	.scroll-bar {
		grid-area: scroll;
		height: 100%;
		position: relative;
	}
	.scroll-bar::before {
		content: '';
		width: 100%;
		height: 50%;
		border-radius: 20px;
		background-color: var(--bg-color);
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}

	.scroll-indicator {
		display: block;
		width: var(--marker-size, 40px);
		height: var(--marker-size, 40px);
		background-color: var(--bg-color);
		border-radius: 100%;
		transform: translateX(var(--marker-pos));
	}

	.circles {
		height: fit-content;
		width: fit-content;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30px 60px;
		gap: var(--icon-spacing, 60px);
	}

	.circle {
		width: var(--icon-size, 60px);
		height: var(--icon-size, 60px);
		position: relative;
	}

	.circle-inner {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 75%;
		height: 75%;
	}

	.color,
	.opacity,
	.metalness,
	.metalness-bg,
	.roughness,
	.roughness-bg,
	.highlight-bg {
		display: block;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		width: 100%;
		height: 100%;
	}

	.highlight-bg {
		background-color: white;
		width: 110%;
		height: 110%;
	}

	.metalness {
		background-color: silver;
	}
	.metalness-bg {
		background-color: black;
	}
	.roughness {
	}

	.roughness-bg {
	}
</style>
