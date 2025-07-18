<script>
	import ColorIcon from '../ColorIcon/ColorIcon.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	const onWindowClick = (objectClassName) => {
		if (objectClassName.includes('canvas')) dispatch('close');
	};
</script>

<svelte:window
	on:touchend={(e) => onWindowClick(e.target?.className || '')}
	on:mousedown={(e) => {
		onWindowClick(e.target?.className);
	}}
/>

<div class="colorOptions">
	<div class="colorOption first">
		<ColorIcon hexColor={'ff00ff'} />
	</div>
	<div class="colorOption second">
		<ColorIcon hexColor={'ff00ff'} />
	</div>
	<div class="colorOption third">
		<ColorIcon hexColor={'ff00ff'} />
	</div>
	<div class="colorOption fourth">
		<ColorIcon hexColor={'ff00ff'} />
	</div>
</div>

<style>
	.colorOptions {
		grid-area: colormenu;
		display: grid;
		width: 100%;

		height: 100%;

		grid-template-columns: 10px 1fr 1fr 1fr 1fr 10px;
		grid-template-rows: 5px 10rem 5px;
		grid-template-areas:
			'. . . . . .'
			'. first second third fourth .'
			'. . . . . .';

		background-color: hsla(1, 100%, 0%, 0.2);
	}

	.colorOption {
		width: 5rem;
		height: 5rem;
	}
	.first {
		grid-area: first;
	}
	.second {
		grid-area: second;
	}
	.third {
		grid-area: third;
	}
	.fourth {
		grid-area: fourth;
	}
</style>
