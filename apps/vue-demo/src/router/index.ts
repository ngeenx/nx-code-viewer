import { createRouter, createWebHistory } from 'vue-router';
import Layout from '../layout/Layout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', name: 'home', component: () => import('../pages/LandingPage.vue') },
        { path: 'basic-examples', name: 'basic-examples', component: () => import('../pages/BasicExamplesPage.vue') },
        { path: 'display-options', name: 'display-options', component: () => import('../pages/DisplayOptionsPage.vue') },
        { path: 'line-highlighting', name: 'line-highlighting', component: () => import('../pages/LineHighlightingPage.vue') },
        { path: 'interactive-features', name: 'interactive-features', component: () => import('../pages/InteractiveFeaturesPage.vue') },
        { path: 'border-styles', name: 'border-styles', component: () => import('../pages/BorderStylesPage.vue') },
        { path: 'theming', name: 'theming', component: () => import('../pages/ThemingPage.vue') },
        { path: 'diff-viewer', name: 'diff-viewer', component: () => import('../pages/DiffViewerPage.vue') },
        { path: 'multi-code-viewer', name: 'multi-code-viewer', component: () => import('../pages/MultiCodeViewerPage.vue') },
        { path: 'playground', name: 'playground', component: () => import('../pages/PlaygroundPage.vue') },
      ],
    },
  ],
});

export default router;
