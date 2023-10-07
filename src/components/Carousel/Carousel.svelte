<script lang="ts">
	import Icon from '$lib/Icon/Icon.svelte';

	//Usage
	// 	<Carousel
	// 	type="incremental"
	// 	onClick={() => console.log()}
	// 	styleRefs={{ container: 'dsfsfd', next: 'sdfsdf', prev: 'sdfsdf' }}
	// >
	// 	<!-- <slot name="prevButtonContent">Click me!</slot> -->
	// 	<!-- <slot name="nextButtonContent">Click me!</slot> -->
	// 	<!-- <slot name="markerContent">I sliede!</slot> -->
	// 	<!-- <slot name="Items">All my items</slot> -->
	// </Carousel>

	/**Triggered when the user scrolls over the items container using a mouse wheel*/
	export let onWheel: true | undefined = undefined;
	export let onSwipe: true | undefined = undefined;
	export let onMarkerSwipe: true | undefined = undefined;
	export let onMarkerDrag: true | undefined = undefined;
	export let onScrollbarClick: true | undefined = undefined;

	//TODO: integrate booleans to control behavior, slots for styling, and logic for inserting elements
	//If certain properteis are not provided, we need to detect and put our own styling in
	//bools
	/*
		incremental vs continuous
		buttons or no buttons
		scrollbar or no scrollbar
		do you want to listen for touch
		do you want to listen for the mouse wheel
		Do you want to auto increment
		How do we handle rounding the horn?
	*/

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
<div class="carousel" style:--marker-size={'40px'} style:--marker-pos={`${scrollMarkerX}px`}>
	<button class="nav-button nav-prev" on:click={() => scrollEventHandlers.button('prev')}>
		<slot name="prevButtonContent">
			<Icon class="fa-solid fa-angle-right" />
		</slot>
	</button>

	<!-- https://stackoverflow.com/questions/56988717/how-to-target-a-component-in-svelte-with-css -->
	<div
		class="carousel-container-outer"
		bind:this={scrollElem}
		on:wheel|preventDefault|stopPropagation={(e) => scrollEventHandlers.wheel(e.deltaY)}
		on:scroll|preventDefault|stopPropagation={() =>
			scrollEventHandlers.scroll(scrollElem?.scrollLeft || 0)}
		on:touchmove={() => scrollEventHandlers.scrollTouchSwipe(scrollElem?.scrollLeft || 0)}
	>
		{#if $$slots.container}
			<slot name="container">
				<slot name="items" />
			</slot>
		{:else}
			<div class="carousel-container-inner"><slot name="items" /></div>
		{/if}
	</div>
	<slot name="nextButton">
		<button class="nav-button nav-next" on:click={() => scrollEventHandlers.button('next')}
			><Icon class="fa-solid fa-angle-right" /></button
		>
	</slot>
	<div
		class="scroll-bar"
		bind:this={scrollbarElem}
		on:mousedown={(e) => {
			scrollEventHandlers.scrollbar(e.offsetX);
		}}
	>
		<slot name="scrollMarker">
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
		</slot>
	</div>
</div>

<style>
	.carousel {
		--bg-color: hsla(0, 0%, 0%, 50%);
		width: 70%;
		position: absolute;
		bottom: 150px;
		left: 50%;
		transform: translateX(-50%);
		display: grid;
		grid-template-columns: 10px 1fr 10px fit-content 10px 1fr 10px;
		grid-template-rows: max-content 10px var(--marker-size, max-content);
		grid-template-areas:
			'. prev . inner . next .'
			'. prev . . . next .'
			'. prev . scroll . next .';
		align-items: center;
		justify-content: center;
	}

	.nav-button {
		font-size: 3rem;
		padding: 10px;
		border-radius: 100%;
		width: 100px;
		height: 100px;
		background-color: var(--bg-color);
		color: white;
	}

	.nav-next {
		grid-area: next;
	}
	.nav-prev {
		grid-area: prev;
	}

	.carousel-container-outer {
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

	.carousel-container-outer::-webkit-scrollbar {
		display: none;
	}

	.carousel-containter-inner {
		height: 100%;
		width: fit-content;
		display: flex;
		padding: 30px 60px;
		align-items: center;
		justify-content: center;
		gap: var(--icon-spacing, 60px);
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
</style>
