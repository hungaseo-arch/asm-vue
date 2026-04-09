<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTE_PATHS } from '@/router'
import Layout from '@/components/Layout.vue'
import KPICard from '@/components/KPICard.vue'
import {
  dashboardKPIs, purchaseOrders, salesOrders, customers, products,
  costComposition,
} from '@/data'
import {
  fmtIDRCompact, fmtUSD, fmtNum,
  poStatusColor, deliveryStatusColor,
} from '@/lib/index'
import {
  ShoppingCart, Clock, PackageCheck, DollarSign, TrendingUp,
  AlertTriangle, Plus, Users, Package, Truck, ArrowRight,
  CheckCircle2, AlertCircle, Activity,
} from 'lucide-vue-next'

const router = useRouter()

const PIE_COLORS = [
  'var(--primary)', 'var(--chart-2)', 'var(--chart-3)',
  'var(--chart-1)', 'var(--accent)', 'var(--destructive)',
]

// ── 통계 계산 — React 모듈 레벨 const → Vue computed (반응성 유지)
const soStats = computed(() => ({
  totalThisMonth: salesOrders.length,
  delivered:    salesOrders.filter((s) => s.deliveryStatus === 'Delivered').length,
  onHold:       salesOrders.filter((s) => s.deliveryStatus === 'On Hold').length,
  totalRevenue: salesOrders.reduce((s, o) => s + o.totalAmount, 0),
  totalMargin:  salesOrders.reduce((s, o) => s + (o.totalAmount - o.totalCogs), 0),
}))

const inventoryAlerts = computed(() => products.filter((p) => p.currentStock < p.minStock))
const creditAlerts    = computed(() => customers.filter((c) => c.creditUsed / c.creditLimit >= 0.9))
const approvalPending = computed(() =>
  salesOrders.filter((s) => !['Confirmed', 'Rejected'].includes(s.approvalStatus)).length
  + dashboardKPIs.pendingApproval,
)
const pendingSOs = computed(() =>
  salesOrders.filter((s) => !['Confirmed', 'Rejected'].includes(s.approvalStatus)).slice(0, 4),
)
const pendingPOs = computed(() =>
  purchaseOrders.filter((p) => !['Confirmed', 'Rejected'].includes(p.approvalStatus)).slice(0, 3),
)

const salesMonthly = [
  { month: 'Oct', sales: 8_124,  po: 148 },
  { month: 'Nov', sales: 9_234,  po: 162 },
  { month: 'Dec', sales: 11_450, po: 195 },
  { month: 'Jan', sales: 7_820,  po: 133 },
  { month: 'Feb', sales: 8_980,  po: 158 },
  { month: 'Mar', sales: 9_741,  po: 173 },
]

const marginPct = computed(() =>
  ((soStats.value.totalMargin / soStats.value.totalRevenue) * 100).toFixed(1),
)
const deliveryCompletion = computed(() =>
  Math.round((soStats.value.delivered / soStats.value.totalThisMonth) * 100),
)

const quickLinks = computed(() => [
  { label: 'New PO',        sub: 'New Order',       path: ROUTE_PATHS.PO_CREATE,     icon: PackageCheck,  bg: 'bg-chart-2/10 text-chart-2' },
  { label: 'New SO',        sub: 'Sales Order',      path: ROUTE_PATHS.SALES_ORDER,   icon: ShoppingCart,  bg: 'bg-primary/10 text-primary' },
  { label: 'Goods Receipt', sub: 'Inspection & NG',  path: ROUTE_PATHS.GOODS_RECEIPT, icon: CheckCircle2,  bg: 'bg-chart-1/10 text-chart-1' },
  { label: 'Suppliers',     sub: 'Performance',      path: ROUTE_PATHS.SUPPLIER,      icon: Users,         bg: 'bg-accent/10 text-accent' },
  { label: 'Cost Analysis', sub: 'FOB→Selling',      path: ROUTE_PATHS.COST_ANALYSIS, icon: TrendingUp,    bg: 'bg-chart-3/10 text-chart-3' },
  { label: 'Analytics',     sub: 'KPI & Reps',       path: ROUTE_PATHS.SALES_ANALYSIS,icon: Activity,      bg: 'bg-destructive/10 text-destructive' },
])

const customerStats = computed(() => [
  { l: 'All',            v: `${customers.length} co.`,                                            color: 'text-foreground' },
  { l: 'Active',         v: `${customers.filter((c) => c.status === 'Active').length} co.`,        color: 'text-chart-1' },
  { l: 'On Hold',        v: `${customers.filter((c) => c.status === 'On Hold').length} co.`,       color: 'text-destructive' },
  { l: 'Credit >90%',   v: `${creditAlerts.value.length} co.`,                                    color: 'text-chart-3' },
])

// 인벤토리 바 너비 계산
function stockPct(p: typeof products[0]) {
  return Math.min(100, (p.currentStock / (p.minStock * 2)) * 100)
}
function stockBarColor(p: typeof products[0]) {
  const pct = stockPct(p)
  if (p.currentStock < p.minStock) return 'bg-destructive'
  return pct < 60 ? 'bg-chart-3' : 'bg-chart-1'
}

// 간단한 SVG 차트 (recharts 대신 순수 SVG)
function areaPath(data: number[], w: number, h: number) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 10)
    return `${x},${y}`
  })
  return `M${pts.join('L')}`
}
</script>

<template>
  <Layout>
    <div class="p-6 space-y-6">

      <!-- ── Header ── -->
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-xl font-bold text-foreground">ASM ERP — Integrated Dashboard</h1>
          <p class="text-sm text-muted-foreground mt-0.5">
            Sales · Procurement · Inventory · Customer Overview | As of: 2026-03-17
          </p>
        </div>
        <div class="flex gap-2">
          <!-- @click — React: onClick={() => navigate(...)} -->
          <button
            @click="router.push(ROUTE_PATHS.PO_CREATE)"
            class="flex items-center gap-1.5 h-8 px-3 text-xs rounded-md border border-border bg-background hover:bg-muted transition-colors"
          >
            <Plus class="w-3.5 h-3.5" />New PO
          </button>
          <button
            @click="router.push(ROUTE_PATHS.SALES_ORDER)"
            class="flex items-center gap-1.5 h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus class="w-3.5 h-3.5" />New SO
          </button>
        </div>
      </div>

      <!-- ── Alert Banners — v-if 조건부 렌더링 ── -->
      <div v-if="inventoryAlerts.length > 0 || creditAlerts.length > 0" class="grid grid-cols-2 gap-3">
        <div v-if="inventoryAlerts.length > 0"
          class="flex items-center gap-3 bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3">
          <AlertTriangle class="w-4 h-4 text-destructive shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-destructive">Low Stock Alert</p>
            <p class="text-xs text-destructive/80 truncate">
              {{ inventoryAlerts.map((p) => `${p.size} ${p.pattern}`).join(', ') }}
              and {{ inventoryAlerts.length }} more
            </p>
          </div>
          <button
            @click="router.push(ROUTE_PATHS.PRODUCT)"
            class="h-7 px-2 text-xs border border-destructive/40 text-destructive hover:bg-destructive/10 rounded-md shrink-0 transition-colors"
          >View</button>
        </div>

        <div v-if="creditAlerts.length > 0"
          class="flex items-center gap-3 bg-chart-3/10 border border-chart-3/30 rounded-xl px-4 py-3">
          <AlertCircle class="w-4 h-4 text-chart-3 shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-chart-3">Credit Limit &gt;90%</p>
            <p class="text-xs text-chart-3/80 truncate">
              {{ creditAlerts.map((c) => c.name.replace('PT ', '').replace('CV ', '').slice(0, 12)).join(', ') }}
              and {{ creditAlerts.length }} more
            </p>
          </div>
          <button
            @click="router.push(ROUTE_PATHS.CUSTOMER)"
            class="h-7 px-2 text-xs border border-chart-3/40 text-chart-3 hover:bg-chart-3/10 rounded-md shrink-0 transition-colors"
          >View</button>
        </div>
      </div>

      <!-- ── Sales KPI Cards ── -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <ShoppingCart class="w-4 h-4 text-primary" />
          <p class="text-sm font-semibold text-foreground">Sales Overview</p>
          <button @click="router.push(ROUTE_PATHS.SALES_ORDER)"
            class="ml-auto text-xs text-primary hover:underline flex items-center gap-0.5">
            Go<ArrowRight class="w-3 h-3" />
          </button>
        </div>
        <div class="grid grid-cols-5 gap-4">
          <KPICard title="SO Orders (MTD)" :value="String(soStats.totalThisMonth)" sub="Mar Aggregate"
            :icon="ShoppingCart" icon-bg="bg-primary/10" />
          <KPICard title="Revenue (MTD)" :value="fmtIDRCompact(soStats.totalRevenue)" sub="SO Total"
            :icon="DollarSign" icon-bg="bg-chart-1/10" :mono="true" />
          <KPICard title="Gross Margin (MTD)" :value="fmtIDRCompact(soStats.totalMargin)"
            :sub="`${marginPct}% Margin`"
            :icon="TrendingUp" icon-bg="bg-chart-3/10" :mono="true" />
          <KPICard title="Delivered" :value="String(soStats.delivered)"
            :sub="`Completion ${deliveryCompletion}%`"
            :icon="Truck" icon-bg="bg-chart-2/10" />
          <KPICard title="On Hold" :value="String(soStats.onHold)" sub="Action needed"
            :icon="AlertTriangle" icon-bg="bg-destructive/10" />
        </div>
      </div>

      <!-- ── Purchase KPI Cards ── -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <PackageCheck class="w-4 h-4 text-chart-2" />
          <p class="text-sm font-semibold text-foreground">Purchase Overview</p>
          <button @click="router.push(ROUTE_PATHS.PO_PROCESSING)"
            class="ml-auto text-xs text-primary hover:underline flex items-center gap-0.5">
            Go<ArrowRight class="w-3 h-3" />
          </button>
        </div>
        <div class="grid grid-cols-5 gap-4">
          <KPICard title="PO Orders (MTD)" :value="String(dashboardKPIs.totalPOThisMonth)" sub="Mar Aggregate"
            :icon="PackageCheck" icon-bg="bg-chart-2/10" />
          <KPICard title="PO Value" :value="fmtUSD(dashboardKPIs.totalPOValueUSD)" sub="USD basis"
            :icon="DollarSign" icon-bg="bg-primary/10" :mono="true" />
          <KPICard title="Pending Approval" :value="String(approvalPending)" sub="SO+PO Combined"
            :icon="Clock" icon-bg="bg-chart-3/10" />
          <KPICard title="In Transit" :value="String(dashboardKPIs.inTransit)"
            :sub="`Avg ETA ${dashboardKPIs.avgLeadDays} days`"
            :icon="Truck" icon-bg="bg-chart-2/10" />
          <KPICard title="FX Rate" :value="fmtNum(dashboardKPIs.fxRateCurrent)"
            :sub="`${dashboardKPIs.fxRateChange > 0 ? '+' : ''}${dashboardKPIs.fxRateChange}% change`"
            :trend="dashboardKPIs.fxRateChange" :icon="Activity" icon-bg="bg-chart-3/10" :mono="true" />
        </div>
      </div>

      <!-- ── Charts Row ── -->
      <div class="grid grid-cols-3 gap-5">
        <!-- Area Chart (SVG native) -->
        <div class="col-span-2 bg-card rounded-xl border border-border p-4">
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm font-semibold text-foreground">Monthly Sales vs PO Orders (6M)</p>
            <span class="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full">IDR(M) / USD(K)</span>
          </div>
          <svg viewBox="0 0 560 200" class="w-full h-[200px]">
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stop-color="var(--primary)" stop-opacity="0.3" />
                <stop offset="95%" stop-color="var(--primary)" stop-opacity="0" />
              </linearGradient>
            </defs>
            <!-- Grid lines -->
            <line v-for="y in [40,80,120,160]" :key="y" x1="0" :y1="y" x2="560" :y2="y"
              stroke="var(--border)" stroke-dasharray="3,3" />
            <!-- Area fill -->
            <path
              :d="`${areaPath(salesMonthly.map(d=>d.sales), 520, 180)} L520,180 L0,180 Z`"
              fill="url(#salesGrad)" transform="translate(20,10)"
            />
            <!-- Line -->
            <path
              :d="areaPath(salesMonthly.map(d=>d.sales), 520, 180)"
              fill="none" stroke="var(--primary)" stroke-width="2" transform="translate(20,10)"
            />
            <!-- Bar (PO) -->
            <rect
              v-for="(d, i) in salesMonthly" :key="i"
              :x="20 + (i / (salesMonthly.length - 1)) * 520 - 10"
              :y="180 - (d.po / 200) * 160 + 10"
              width="16"
              :height="(d.po / 200) * 160"
              fill="var(--chart-2)" opacity="0.5" rx="2"
            />
            <!-- X labels -->
            <text
              v-for="(d, i) in salesMonthly" :key="`lbl-${i}`"
              :x="20 + (i / (salesMonthly.length - 1)) * 520"
              y="198" text-anchor="middle" font-size="10" fill="var(--muted-foreground)"
            >{{ d.month }}</text>
          </svg>
        </div>

        <!-- Cost Composition Pie (SVG native) -->
        <div class="bg-card rounded-xl border border-border p-4">
          <p class="text-sm font-semibold text-foreground mb-4">Cost Composition</p>
          <div class="flex justify-center mb-3">
            <svg viewBox="-1 -1 2 2" class="w-32 h-32" style="transform:rotate(-90deg)">
              <template v-for="(item, i) in costComposition" :key="i">
                <circle
                  :stroke="PIE_COLORS[i % PIE_COLORS.length]"
                  :stroke-dasharray="`${(item.value / 100) * 2 * Math.PI * 0.35} ${2 * Math.PI * 0.35}`"
                  :stroke-dashoffset="`-${costComposition.slice(0, i).reduce((a, b) => a + b.value, 0) / 100 * 2 * Math.PI * 0.35}`"
                  fill="none" stroke-width="0.3" r="0.35" cx="0" cy="0"
                />
              </template>
            </svg>
          </div>
          <!-- v-for 리스트 — React: costComposition.map() -->
          <div class="grid grid-cols-2 gap-x-2 gap-y-1">
            <div v-for="(item, i) in costComposition" :key="i"
              class="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <div class="w-2 h-2 rounded-full shrink-0"
                :style="{ background: PIE_COLORS[i % PIE_COLORS.length] }" />
              <span class="truncate">{{ item.name }}</span>
              <span class="font-mono text-foreground ml-auto">{{ item.value }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Bottom Tables ── -->
      <div class="grid grid-cols-4 gap-5">

        <!-- Recent SO — v-for 리스트 렌더링 -->
        <div class="col-span-2 bg-card rounded-xl border border-border overflow-hidden">
          <div class="px-4 py-3 border-b border-border flex items-center justify-between">
            <p class="text-sm font-semibold text-foreground">Recent Sales Orders</p>
            <button @click="router.push(ROUTE_PATHS.SALES_ORDER)"
              class="text-xs text-primary hover:underline flex items-center gap-0.5">
              View All<ArrowRight class="w-3 h-3" />
            </button>
          </div>
          <div class="divide-y divide-border">
            <div v-for="so in salesOrders.slice(0, 5)" :key="so.id"
              class="flex items-center gap-3 px-4 py-3">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono font-semibold text-foreground">{{ so.soNo }}</span>
                  <span :class="`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${deliveryStatusColor[so.deliveryStatus]}`">
                    {{ so.deliveryStatus }}
                  </span>
                </div>
                <p class="text-xs text-muted-foreground truncate mt-0.5">
                  {{ so.customerName }} · {{ so.salesRep }}
                </p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xs font-mono font-semibold text-foreground">{{ fmtIDRCompact(so.totalAmount) }}</p>
                <p class="text-[10px] text-chart-1 font-medium">{{ so.marginPct }}%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent PO -->
        <div class="bg-card rounded-xl border border-border overflow-hidden">
          <div class="px-4 py-3 border-b border-border flex items-center justify-between">
            <p class="text-sm font-semibold text-foreground">Recent Purchase Orders</p>
            <button @click="router.push(ROUTE_PATHS.PO_PROCESSING)"
              class="text-xs text-primary hover:underline flex items-center gap-0.5">
              View All<ArrowRight class="w-3 h-3" />
            </button>
          </div>
          <div class="divide-y divide-border">
            <div v-for="po in purchaseOrders.slice(0, 5)" :key="po.id"
              class="flex items-center gap-3 px-4 py-3">
              <div class="flex-1 min-w-0">
                <p class="text-xs font-mono font-semibold text-foreground">{{ po.poNo.slice(-7) }}</p>
                <p class="text-[10px] text-muted-foreground truncate">{{ po.supplier.slice(0, 20) }}…</p>
              </div>
              <div class="text-right shrink-0">
                <span :class="`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${poStatusColor[po.status]}`">
                  {{ po.status }}
                </span>
                <p class="text-[10px] font-mono text-muted-foreground mt-0.5">{{ fmtUSD(po.totalUsd) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Inventory + Customer -->
        <div class="space-y-4">
          <div class="bg-card rounded-xl border border-border p-4">
            <div class="flex items-center justify-between mb-3">
              <p class="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Package class="w-3.5 h-3.5 text-chart-3" />Inventory Status
              </p>
              <button @click="router.push(ROUTE_PATHS.PRODUCT)"
                class="text-xs text-primary hover:underline">View</button>
            </div>
            <div class="space-y-2">
              <div v-for="p in products" :key="p.id" class="text-xs">
                <div class="flex justify-between mb-0.5">
                  <span :class="['text-muted-foreground truncate max-w-[100px]', p.currentStock < p.minStock && 'text-destructive font-medium']">
                    {{ p.size }}
                  </span>
                  <span :class="['font-mono font-semibold', p.currentStock < p.minStock ? 'text-destructive' : 'text-chart-1']">
                    {{ fmtNum(p.currentStock) }}
                  </span>
                </div>
                <div class="h-1 bg-muted rounded-full overflow-hidden">
                  <div :class="['h-full rounded-full', stockBarColor(p)]" :style="{ width: `${stockPct(p)}%` }" />
                </div>
              </div>
            </div>
          </div>

          <div class="bg-card rounded-xl border border-border p-4">
            <div class="flex items-center justify-between mb-3">
              <p class="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Users class="w-3.5 h-3.5 text-accent" />Customer Overview
              </p>
              <button @click="router.push(ROUTE_PATHS.CUSTOMER)"
                class="text-xs text-primary hover:underline">All</button>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div v-for="item in customerStats" :key="item.l"
                class="bg-muted/30 rounded-lg p-2 text-center">
                <p class="text-[10px] text-muted-foreground">{{ item.l }}</p>
                <p :class="`text-sm font-bold ${item.color}`">{{ item.v }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Pending Approvals Table ── -->
      <div class="bg-card rounded-xl border border-border overflow-hidden">
        <div class="px-4 py-3 border-b border-border flex items-center justify-between">
          <p class="text-sm font-semibold text-foreground flex items-center gap-2">
            <Clock class="w-4 h-4 text-chart-3" />
            Pending Approvals
            <span class="bg-destructive/20 text-destructive text-[10px] px-1.5 py-0.5 rounded-full">
              {{ approvalPending }}
            </span>
          </p>
          <p class="text-xs text-muted-foreground">SO + PO Combined</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-border bg-muted/20">
                <th v-for="h in ['Type','Doc No.','Counterparty','Amount','Approval Stage','Handler','Date']"
                  :key="h" class="text-left px-4 py-2.5 text-muted-foreground font-medium whitespace-nowrap">
                  {{ h }}
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- v-for SO rows -->
              <tr v-for="so in pendingSOs" :key="so.id"
                class="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td class="px-4 py-2.5">
                  <span class="text-[10px] px-2 py-0.5 rounded bg-chart-1/10 text-chart-1 border border-chart-1/20 font-medium">SO</span>
                </td>
                <td class="px-4 py-2.5 font-mono font-medium text-foreground">{{ so.soNo }}</td>
                <td class="px-4 py-2.5 text-foreground max-w-[140px] truncate">{{ so.customerName }}</td>
                <td class="px-4 py-2.5 font-mono font-semibold text-foreground">{{ fmtIDRCompact(so.totalAmount) }}</td>
                <td class="px-4 py-2.5">
                  <span class="text-[10px] px-2 py-0.5 rounded bg-chart-3/10 text-chart-3 border border-chart-3/20 font-medium">
                    {{ so.approvalStatus }}
                  </span>
                </td>
                <td class="px-4 py-2.5 text-muted-foreground">{{ so.salesRep }}</td>
                <td class="px-4 py-2.5 text-muted-foreground">{{ so.soDate }}</td>
              </tr>
              <!-- v-for PO rows -->
              <tr v-for="po in pendingPOs" :key="po.id"
                class="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td class="px-4 py-2.5">
                  <span class="text-[10px] px-2 py-0.5 rounded bg-chart-2/10 text-chart-2 border border-chart-2/20 font-medium">PO</span>
                </td>
                <td class="px-4 py-2.5 font-mono font-medium text-foreground">{{ po.poNo }}</td>
                <td class="px-4 py-2.5 text-foreground max-w-[140px] truncate">{{ po.supplier.slice(0, 18) }}…</td>
                <td class="px-4 py-2.5 font-mono font-semibold text-foreground">{{ fmtUSD(po.totalUsd) }}</td>
                <td class="px-4 py-2.5">
                  <span class="text-[10px] px-2 py-0.5 rounded bg-chart-3/10 text-chart-3 border border-chart-3/20 font-medium">
                    {{ po.approvalStatus }}
                  </span>
                </td>
                <td class="px-4 py-2.5 text-muted-foreground">{{ po.buyer }}</td>
                <td class="px-4 py-2.5 text-muted-foreground">{{ po.poDate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── Quick Access ── -->
      <div class="grid grid-cols-6 gap-3">
        <button
          v-for="item in quickLinks" :key="item.label"
          @click="router.push(item.path)"
          class="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md hover:border-primary/30 transition-all"
        >
          <div :class="`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg}`">
            <component :is="item.icon" class="w-5 h-5" />
          </div>
          <div class="text-center">
            <p class="text-xs font-semibold text-foreground">{{ item.label }}</p>
            <p class="text-[10px] text-muted-foreground">{{ item.sub }}</p>
          </div>
        </button>
      </div>

    </div>
  </Layout>
</template>
