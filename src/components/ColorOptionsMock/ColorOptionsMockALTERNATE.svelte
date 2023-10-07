<script lang="ts">
	import Carousel from '@comps/Carousel/Carousel.svelte';
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
</script>

<Carousel onSwipe={true} onWheel />

<!-- <style> 
		:global([ref=scrollbar]) {
    background: green;
    color: white;
    padding: 5px;
    border-radius: .5rem;
}
:global([ref=scrollmarker]) {
    background: green;
    color: white;
    padding: 5px;
    border-radius: .5rem;
}

:global([ref=prev]) {
    background: green;
    color: white;
    padding: 5px;
    border-radius: .5rem;
}

:global([ref=next]) {
    background: green;
    color: white;
    padding: 5px;
    border-radius: .5rem;
} 
</style>-->
