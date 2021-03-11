<script>
import AuthButton from '@/components/AuthButton/AuthButton.vue'

export default {
	components: { AuthButton }
}
</script>

<template>
	<header class="app-header">
		<h1 class="app-header__title">SignStealing</h1> 
		<nav class="site-nav">
			<router-link to="rank">Rank</router-link>
			<!-- <router-link to="draft" disabled>Draft</router-link> -->
		</nav>
		<div class="auth">
			<AuthButton />
		</div>
	</header>
</template>

<style scoped>
.app-header {
	display: grid;
	grid-template: auto auto / auto auto;
	grid-gap: 2rem;
	justify-content: flex-start;
	padding: var(--space-xl);
	margin-top: var(--space);
}

.app-header__title {
	grid-row: 1;
	grid-column: 1;
	margin-bottom: var(--space);
}

.site-nav {
	grid-row: 2;
	grid-column: 1;
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.site-nav a {
	padding: var(--space-sm);
	margin-right: var(--space);
	color: var(--black);
	font-weight: var(--font-semi);
	text-decoration: none;
}

.site-nav a:active,
.site-nav a:hover {
	color: var(--black);
	text-decoration: none;
}

.site-nav a.router-link-active {
	border-bottom: var(--border-thickness) solid var(--accent);
}

.auth {
	grid-row: 1;
	grid-column: 2;
}
</style>