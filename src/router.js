import { createRouter, createWebHistory } from 'vue-router'
import Rank from '@/views/Rank.vue'

const routes = [
	{ 
		path: '/', 
		component: Rank 
	},
	{ 
		path: '/rank', 
		component: Rank 
	}
]

export default createRouter({
	history: createWebHistory(),
	routes
})