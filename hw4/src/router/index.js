import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import Testpost from '../views/Testpost.vue'
import AddPostView from '../views/AddPostView.vue'
import PostPage from '../views/PostPage.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: LoginView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path:"/posts",
    component: Testpost,
    meta: {requiresAuth: true}
  },
  {
    path:"/addpost",
    component: AddPostView,
    meta: {requiresAuth: true}
  },
  { path: '/posts/:id', 
    name: 'Post', 
    component: PostPage 
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const res = await fetch('http://localhost:3000/auth/check', {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.authenticated) {
        next();
      } else {
        next('/login');
      }
    } catch {
      next('/login');
    }
  } else {
    next();
  }
});

export default router
