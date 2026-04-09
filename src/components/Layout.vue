<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ROUTE_PATHS } from '@/router'
import {
  ShoppingCart, FileText, PackageCheck, Building2, BarChart3,
  Package, Users, TrendingUp, Settings, ClipboardList,
  Truck, Bell, Search, User, BookOpen,
} from 'lucide-vue-next'
import SubGroup from './SubGroup.vue'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

const route = useRoute()
const appStore = useAppStore()
const { fxRate } = storeToRefs(appStore)

// 사이드바 그룹 열림/닫힘 상태 — React: useState(true) → Vue: ref(true)
const procOpen = ref(true)
const soOpen   = ref(true)
const saleOpen = ref(true)

const procMenu = [
  { label: 'New PO',         path: ROUTE_PATHS.PO_CREATE,     icon: FileText },
  { label: 'PO Processing',  path: ROUTE_PATHS.PO_PROCESSING, icon: ClipboardList },
  { label: 'Goods Receipt',  path: ROUTE_PATHS.GOODS_RECEIPT, icon: PackageCheck },
  { label: 'Suppliers',      path: ROUTE_PATHS.SUPPLIER,      icon: Building2 },
  { label: 'Cost Analysis',  path: ROUTE_PATHS.COST_ANALYSIS, icon: BarChart3 },
]
const soMenu = [
  { label: 'Sales (SO)', path: ROUTE_PATHS.SALES_ORDER, icon: ShoppingCart },
]
const salesMenu = [
  { label: 'Products',        path: ROUTE_PATHS.PRODUCT,        icon: Package },
  { label: 'Customers',       path: ROUTE_PATHS.CUSTOMER,       icon: Users },
  { label: 'Sales Analytics', path: ROUTE_PATHS.SALES_ANALYSIS, icon: TrendingUp },
  { label: 'Reports',         path: ROUTE_PATHS.REPORTS,        icon: BookOpen },
]
const bottomMenu = [
  { label: 'Settings', path: ROUTE_PATHS.SETTINGS, icon: Settings },
]

// computed — React: location.pathname 비교 → Vue: computed + useRoute
const isProcActive = computed(() => procMenu.some((m) => route.path === m.path))
const isSoActive   = computed(() => soMenu.some((m) => route.path === m.path))
const isSaleActive = computed(() => salesMenu.some((m) => route.path === m.path))

// 통화 포맷
const fmtNum = (v: number) => v.toLocaleString('id-ID')
</script>

<template>
  <div class="flex h-screen bg-background overflow-hidden">

    <!-- ── Sidebar ── -->
    <aside class="w-60 shrink-0 bg-sidebar flex flex-col border-r border-sidebar-border">

      <!-- Logo -->
      <RouterLink
        :to="ROUTE_PATHS.DASHBOARD"
        class="h-14 flex items-center px-4 border-b border-sidebar-border gap-2 hover:bg-sidebar-accent/30 transition-colors"
      >
        <div class="w-7 h-7 rounded bg-sidebar-primary flex items-center justify-center">
          <Truck class="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        <span class="text-sidebar-foreground font-bold text-base tracking-tight">ASM</span>
        <span class="text-sidebar-primary text-xs font-medium ml-1 mt-0.5">ERP</span>
      </RouterLink>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">

        <!-- Procurement 그룹 -->
        <div class="pt-2">
          <p class="px-3 text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider mb-1">
            Procurement
          </p>
          <!-- v-model:open → React의 open + onToggle prop 대체 -->
          <SubGroup
            label="Procurement (PROC)"
            :icon="ShoppingCart"
            :is-active="isProcActive"
            v-model:open="procOpen"
            :items="procMenu"
            badge="2"
          />
        </div>

        <!-- Sales 그룹 -->
        <div class="pt-2">
          <p class="px-3 text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider mb-1">
            Sales
          </p>
          <SubGroup
            label="Sales (SO)"
            :icon="ShoppingCart"
            :is-active="isSoActive"
            v-model:open="soOpen"
            :items="soMenu"
          />
        </div>

        <!-- Analytics 그룹 -->
        <div class="pt-2">
          <p class="px-3 text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider mb-1">
            Analytics
          </p>
          <SubGroup
            label="Products & Analytics"
            :icon="BarChart3"
            :is-active="isSaleActive"
            v-model:open="saleOpen"
            :items="salesMenu"
          />
        </div>

        <!-- Settings (하단 메뉴) -->
        <div class="pt-2 border-t border-sidebar-border mt-2">
          <RouterLink
            v-for="item in bottomMenu"
            :key="item.path"
            :to="item.path"
            :class="cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
              route.path === item.path
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            )"
          >
            <component :is="item.icon" class="w-4 h-4 shrink-0" />
            {{ item.label }}
          </RouterLink>
        </div>

      </nav>

      <!-- User Footer -->
      <div class="p-3 border-t border-sidebar-border">
        <div class="flex items-center gap-2.5 px-2 py-1.5">
          <div class="w-7 h-7 rounded-full bg-sidebar-primary/30 flex items-center justify-center">
            <User class="w-4 h-4 text-sidebar-primary" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sidebar-foreground text-xs font-medium truncate">Ahmad R.</p>
            <p class="text-sidebar-foreground/50 text-[10px] truncate">Sales Manager</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- ── Main Area ── -->
    <div class="flex-1 flex flex-col overflow-hidden">

      <!-- Top Header -->
      <header class="h-14 border-b border-border bg-background flex items-center px-6 gap-4 shrink-0">
        <div class="flex-1 flex items-center gap-3">
          <div class="relative">
            <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              class="h-8 w-64 pl-8 pr-3 text-sm rounded-md border border-input bg-muted/30 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Search PO/SO, customer, supplier..."
            />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="relative">
            <button class="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center">
              <Bell class="w-4 h-4 text-muted-foreground" />
            </button>
            <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
          </div>
          <div class="text-right ml-2">
            <p class="text-xs text-muted-foreground">FX Rate (IDR/USD)</p>
            <p class="text-sm font-mono font-semibold text-chart-3">{{ fmtNum(fxRate) }}</p>
          </div>
        </div>
      </header>

      <!-- Page Content — React: {children} → Vue: <slot /> -->
      <main class="flex-1 overflow-auto bg-muted/30">
        <slot />
      </main>

    </div>
  </div>
</template>
