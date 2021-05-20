import { createRouter, createWebHistory } from 'vue-router'
import Rank from '@/views/Rank.vue'
import Draft from '@/views/Draft.vue'
import Login from '@/views/Auth/Login.vue'
import Registration from '@/views/Auth/Registration.vue'
import ResetPassword from '@/views/Auth/ResetPassword.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
	{ 
		path: '/', 
		redirect: '/rank'
	},
	{ 
		path: '/rank', 
		component: Rank 
	},
	{ 
		path: '/draft', 
		component: Draft 
	},
	{ 
		path: '/login', 
		component: Login,
		meta: { hideSidebar: true }
	},
	{ 
		path: '/signup', 
		component: Registration,
		meta: { hideSidebar: true }
	},
	{ 
		path: '/reset-password', 
		component: ResetPassword,
		meta: { hideSidebar: true }
	},
	{
		path: '/:pathMatch(.*)*', 
		name: 'not-found',
		component: NotFound
	}
]

export default createRouter({
	history: createWebHistory(),
	routes
})