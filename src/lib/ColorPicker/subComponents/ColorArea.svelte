<script>
	export let color, saturation, value;

	let element,
		isMouseCaptured = false;

	const margin = { max: 95.5, min: -6.5 };
	//CSS Variables
	let left, top, leftPercent, topPercent, markerColor, flatMarkerColor;

	export const setMarkPos = (saturation = 0, value = 0) => {
		top = 100 - value;
		left = saturation;
	};
	const updateMarkerColor = (color) => {
		markerColor = color.hex;
		flatMarkerColor = `hsl(${color?.hsl?.h || '0'}, 100%, 50%)`;
	};

	const clampDifference = (a, b, max, min) => {
		const c = a - b;
		if (c > max) return max;
		if (c < min) return min;
		return c;
	};

	const onMouseMove = (e) => {
		if (!isMouseCaptured || !element) return;
		const { clientX: x, clientY: y } = e;
		const { top: t, left: l, width: w, height: h } = element.getBoundingClientRect();
		const s = (x / w) * 100;
		const v = (y / h) * 100;
		left = clampDifference(s, l, margin.max, margin.min);
		top = clampDifference(v, t, margin.max, margin.min);
		saturation = clampDifference(s, l, 100, 0);
		value = 100 - clampDifference(v, t, 100, 0);
	};

	window.addEventListener('mousemove', onMouseMove);
	window.addEventListener('mouseup', () => (isMouseCaptured = false));

	$: updateMarkerColor(color);
	$: leftPercent = `${left}%`;
	$: topPercent = `${top}%`;
</script>

<div
	class="colorArea"
	style:--left={leftPercent}
	style:--top={topPercent}
	style:--color={markerColor}
	style:--flatcolor={flatMarkerColor}
	on:mousedown={(e) => {
		isMouseCaptured = true;
		onMouseMove(e);
	}}
	bind:this={element}
>
	<div class="colorMarker" />
</div>

<style>
	.colorArea {
		position: relative;
		width: 95%;
		margin: auto;
		height: 100px;

		background-image: linear-gradient(rgba(0, 0, 0, 0), #000),
			linear-gradient(90deg, #fff, var(--flatcolor));
	}

	.colorMarker {
		position: absolute;
		border: 1px solid #fff;
		border-radius: 50%;
		cursor: pointer;
		left: var(--left, 0);
		top: var(--top, 0);
		width: 12px;
		height: 12px;
		background-color: var(--color);
	}
</style>
