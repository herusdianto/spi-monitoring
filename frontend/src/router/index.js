import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/monitoring/new',
    name: 'NewMonitoring',
    component: () => import('@/views/MonitoringFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/monitoring/:id/edit',
    name: 'EditMonitoring',
    component: () => import('@/views/MonitoringFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/monitoring',
    name: 'MonitoringList',
    component: () => import('@/views/MonitoringListView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  if (!authStore.isInitialized) {
    await authStore.initialize();
  }
  
  const requiresAuth = to.meta.requiresAuth !== false;
  
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;