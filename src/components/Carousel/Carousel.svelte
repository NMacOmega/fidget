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
	/**Horizontal*/
	let scrollElemHor: HTMLElement | null = null;
	let scrollbarElemHor: HTMLElement | null = null;
	let scrollMarkerElemHor: HTMLElement | null = null;
	let scrollbarWidthHor = -1;
	let scrollWidthHor = -1;
	let scrollMarkerWidthHor = -1;
	let scrollLeftEdgeHor = -1;
	let scrollBarLeftEdgeHor = -1;
	// Vertical
	let scrollElemVert: HTMLElement | null = null;
	let scrollbarElemVert: HTMLElement | null = null;
	let scrollMarkerElemVert: HTMLElement | null = null;
	let scrollbarWidthVert = -1;
	let scrollWidthVert = -1;
	let scrollMarkerWidthVert = -1;
	let scrollLeftEdgeVert = -1;
	let scrollBarLeftEdgeVert = -1;

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

	/**Event handler Functions*/

	function activateMouseDown() {
		isMouseDown = true;
	}

	function resetMouse() {
		isMouseDown = false;
	}

	function onScrollHorizontal(newScrollX: number) {
		//Only using if we just did a swipe scroll getsture
		if (activeScrollSource !== 'scroll-touch' || !isScrolling) return;
		const newMarkerX = calcRatioValue(newScrollX, scrollWidthHor, scrollbarWidthHor);
		updateScrollValues({
			scrollX: newScrollX,
			markerX: clampMarkerX(newMarkerX)
		});
	}

	function onScrollVertical(newScrollX: number) {
		//Only using if we just did a swipe scroll getsture
		if (activeScrollSource !== 'scroll-touch' || !isScrolling) return;
		const newMarkerX = calcRatioValue(newScrollX, scrollWidthHor, scrollbarWidthHor);
		updateScrollValues({
			scrollX: newScrollX,
			markerX: clampMarkerX(newMarkerX)
		});
	}

	function onWheelHorizontal(movementX: number) {
		activeScrollSource = 'wheel';
		const offset = (scrollWidthHor / 6) * (movementX > 0 ? 1 : -1);
		const newScrollX = scrollX + offset;
		const newMarkerX = calcRatioValue(newScrollX, scrollWidthHor, scrollbarWidthHor);
		updateScrollValues({
			scrollX: clampScrollX(newScrollX),
			markerX: clampMarkerX(newMarkerX),
			moveScroll: true
		});
		lockScrollTimer(10);
	}

	function onWheelVertical(movementX: number) {
		activeScrollSource = 'wheel';
		const offset = (scrollWidthHor / 6) * (movementX > 0 ? 1 : -1);
		const newScrollX = scrollX + offset;
		const newMarkerX = calcRatioValue(newScrollX, scrollWidthHor, scrollbarWidthHor);
		updateScrollValues({
			scrollX: clampScrollX(newScrollX),
			markerX: clampMarkerX(newMarkerX),
			moveScroll: true
		});
		lockScrollTimer(10);
	}

	function onButtonHorizontal(type: 'prev' | 'next') {
		activeScrollSource = 'button';
		let newScrollX = null;
		if (type === 'next') newScrollX = scrollX + scrollWidthHor / 3;
		if (type === 'prev') newScrollX = scrollX - scrollWidthHor / 3;
		if (newScrollX === null) return;
		const newMarkerX = calcRatioValue(newScrollX, scrollWidthHor, scrollbarWidthHor);
		updateScrollValues({
			scrollX: clampScrollX(newScrollX),
			markerX: clampMarkerX(newMarkerX),
			moveScroll: true
		});
		lockScrollTimer(500);
	}

	function onButtonVertical(type: 'prev' | 'next') {
		activeScrollSource = 'button';
		let newScrollX = null;
		if (type === 'next') newScrollX = scrollX + scrollWidthHor / 3;
		if (type === 'prev') newScrollX = scrollX - scrollWidthHor / 3;
		if (newScrollX === null) return;
		const newMarkerX = calcRatioValue(newScrollX, scrollWidthHor, scrollbarWidthHor);
		updateScrollValues({
			scrollX: clampScrollX(newScrollX),
			markerX: clampMarkerX(newMarkerX),
			moveScroll: true
		});
		lockScrollTimer(500);
	}

	function onScrollbarClickHorizontal(newMarkerX: number) {
		if (isScrollingLocked()) return;
		activeScrollSource = 'scrollbar';
		const newScrollX = calcRatioValue(newMarkerX, scrollbarWidthHor, scrollWidthHor);
		updateScrollValues({
			scrollX: clampScrollX(newScrollX),
			markerX: newMarkerX,
			moveScroll: true
		});
		lockScrollTimer(500);
	}

	function onScrollbarClickVertical(newMarkerX: number) {
		if (isScrollingLocked()) return;
		activeScrollSource = 'scrollbar';
		const newScrollX = calcRatioValue(newMarkerX, scrollbarWidthHor, scrollWidthHor);
		updateScrollValues({
			scrollX: clampScrollX(newScrollX),
			markerX: newMarkerX,
			moveScroll: true
		});
		lockScrollTimer(500);
	}

	function onMarkerClickHorizontal(movementX: number) {
		if (!isMouseDown) return;
		activeScrollSource = 'marker-mouse';
		const newMarkerX = scrollMarkerX + movementX;
		const newScrollX = calcRatioValue(newMarkerX, scrollbarWidthHor, scrollWidthHor);
		updateScrollValues({
			scrollX: clampScrollX(newScrollX),
			markerX: clampMarkerX(newMarkerX),
			moveScroll: true
		});
		lockScrollTimer(1000);
	}

	function onMarkerClickVertical(movementX: number) {
		if (!isMouseDown) return;
		activeScrollSource = 'marker-mouse';
		const newMarkerX = scrollMarkerX + movementX;
		const newScrollX = calcRatioValue(newMarkerX, scrollbarWidthHor, scrollWidthHor);
		updateScrollValues({
			scrollX: clampScrollX(newScrollX),
			markerX: clampMarkerX(newMarkerX),
			moveScroll: true
		});
		lockScrollTimer(1000);
	}

	function onContainerSwipeHorizontal(newScrollLeft: number) {
		let newScrollX = newScrollLeft;
		const newMarkerX = clampMarkerX(calcRatioValue(newScrollX, scrollWidthHor, scrollbarWidthHor));
		newScrollX = clampScrollX(newScrollX);
		touchX = newScrollX;
		markerTouchX = newMarkerX;
		updateScrollValues({ scrollX: newScrollX, markerX: newMarkerX });
		lockScrollTimer(1000);
		activeScrollSource = 'scroll-touch';
	}

	function onContainerSwipeVertical(newScrollLeft: number) {
		let newScrollX = newScrollLeft;
		const newMarkerX = clampMarkerX(calcRatioValue(newScrollX, scrollWidthHor, scrollbarWidthHor));
		newScrollX = clampScrollX(newScrollX);
		touchX = newScrollX;
		markerTouchX = newMarkerX;
		updateScrollValues({ scrollX: newScrollX, markerX: newMarkerX });
		lockScrollTimer(1000);
		activeScrollSource = 'scroll-touch';
	}

	function onMarkerSwipeHorizontal(touchClientX: number) {
		activeScrollSource = 'marker-touch';
		let newMarkerTouchX = touchClientX - scrollBarLeftEdgeHor;
		const newScrollX = clampScrollX(
			calcRatioValue(newMarkerTouchX, scrollbarWidthHor, scrollWidthHor)
		);
		newMarkerTouchX = clampMarkerX(newMarkerTouchX);
		markerTouchX = newMarkerTouchX;
		updateScrollValues({ scrollX: newScrollX, markerX: newMarkerTouchX, moveScroll: true });
		lockScrollTimer();
	}

	function onMarkerSwipeVertical(touchClientX: number) {
		activeScrollSource = 'marker-touch';
		let newMarkerTouchX = touchClientX - scrollBarLeftEdgeHor;
		const newScrollX = clampScrollX(
			calcRatioValue(newMarkerTouchX, scrollbarWidthHor, scrollWidthHor)
		);
		newMarkerTouchX = clampMarkerX(newMarkerTouchX);
		markerTouchX = newMarkerTouchX;
		updateScrollValues({ scrollX: newScrollX, markerX: newMarkerTouchX, moveScroll: true });
		lockScrollTimer();
	}

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
		return x < 0 ? 0 : x > scrollWidthHor ? scrollWidthHor : x;
	}
	function clampMarkerX(x: number) {
		return x < 0 ? 0 : x > scrollbarWidthHor ? scrollbarWidthHor - scrollMarkerWidthHor : x;
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
			scrollElemHor?.scrollTo({ left: newScrollX, behavior: 'smooth' });
	}

	function onResize() {
		scrollWidthHor = (scrollElemHor?.scrollWidth || -1) - (scrollElemHor?.clientWidth || -1);
		scrollbarWidthHor = scrollbarElemHor?.clientWidth || -1;
		scrollMarkerWidthHor = scrollMarkerElemHor?.clientWidth || -1;
		scrollLeftEdgeHor = scrollElemHor?.getBoundingClientRect()?.left || -1;
		scrollBarLeftEdgeHor = scrollbarElemHor?.getBoundingClientRect()?.left || -1;
		scrollX = scrollElemHor?.scrollLeft || 0;
		scrollMarkerX = calcRatioValue(scrollX, scrollWidthHor, scrollbarWidthHor);
	}

	/**Needed because elements do not get measured on first render;*/
	setTimeout(onResize, 150);
</script>

<!--Maybe if media query works in svelte, make a + component in the row OR outside of it? -->
<svelte:window
	on:mouseup={resetMouse}
	on:touchend={resetMouse}
	on:mousemove|preventDefault|stopPropagation={(e) => {
		onMarkerClickHorizontal(e.movementX);
	}}
	on:resize={onResize}
/>
<div class="carousel" style:--marker-size={'40px'} style:--marker-pos={`${scrollMarkerX}px`}>
	<button class="nav-button nav-prev" on:click={() => onButtonHorizontal('prev')}>
		<slot name="prevButtonContent">
			<Icon class="fa-solid fa-angle-left" />
		</slot>
	</button>

	<!-- https://stackoverflow.com/questions/56988717/how-to-target-a-component-in-svelte-with-css -->
	<div
		class="content"
		bind:this={scrollElemHor}
		on:wheel|preventDefault|stopPropagation={(e) => onWheelHorizontal(e.deltaY)}
		on:scroll|preventDefault|stopPropagation={() =>
			onScrollHorizontal(scrollElemHor?.scrollLeft || 0)}
		on:touchmove={() => onScrollbarClickHorizontal(scrollElemHor?.scrollLeft || 0)}
	>
		<!-- If statement doesn't work, items are sent in as a fragment, which cannot be contained -->
		<!-- {#if $$slots.container}
			<slot name="container">
				<slot name="items" />
			</slot>
		{:else} -->
		<div class="items"><slot name="items" /></div>
		<!-- {/if} -->
	</div>
	<slot name="nextButton">
		<button class="nav-button nav-next" on:click={() => onButtonHorizontal('next')}
			><Icon class="fa-solid fa-angle-right" /></button
		>
	</slot>
	<div
		class="scroll-bar"
		bind:this={scrollbarElemHor}
		on:mousedown={(e) => {
			onContainerSwipeHorizontal(e.offsetX);
		}}
	>
		<slot name="scrollMarker">
			<span
				id="scroll-marker"
				class="scroll-indicator"
				bind:this={scrollMarkerElemHor}
				on:mousedown={(e) => {
					activateMouseDown();
					onMarkerClickHorizontal(e.movementX);
				}}
				on:touchstart={(e) => {
					activateMouseDown();
					onMarkerSwipeHorizontal(e.touches[0].clientX);
				}}
				on:touchmove|preventDefault|stopPropagation={(e) =>
					onMarkerSwipeHorizontal(e.touches[0].clientX)}
			/>
		</slot>
	</div>
	<div class="scroll-bar-vertical">
		<slot name="scrollMarkerVertical">
			<span id="scroll-marker-vertical" class="scroll-indicator-vertical" />
			<!-- dfsdfsdfsdfsddf -->
			<!-- bind:this={scrollMarkerElemVertical}
		on:mousedown={(e) => {
			scrollEventHandlers.activate();
			scrollEventHandlers.marker(e.movementX);
		}}
		on:touchstart={(e) => {
			scrollEventHandlers.activate();
			scrollEventHandlers.markerTouchSwipe(e.touches[0].clientX);
		}}
		on:touchmove|preventDefault|stopPropagation={(e) =>
			scrollEventHandlers.markerTouchSwipe(e.touches[0].clientX)} -->

			<!-- dsgsdgsdg -->
		</slot>
	</div>
</div>

<style lang="postcss">
	@import '/postCSS/breakpoints.postcss';
	:where(div.carousel) {
		--control-color-accent: hsla(0, 0%, 100%, 1);
		--control-color-bg: hsla(0, 0%, 100%, 0.5);
		--nav-button-size: 70px;
		width: 100vw;
		bottom: 150px;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		display: grid;
		grid-template-rows: 100%;
		grid-template-columns: 1fr 60px;
		grid-template-areas: 'content . ';
		max-height: 60vh;
		overflow: hidden;

		@media (--md) {
			grid-template-columns: 10px 1fr 10px auto 10px 1fr 10px;
			grid-template-rows: auto 10px var(--marker-size, max-content);
			grid-template-areas:
				'. prev . content . next .'
				'. prev . . . next .'
				'. prev . . . next .';

			place-items: center;
		}
	}
	.carousel::-webkit-scrollbar,
	.content::-webkit-scrollbar,
	.items::-webkit-scrollbar {
		display: none;
	}

	:where(div.content) {
		height: 100%;
		grid-area: content;
		@media (--md) {
			background-color: var(--bg-color);
			border-radius: 40px;
			overflow-x: scroll;
			scroll-behavior: smooth;
			scrollbar-width: none;
			overflow-y: clip;
			white-space: nowrap;
			width: 100%;
		}
	}

	:where(div.items) {
		display: flex;
		align-items: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
		/* height: 80%; */
		/*TODO: This needs to be 80% or the add button will be clipped. Why???*/
		overflow-y: scroll;

		@media (--md) {
			flex-direction: row;
			overflow-y: clip;
			height: 100%;
			width: fit-content;
			padding: 30px 60px;
			align-items: center;
			justify-content: center;
			gap: var(--icon-spacing, 60px);
		}
	}

	.nav-button {
		display: none;

		@media (--md) {
			display: block;
			font-size: 3rem;
			border-radius: 100%;
			width: var(--nav-button-size, 70px);
			height: var(--nav-button-size, 70px);
			background-color: var(--control-color-bg);
			color: white;
		}
	}

	:global(.nav-button *) {
		margin: auto;
	}

	.nav-next {
		grid-area: next;
	}
	.nav-prev {
		grid-area: prev;
	}

	.scroll-bar {
		@media (--md) {
			grid-row: -2;
			grid-column: 1 / -1;
			height: 100%;
			width: 70%;
			position: relative;
		}
	}
	.scroll-bar::before {
		content: '';
		display: none;
	}

	@media (--md) {
		.scroll-bar::before {
			display: block;
			background-color: var(--control-color-bg);
			height: 50%;
			width: 110%;
			border-radius: 20px;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			pointer-events: none;
		}
	}
	.scroll-indicator {
		display: none;
		@media (--md) {
			display: block;
			width: var(--marker-size, 40px);
			height: var(--marker-size, 40px);
			background-color: var(--control-color-accent);
			border-radius: 100%;
			transform: translateX(var(--marker-pos));
		}
	}

	.scroll-bar-vertical {
		height: 100%;
		width: 40px;
		position: absolute;
		right: 0;
		top: 0;
		transform: translateX(-50%);
	}
	.scroll-bar-vertical::before {
		content: '';
		display: block;
		background-color: var(--control-color-bg);
		height: 100%;
		width: 100%;
		border-radius: 20px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
	}

	.scroll-indicator-vertical {
		display: block;
		width: var(--marker-size, 40px);
		height: var(--marker-size, 40px);
		background-color: var(--control-color-accent);
		border-radius: 100%;
		transform: translateY(var(--marker-pos));
	}

	@media (--md) {
		.scroll-bar-vertical,
		.scroll-bar-vertical::before,
		.scroll-indicator-vertical {
			display: none;
		}
	}
</style>
