import { createRouter, createWebHashHistory } from 'vue-router'

export const ROUTE_PATHS = {
  HOME: '/',
  DASHBOARD: '/',
  PO_CREATE: '/po-create',
  PO_PROCESSING: '/po-processing',
  GOODS_RECEIPT: '/goods-receipt',
  SUPPLIER: '/supplier',
  COST_ANALYSIS: '/cost-analysis',
  CREATE_SO: '/sales-order/create',
  SO_PROCESSING: '/sales-order/processing',
  DELIVERY_TRACKING: '/sales-order/delivery-tracking',
  MARGIN_ANALYSIS: '/sales-order/margin-analysis',
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
    { path: '/sales-order/create',      component: () => import('@/pages/SOCreatePage.vue') },
    { path: '/sales-order/processing',  component: () => import('@/pages/SOProcessingPage.vue') },
    { path: '/sales-order/delivery-tracking', component: () => import('@/pages/DeliveryTrackingPage.vue') },
    { path: '/sales-order/margin-analysis',   component: () => import('@/pages/MarginAnalysisPage.vue') },
    { path: '/product',        component: () => import('@/pages/ProductPage.vue') },
    { path: '/customer',       component: () => import('@/pages/CustomerPage.vue') },
    { path: '/sales-analysis', component: () => import('@/pages/SalesAnalysisPage.vue') },
    { path: '/reports',        component: () => import('@/pages/ReportsPage.vue') },
    { path: '/settings',       component: () => import('@/pages/SettingsPage.vue') },
    { path: '/:pathMatch(.*)*',component: () => import('@/pages/NotFoundPage.vue') },
  ],
})
