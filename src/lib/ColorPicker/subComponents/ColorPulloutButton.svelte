<script>
	import Icon from '$lib/Icon/Icon.svelte';
	import MetalnessSlider from '$lib/MetalnessSlider/MetalnessSlider.svelte';
	import {
		colorStore as color,
		metalnessStore as metalness,
		opacityStore as opacity,
		roughnessStore as roughness,
		selectedUUIDStore
	} from '$lib/stores';
	export let isOpen = false;

	let icon, activeClass;

	//css variables
	let materialColor,
		alphaColor,
		metalColor,
		metalBackgroundColor,
		glossyColor,
		glossyBackgroundColor,
		alphaPath,
		metalPath,
		metalBackgroundPath,
		glossyPath,
		glossyBackgroundPath,
		transition = 'all 0.2s';

	const toggleTransition = (UUID_trigger) => {
		transition = 'all .2s';
		setTimeout(() => {
			transition = '';
		}, 200);
	};

	const generateStyle = (color, metalness, opacity, roughness) => {
		const { h = 0, s = 0, l = 0 } = color?.hsl;
		const dullS = s / 2,
			dullL = l / 2;
		materialColor = `hsl(${h}deg ${s}% ${l}%)`;
		alphaColor = `hsl(${h}deg ${dullS}% ${dullL}%)`;
		metalColor = `hsl(0deg 0% 60%)`;
		metalBackgroundColor = `hsl(0deg 0% 10%)`;
		glossyColor = `hsl(${h}deg 100% 70%)`;
		glossyBackgroundColor = `hsl(${h}deg 100% 10%)`;

		const glossiness = (1 - roughness || 0) * 100;
		const glossyPercent = 100 - glossiness;
		let metalPercent = 100 - metalness * 100;
		console.log(metalPercent);
		if (metalPercent > 97) metalPercent = 100;
		let alphaPercent = (1 - opacity) * 100;
		if (alphaPercent > 90) alphaPercent = 90;

		alphaPath = `polygon(0% ${alphaPercent}%, 100% ${alphaPercent}%, 100% 0%, 0% 0%)`;
		metalPath = `polygon(0% 100%, 100% 100%, 100% ${metalPercent}%, 0% ${metalPercent}%)`;
		metalBackgroundPath = `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)`;
		glossyPath = `polygon(0% 100%, 50% 100%, 50% ${glossyPercent}%, 0% ${glossyPercent}%)`;
		glossyBackgroundPath = `polygon(50% 0%, 0% 0%, 0% 100%, 50% 100%)`;
	};

	const onClick = () => {
		isOpen = !isOpen;
	};

	$: toggleTransition($selectedUUIDStore);
	$: generateStyle($color, $metalness, $opacity, $roughness);
	$: icon = isOpen ? 'close' : 'play';
	$: activeClass = isOpen ? 'active' : '';
</script>

<button
	class={`openColorPickerButton ${activeClass}`}
	style:--transition-timeout={transition}
	on:click={onClick}
>
	<span
		class="glossyBackground"
		style:--color={glossyBackgroundColor}
		style:--clip-path={glossyBackgroundPath}
	>
		<span class="glossySpan" style:--color={glossyColor} style:--clip-path={glossyPath} />
	</span>
	<span
		class="metalBackground"
		style:--color={metalBackgroundColor}
		style:--clip-path={metalBackgroundPath}
	>
		<span class="metalSpan" style:--color={metalColor} style:--clip-path={metalPath} />
	</span>
	<span class="colorSpan" style:--color={materialColor} />
	<span class="alphaSpan" style:--color={alphaColor} style:--clip-path={alphaPath} />
	<span class="iconSpan">
		<Icon class={`fa-solid fa-${icon}`} />
	</span>
</button>

<style>
	.openColorPickerButton {
		position: absolute;
		z-index: 1;
		left: 100%;
		top: -5%;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 100%;
		width: 75px;
		height: 75px;

		transition: all 1.1s;
		transform: translate(30%, 250%);
	}

	.active {
		transform: translate(-60%, -10%);
		width: 50px;
		height: 50px;
	}

	.openColorPickerButton span {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		transition: var(--transition-timeout);
	}

	.colorSpan {
		width: 100%;
		height: 100%;
		border-radius: 100%;
		border: 1px solid var(--border-color, #000);
		background-color: var(--color);
	}

	.alphaSpan {
		width: 100%;
		height: 100%;
		border-radius: 100%;
		background-color: var(--color);
		clip-path: var(--clip-path);
	}

	.iconSpan {
		width: 30%;
		height: 30%;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 100%;
	}

	.metalSpan,
	.metalBackground,
	.glossySpan,
	.glossyBackground {
		border-radius: 100%;
		background-color: var(--color, #eaeaea);
		clip-path: var(--clip-path);
	}

	.metalSpan,
	.glossySpan {
		width: 100%;
		height: 100%;
	}

	.metalBackground,
	.glossyBackground {
		width: 115%;
		height: 115%;
	}
</style>
