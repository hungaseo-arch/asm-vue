import { createRouter, createWebHashHistory } from 'vue-router'

export const ROUTE_PATHS = {
  HOME: '/',
  DASHBOARD: '/',
  PO_CREATE: '/po-create',
  PO_PROCESSING: '/po-processing',
  GOODS_RECEIPT: '/goods-receipt',
  SUPPLIER: '/supplier',
  COST_ANALYSIS: '/cost-analysis',
  SALES_ORDER: '/sales-order',
  PRODUCT: '/product',
  CUSTOMER: '/customer',
  SALES_ANALYSIS: '/sales-analysis',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',               component: () => import('@/pages/DashboardPage.vue') },
    { path: '/po-create',      component: () => import('@/pages/POCreatePage.vue') },
    { path: '/po-processing',  component: () => import('@/pages/POProcessingPage.vue') },
    { path: '/goods-receipt',  component: () => import('@/pages/GoodsReceiptPage.vue') },
    { path: '/supplier',       component: () => import('@/pages/SupplierPage.vue') },
    { path: '/cost-analysis',  component: () => import('@/pages/CostAnalysisPage.vue') },
    { path: '/sales-order',    component: () => import('@/pages/SalesOrderPage.vue') },
    { path: '/product',        component: () => import('@/pages/ProductPage.vue') },
    { path: '/customer',       component: () => import('@/pages/CustomerPage.vue') },
    { path: '/sales-analysis', component: () => import('@/pages/SalesAnalysisPage.vue') },
    { path: '/reports',        component: () => import('@/pages/ReportsPage.vue') },
    { path: '/settings',       component: () => import('@/pages/SettingsPage.vue') },
    { path: '/:pathMatch(.*)*',component: () => import('@/pages/NotFoundPage.vue') },
  ],
})
