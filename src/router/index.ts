import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/basic-scene',
    name: 'BasicScene',
    component: () => import('../components/BasicScene.vue')
  },
  {
    path: '/model',
    name: 'Model',
    component: () => import('../components/ModelDemo.vue')
  },
  {
    path: '/texture',
    name: 'Texture',
    component: () => import('../components/TextureDemo.vue')
  },
  {
    path: '/shader',
    name: 'Shader',
    component: () => import('../components/ShaderDemo.vue')
  },
  {
    path: '/mouse-events',
    name: 'MouseEvents',
    component: () => import('../components/MouseEventsDemo.vue')
  },
  {
    path: '/scene-walk',
    name: 'SceneWalk',
    component: () => import('../components/SceneWalkDemo.vue')
  },
  {
    path: '/galaxy',
    name: 'Galaxy',
    component: () => import('../components/GalaxyDemo.vue')
  },
  {
    path: '/datacenter',
    name: 'DataCenter',
    component: () => import('../components/DataCenterDemo.vue')
  },
  {
    path: '/gallery-walk',
    name: 'GalleryWalk',
    component: () => import('../components/GalleryWalkDemo.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router