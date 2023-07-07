<script>
	let sliderProps = {
		class: [$$restProps.class],
		min: [$$restProps.min] || 1,
		max: [$$restProps.max] || 100
	};
</script>

<input type="range" on:input {...sliderProps} {...$$restProps} />

<style>
</style>
