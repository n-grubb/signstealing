<script>
// import AuthButton from '@/components/AuthButton/AuthButton.vue'
import AppInfo from '@/components/AppInfo/AppInfo.vue'
import UserInfo from '@/components/UserInfo/UserInfo.vue'
import IconArrowToRight from '/@vite-icons/uil/arrow-to-right'
import IconArrowFromLeft from '/@vite-icons/uil/left-arrow-from-left'

export default {
	components: { 
		IconArrowToRight,
		IconArrowFromLeft,
		AppInfo, 
		UserInfo 
	},
	data() {
		return {
			isOpen: true
		}
	},
	methods: {
		toggleSidebar() {
			this.isOpen = !this.isOpen
		}
	}
}
</script>

<template>
	<button v-if="!isOpen" class="open-sidebar-btn button" @click="toggleSidebar">
		<IconArrowToRight />
	</button>
	<header :class="[ 'app-sidebar', { open: isOpen }]">
		<button class="close-sidebar-btn button" @click="toggleSidebar">
			<IconArrowFromLeft />
		</button>
		<nav class="site-nav">
			<router-link to="/">
				<h1 class="app-header__title">Sign Stealing</h1>
			</router-link>
			<router-link to="rank">Rank</router-link>
			<router-link to="draft">Draft</router-link>
		</nav>
		<div class="sidebar-bottom">
			<AppInfo />
			<UserInfo />
		</div>
	</header>
</template>

<style scoped>
.app-sidebar {
	position: relative;
	top: 0;
	left: -20rem;
	width: 0;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	transition: all .3s;
}

.app-sidebar.open {
	width: auto;
	left: 0;
}

/* provides a smoother close transition */
.app-sidebar:not(.open) > * {
	display: none;
}

.open-sidebar-btn, 
.close-sidebar-btn {
	position: absolute;
	top: 1rem; 
	left: 1rem;
	z-index: var(--elevation-lg);
}

.close-sidebar-btn {
	left: initial;
	top: .5rem;
	right: .5rem;
	border: none;
	background: transparent;
	box-shadow: none;
}

.open-sidebar-btn svg, 
.close-sidebar-btn svg {
	width: 1.5rem;
	height: 1.5rem;
}

.site-nav {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	padding: var(--space-xl) 0;
}

.app-header__title {
	margin-bottom: var(--space);
	font-size: var(--text-xl);
}

.site-nav a {
	padding: var(--space);
	color: var(--black);
	font-weight: var(--font-semi);
	text-align: left;
	text-decoration: none;
}

.site-nav a:active,
.site-nav a:hover {
	color: var(--black);
	text-decoration: none;
}

.site-nav a.router-link-active {
	border-left: calc(var(--border-thickness) * 4) solid var(--accent);
}

.site-nav a.disabled {
	color: var(--neutral);
}

.auth {
	grid-row: 1;
	grid-column: 2;
}
</style>