<script>
	export let icon = 'circle';
	export let width = '100%';
	export let height = '100%';
</script>

<div class="container" style:width style:height>
	{#if icon === 'circle'}
		<span class="icon"> C </span>
	{:else}
		<span class="icon"> H </span>
	{/if}
</div>

<style>
	.container {
		border-radius: 100%;
		border: 1px solid black;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
