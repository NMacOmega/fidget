<script lang="ts">
	import Icon from '$lib/Icon/Icon.svelte';
	export let isOpen = false;
	$: icon = isOpen ? 'close' : 'play';
</script>

<button class={`open-btn ${isOpen && 'active'}`} on:click>
	<span class="buttonIcon">
		<Icon class={`fa-solid fa-${icon}`} />
	</span>
</button>

<style>
	.open-btn {
		width: 100%;
		border-radius: 8px;
		transition: all 1.1s;
		transform: translateX(0);
	}

	.active {
		transform: translateX(120%);
	}
</style>
