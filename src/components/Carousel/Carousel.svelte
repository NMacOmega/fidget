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
	/**Horizontal scrolling container for content*/
	let scrollElemHor: HTMLElement | null = null;
	/**Vertical scrolling container for items*/
	let scrollElemVert: HTMLElement | null = null;
	/**Stylized thumb for horizontal track.
	 * We track if we are in vertical or horizontal position by
	 * weather or not this is visible*/
	let scrollMarkerElemHor: HTMLElement | null = null;
	let scrollBarHor: HTMLElement | null = null;
	let scrollBarVert: HTMLElement | null = null;

	/**caches the height of the vertical scroll track*/
	let scrollVerticalHeight = 0;
	/**caches the width of the horizontal scroll track*/
	let scrollHorizontalWidth = 0;
	/**Caches the leftmost point of the horizontal scroll track*/
	let scrollHorizontalLeft = 0;
	/**Caches the topmost point of the vertical scroll track*/
	let scrollVerticalTop = 0;
	/**Caches the visible distance of horizontal track with page offset*/
	let scrollHorizontalLength = 0;
	/**Caches the visible distance of vertical track with page offset*/
	let scrollVerticalLength = 0;
	/**Caches the visible distance of horizontal scroll track with page offset*/
	let scrollHorizontalBarLength = 0;
	/**Caches the visible distance of vertical scroll track with page offset*/
	let scrollVerticalBarLength = 0;
	/**Caches Offset of Visible Horizontal Scrollbar*/
	let scrollHorizontalBarLeft = 0;
	/**Caches Offset of Visible Vertical Scrollbar*/
	let scrollVerticalBarTop = 0;

	/**Used for event throttling*/
	let timer: number | null = null;
	/**Use to filter scroll events until mouse or touch is released*/
	let isMouseDown = false;
	/**Used for event throttling*/
	let isScrolling = false;
	/**Used to filter scroll events*/
	let activeScrollSource: ScrollEventType = null;
	/**Location of horizontal and vertical markers in %*/
	let percent = 100;
	/**Screen X axis to track movement when moving via touch*/
	let screenX = 0;
	/**Screen Y axis to track movement when moving via touch*/
	let screenY = 0;

	/**Keeps track of which scrollbar is visible*/
	let scrollDirection: 'vertical' | 'horizontal' = 'vertical'; //tells us if the scrollbar ir vertical scrollbar is active
	const getActiveScrollPosition = () =>
		scrollMarkerElemHor?.clientWidth && scrollMarkerElemHor?.clientWidth > 0
			? 'horizontal'
			: 'vertical';

	type ScrollEventType =
		| 'scroll'
		| 'button'
		| 'wheel'
		| 'touch'
		| 'scrollbar'
		| 'scroll-button'
		| 'marker-mouse'
		| 'scroll-touch'
		| 'marker-touch'
		| null;

	/**Event handler Functions*/
	const clamp = (n: number, max: number, min: number) => (n > max ? max : n < min ? min : n);

	function onScrollEvent() {
		/**Used to move scroll when middle mouse button is used to scroll a container*/
		if (activeScrollSource !== 'scroll-button' || !isMouseDown) return;
		let newPoint =
			scrollDirection === 'horizontal'
				? scrollElemHor?.scrollLeft | 1
				: scrollElemVert?.scrollTop | 1;
		let scrollLength =
			scrollDirection === 'horizontal' ? scrollHorizontalLength : scrollVerticalLength;

		let p = newPoint / scrollLength;
		percent = clamp(p * 100, 100, 0);
	}
	function onClickEvent() {
		/**Used to detect if the middle mouse button was pressed in order to engage scrolling movement behavior*/
		if (event.which === 2) {
			activeScrollSource = 'scroll-button';
			isMouseDown = true;
			lockScrollTimer();
		}
	}
	function onWheelEvent(diff: number) {
		activeScrollSource = 'wheel';
		let d = diff < 0 ? -10 : 10;
		let p = percent + d;
		percent = clamp(p, 100, 0);
		updateScroll();
		lockScrollTimer(500);
	}
	function onButtonEvent(type: 'prev' | 'next') {
		activeScrollSource = 'button';
		let d = type === 'prev' ? -20 : 20;
		let p = percent + d;
		percent = clamp(p, 100, 0);
		updateScroll();
		lockScrollTimer(500);
	}
	function onMarkerEvent(pointX: number, pointY: number) {
		let newPoint = scrollDirection === 'horizontal' ? pointX : pointY;
		let scrollPageOffset =
			scrollDirection === 'horizontal' ? scrollHorizontalBarLeft : scrollVerticalBarTop;
		let scrollElemLength =
			scrollDirection === 'horizontal' ? scrollHorizontalBarLength : scrollVerticalBarLength;
		let n = newPoint - scrollPageOffset;
		let p = (n / scrollElemLength) * 100;
		percent = clamp(p, 100, 0);
		activeScrollSource = 'marker-mouse';
		updateScroll('instant');
		lockScrollTimer(1000);
	}
	function onTouchEvent(touch: Touch) {
		/**@todo:add functionality for movement as well*/
		activeScrollSource = 'marker-touch';
		let newPoint = scrollDirection === 'horizontal' ? touch.clientX : touch.clientY;
		let scrollPageOffset =
			scrollDirection === 'horizontal' ? scrollHorizontalLeft : scrollVerticalTop;
		let scrollElemLength =
			scrollDirection === 'horizontal' ? scrollHorizontalWidth : scrollVerticalHeight;
		let a = clamp(newPoint, scrollPageOffset + scrollElemLength, scrollPageOffset);
		let b = a - scrollPageOffset;
		let c = scrollElemLength;
		let p = (b / c) * 100;
		percent = clamp(p, 100, 0);
		updateScroll('instant');
		lockScrollTimer();
	}
	function onTouchMoveEvent(touchX: any, touchY: any) {
		/**@todo: Math is off when swiping*/
		let newTouch = scrollDirection === 'horizontal' ? touchX : touchY;
		let oldTouch = scrollDirection === 'horizontal' ? screenX : screenY;
		let scrollLength =
			scrollDirection === 'horizontal' ? scrollHorizontalWidth : scrollVerticalHeight;
		let currentScroll = (scrollLength * percent) / 100;
		let movement = oldTouch - newTouch;
		let newScroll = currentScroll + movement;
		percent = (newScroll / scrollLength) * 100;
		console.log(`
		newTouch: ${newTouch}
		oldTouch: ${oldTouch}
		scrollLength: ${scrollLength}
		currentScroll: ${currentScroll}
		movement: ${movement}
		newScroll: ${newScroll}
		percent: ${percent}
		`);
		updateScroll();
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

	function updateScroll(mode: 'smooth' | 'instant' = 'smooth') {
		if (scrollDirection === 'horizontal')
			scrollElemHor?.scrollTo({
				left: ((scrollElemHor.scrollWidth - scrollElemHor.clientWidth) * percent) / 100,
				behavior: mode
			});
		else
			scrollElemVert?.scrollTo({
				top: ((scrollElemVert.scrollHeight - scrollElemVert.clientHeight) * percent) / 100,
				behavior: mode
			});
	}

	function onResize() {
		//@todo Hide scroll if not needed. Bar just hangs there when full screen
		//@todo When resizing updates sometimes jump to end of scroll, not where is should be
		let wasVertical = scrollDirection === 'vertical';
		scrollDirection = getActiveScrollPosition();
		let nowVertical = scrollDirection === 'vertical';
		/**Check if we are changing screensize from a small screen with vertical bar
		 * to a large screen with a horizontal bar. in either case, we will update
		 * the active scrolbar
		 */
		if ((!nowVertical && wasVertical) || (nowVertical && !wasVertical)) updateScroll('instant');

		/**Cache scroll track lengths for calculating onScroll and marker drags*/
		// scrollHorizontalWidth = (scrollElemHor?.scrollWidth || 0) - (scrollElemHor?.clientWidth || 0);
		let { width = 0, left = 0 } = scrollElemHor?.getBoundingClientRect();
		let { height = 0, top = 0 } = scrollElemVert?.getBoundingClientRect();
		scrollHorizontalLeft = left;
		scrollHorizontalWidth = width;
		scrollVerticalHeight = height;
		scrollVerticalTop = top;
		scrollHorizontalLength = scrollElemHor?.scrollWidth - scrollHorizontalWidth;
		scrollVerticalLength = scrollElemVert?.scrollHeight - scrollVerticalHeight;
		/**Cache length of visible scrolling track when calculating scroll events and finger swipes on tracks*/
		let { width: w = 0, left: l = 0 } = scrollBarHor?.getBoundingClientRect();
		let { height: h = 0, top: t = 0 } = scrollBarVert?.getBoundingClientRect();
		scrollHorizontalBarLeft = l;
		scrollHorizontalBarLength = w;
		scrollVerticalBarTop = t;
		scrollVerticalBarLength = h;
	}

	/**Needed because elements do not get measured on first render;*/
	setTimeout(onResize, 150);
</script>

<svelte:window
	on:mouseup={() => (isMouseDown = false)}
	on:touchend={() => (isMouseDown = false)}
	on:mousemove|preventDefault|stopPropagation={(e) => {
		if (activeScrollSource === 'marker-mouse' && isMouseDown) onMarkerEvent(e.clientX, e.clientY);
	}}
	on:resize={onResize}
/>
<div
	class="carousel"
	style:--marker-size={'40px'}
	on:wheel|preventDefault|stopPropagation={(e) => onWheelEvent(e.deltaY)}
>
	<button class="nav-button nav-prev" on:click={() => onButtonEvent('prev')}>
		<slot name="prevButtonContent">
			<Icon class="fa-solid fa-angle-left" />
		</slot>
	</button>

	<!-- https://stackoverflow.com/questions/56988717/how-to-target-a-component-in-svelte-with-css -->
	<div
		class="content"
		bind:this={scrollElemHor}
		on:touchstart={(e) => {
			isMouseDown = true;
			onTouchEvent(e.touches[0]);
		}}
		on:mousedown={() => onClickEvent()}
		on:mouseup={(e) => {
			isMouseDown = false;
		}}
		on:touchmove|preventDefault|stopPropagation={(e) =>
			onTouchMoveEvent(e.touches[0].screenX, e.touches[0].screenY)}
		on:scroll|preventDefault|stopPropagation={() => onScrollEvent()}
	>
		<!-- on:touchmove|preventDefault|stopPropagation={(e) => onTouchEvent(e.touches[0])} -->
		<div
			class="items"
			bind:this={scrollElemVert}
			on:touchstart={(e) => {
				isMouseDown = true;
				onTouchEvent(e.touches[0]);
			}}
			on:scroll|preventDefault|stopPropagation={(e) => onScrollEvent(e)}
			on:mousedown={() => onClickEvent()}
			on:mouseup={(e) => {
				isMouseDown = false;
			}}
		>
			<slot name="items" />
		</div>
	</div>
	<slot name="nextButton">
		<button class="nav-button nav-next" on:click={() => onButtonEvent('next')}
			><Icon class="fa-solid fa-angle-right" /></button
		>
	</slot>
	<div
		class="scroll-bar"
		on:mousedown={(e) => {
			if ((e?.target?.className || '').indexOf('scroll-bar') > -1) {
				isMouseDown = true;
				// onScrollbarEvent(e.offsetX, scrollBarHor?.clientWidth || 1);
				onMarkerEvent(e.clientX, e.clientY);
			}
		}}
		on:touchstart={(e) => {
			isMouseDown = true;
			onTouchEvent(e.touches[0]);
		}}
		on:touchmove|preventDefault|stopPropagation={(e) => onTouchEvent(e.touches[0])}
		bind:this={scrollBarHor}
	>
		<slot name="scrollMarker">
			<span
				id="scroll-marker"
				class="scroll-indicator-horizontal"
				style:--percent={`${percent}%`}
				bind:this={scrollMarkerElemHor}
				on:mousedown={(e) => {
					isMouseDown = true;
					onMarkerEvent(e.clientX, e.clientY);
				}}
				on:touchstart={(e) => {
					isMouseDown = true;
					onTouchEvent(e.touches[0]);
				}}
				on:touchmove|preventDefault|stopPropagation={(e) => onTouchEvent(e.touches[0])}
			/>
		</slot>
	</div>
	<div
		class="scroll-bar-vertical"
		bind:this={scrollBarVert}
		on:mousedown={(e) => {
			if ((e?.target?.className || '').indexOf('scroll-bar-vertical') > -1) {
				// onScrollbarEvent(e.offsetY, scrollBarVert?.clientHeight || 1);
				isMouseDown = true;
				onMarkerEvent(e.clientX, e.clientY);
			}
		}}
		on:touchstart={(e) => {
			isMouseDown = true;
			onTouchEvent(e.touches[0]);
		}}
		on:touchmove|preventDefault|stopPropagation={(e) => onTouchEvent(e.touches[0])}
	>
		<slot name="scrollMarkerVertical">
			<span
				id="scroll-marker-vertical"
				class="scroll-indicator-vertical"
				style:--percent={`${percent}%`}
				on:mousedown={(e) => {
					isMouseDown = true;
					onMarkerEvent(e.clientX, e.clientY);
				}}
				on:touchstart={(e) => {
					isMouseDown = true;
					onTouchEvent(e.touches[0]);
				}}
				on:touchmove|preventDefault|stopPropagation={(e) => onTouchEvent(e.touches[0])}
			/>
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
			width: 100%;
			border-radius: 20px;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			pointer-events: none;
		}
	}
	.scroll-indicator-horizontal {
		display: none;
		@media (--md) {
			display: block;
			width: var(--marker-size, 40px);
			height: var(--marker-size, 40px);
			background-color: var(--control-color-accent);
			border-radius: 100%;
			position: absolute;
			top: 50%;
			margin-left: var(--percent, 0%);
			transform: translate(-50%, -50%);
			/* transition: margin-left 0.3s; */
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
		display: inline-block;
		width: var(--marker-size, 40px);
		height: var(--marker-size, 40px);
		background-color: var(--control-color-accent);
		border-radius: 100%;
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		/* clamp needed to prevent translated absolute element from clipping off edges */
		top: clamp(5%, var(--percent), 95%);
	}

	@media (--md) {
		.scroll-bar-vertical,
		.scroll-bar-vertical::before,
		.scroll-indicator-vertical {
			display: none;
		}
	}
</style>
