<script>
/** 
 * A component to wrap content in "Banner" styles
 */
</script>

<template>
  <div class="banner">
    <slot></slot>
	</div>
</template>

<style scoped>
.banner {
	padding: var(--space-lg);
	border: 3px solid var(--accent);
	border-radius: var(--border-radius);
	margin: var(--space) 0;
	background: var(--white);
}

.banner a {
	color: var(--emerald-dark);
	font-weight: var(--font-semi);
	text-decoration: underline;
}
</style>