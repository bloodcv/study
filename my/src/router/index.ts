import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import List from '../views/List.vue'
import Detail from '../views/Detail.vue'
import Page1 from '../views/Page1.vue'
import Page2 from '../views/Page2.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      depth: 1
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      depth: 1
    }
  },
  {
    path: '/list',
    name: 'List',
    component: List,
    meta: {
      depth: 2
    }
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: Detail,
    meta: {
      depth: 3
    }
  },
  {
    path: '/page1',
    name: 'Page1',
    component: Page1,
    meta: {
      depth: 2
    }
  },
  {
    path: '/page2',
    name: 'Page2',
    component: Page2,
    meta: {
      depth: 2
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
