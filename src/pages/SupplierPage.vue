<script setup lang="ts">
import { ref, computed } from 'vue'
import Layout from '@/components/Layout.vue'
import PageHeader from '@/components/PageHeader.vue'
import { suppliers } from '@/data'
import type { SupplierTier } from '@/lib/index'
import { Search, Building2, Star, TrendingUp, Clock, DollarSign, XCircle, Plus, Award } from 'lucide-vue-next'

const tierColor: Record<SupplierTier, string> = {
  A: 'bg-chart-1/20 text-chart-1 border-chart-1/40',
  B: 'bg-chart-3/20 text-chart-3 border-chart-3/40',
  C: 'bg-destructive/20 text-destructive border-destructive/40',
}
const tierLabel: Record<SupplierTier, string> = {
  A: 'Excellent', B: 'Average', C: 'Needs Improvement',
}
const tierBorderColor: Record<SupplierTier, string> = {
  A: 'border-chart-1/40', B: 'border-chart-3/40', C: 'border-destructive/40',
}
const tierBadgeColor: Record<SupplierTier, string> = {
  A: 'bg-chart-1/20 text-chart-1', B: 'bg-chart-3/20 text-chart-3', C: 'bg-destructive/20 text-destructive',
}

// React: useState('') → Vue: ref('')
const search     = ref('')
const tierFilter = ref<SupplierTier | 'All'>('All')
const selectedId = ref<string | null>(null)

// React: computed from filter → Vue: computed
const filtered = computed(() =>
  suppliers.filter((s) => {
    const q = search.value.toLowerCase()
    const matchSearch = s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
    const matchTier = tierFilter.value === 'All' || s.tier === tierFilter.value
    return matchSearch && matchTier
  })
)

const selected = computed(() => suppliers.find((s) => s.id === selectedId.value) ?? null)

const avgOnTime   = computed(() => (suppliers.reduce((sum, s) => sum + s.onTimeRate, 0) / suppliers.length).toFixed(1))
const avgQuality  = computed(() => (suppliers.reduce((sum, s) => sum + s.qualityRate, 0) / suppliers.length).toFixed(1))
const totalOrdersM = computed(() => (suppliers.reduce((sum, s) => sum + s.totalOrdersUsd, 0) / 1_000_000).toFixed(2))

const kpis = computed(() => [
  { label: 'Registered Suppliers', value: suppliers.length,     sub: 'Total',                   icon: Building2, bg: 'bg-primary/10',  color: 'text-primary' },
  { label: 'Avg On-Time Rate',     value: `${avgOnTime.value}%`, sub: 'On-Time Delivery',        icon: Clock,     bg: 'bg-chart-1/10', color: 'text-chart-1' },
  { label: 'Avg Quality Rate',     value: `${avgQuality.value}%`,sub: 'Quality Pass Rate',       icon: Star,      bg: 'bg-chart-3/10', color: 'text-chart-3' },
  { label: 'Cumulative Orders',    value: `$${totalOrdersM.value}M`, sub: 'All Suppliers Combined', icon: DollarSign, bg: 'bg-accent/10', color: 'text-accent' },
])

const tiers = ['A', 'B', 'C'] as SupplierTier[]
const filterTabs = ['All', 'A', 'B', 'C'] as (SupplierTier | 'All')[]

function tierCount(tier: SupplierTier) {
  return suppliers.filter((s) => s.tier === tier).length
}
function tierPct(tier: SupplierTier) {
  return ((tierCount(tier) / suppliers.length) * 100).toFixed(0)
}

function toggleSelect(id: string) {
  selectedId.value = selectedId.value === id ? null : id
}

function onTimeColor(v: number) {
  return v >= 95 ? 'text-chart-1 font-semibold' : v >= 90 ? 'text-chart-3' : 'text-destructive'
}
function qualityColor(v: number) {
  return v >= 97 ? 'text-chart-1 font-semibold' : v >= 95 ? 'text-chart-3' : 'text-destructive'
}
function leadEfficiency(days: number) {
  return Math.max(0, 100 - (days - 40))
}
</script>

<template>
  <Layout>
    <div class="p-6 space-y-5">

      <PageHeader
        title="Supplier Management"
        subtitle="Supplier performance evaluation and Tier management — On-Time, Quality, Lead Time KPIs"
      >
        <template #actions>
          <button class="flex items-center gap-1.5 h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus class="w-3.5 h-3.5" /> Add Supplier
          </button>
        </template>
      </PageHeader>

      <!-- KPI Summary — v-for 리스트 렌더링 -->
      <div class="grid grid-cols-4 gap-4">
        <div v-for="kpi in kpis" :key="kpi.label"
          class="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div :class="`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${kpi.bg}`">
            <component :is="kpi.icon" class="w-4 h-4" :class="kpi.color" />
          </div>
          <div>
            <p class="text-xs text-muted-foreground">{{ kpi.label }}</p>
            <p class="text-2xl font-bold font-mono text-foreground">{{ kpi.value }}</p>
            <p class="text-xs text-muted-foreground">{{ kpi.sub }}</p>
          </div>
        </div>
      </div>

      <!-- Tier Distribution -->
      <div class="grid grid-cols-3 gap-4">
        <div v-for="tier in tiers" :key="tier"
          :class="`bg-card rounded-xl border p-4 flex items-center gap-4 ${tierBorderColor[tier]}`">
          <div :class="`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${tierBadgeColor[tier]}`">
            {{ tier }}
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Tier {{ tier }} — {{ tierLabel[tier] }}</p>
            <p class="text-2xl font-bold text-foreground">{{ tierCount(tier) }} suppliers</p>
            <p class="text-xs text-muted-foreground">{{ tierPct(tier) }}% share</p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-3">
        <div class="relative">
          <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <!-- v-model — React: value + onChange 대체 -->
          <input v-model="search"
            class="h-9 w-64 pl-8 pr-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Search supplier name or code..." />
        </div>
        <div class="flex items-center gap-2">
          <button v-for="t in filterTabs" :key="t"
            @click="tierFilter = t"
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium transition-colors border',
              tierFilter === t
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:border-primary/50'
            ]"
          >
            {{ t === 'All' ? 'All Suppliers' : `Tier ${t}` }}
          </button>
        </div>
      </div>

      <!-- Table + Detail Panel -->
      <div :class="['grid gap-4', selectedId ? 'grid-cols-5' : 'grid-cols-1']">

        <!-- Table -->
        <div :class="['bg-card rounded-xl border border-border overflow-hidden', selectedId ? 'col-span-3' : '']">
          <div class="px-4 py-3 border-b border-border">
            <p class="text-sm font-semibold text-foreground">
              Supplier List
              <span class="ml-2 bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full">
                {{ filtered.length }} suppliers
              </span>
            </p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-border bg-muted/20">
                  <th v-for="h in ['Code','Supplier Name','Country','Tier','On-Time','Quality','Lead Time','Total Orders','Active','Payment']"
                    :key="h" class="text-left px-3 py-2.5 text-muted-foreground font-medium whitespace-nowrap first:pl-4">
                    {{ h }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sup in filtered" :key="sup.id"
                  @click="toggleSelect(sup.id)"
                  :class="[
                    'border-b border-border/50 transition-colors cursor-pointer',
                    selectedId === sup.id ? 'bg-primary/5' : 'hover:bg-muted/30'
                  ]"
                >
                  <td class="px-4 py-2.5 font-mono text-foreground">{{ sup.code }}</td>
                  <td class="px-3 py-2.5 font-medium text-foreground max-w-[160px] truncate">{{ sup.name }}</td>
                  <td class="px-3 py-2.5 text-center text-muted-foreground">{{ sup.country }}</td>
                  <td class="px-3 py-2.5 text-center">
                    <span :class="`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${tierColor[sup.tier]}`">
                      Tier {{ sup.tier }} · {{ tierLabel[sup.tier] }}
                    </span>
                  </td>
                  <td class="px-3 py-2.5 text-center font-mono" :class="onTimeColor(sup.onTimeRate)">
                    {{ sup.onTimeRate }}%
                  </td>
                  <td class="px-3 py-2.5 text-center font-mono" :class="qualityColor(sup.qualityRate)">
                    {{ sup.qualityRate }}%
                  </td>
                  <td class="px-3 py-2.5 text-center font-mono text-muted-foreground">{{ sup.leadTimeDays }} days</td>
                  <td class="px-3 py-2.5 text-right font-mono text-foreground">
                    ${{ (sup.totalOrdersUsd / 1000).toFixed(0) }}K
                  </td>
                  <td class="px-3 py-2.5 text-center"
                    :class="sup.activeOrders > 0 ? 'text-chart-2 font-medium' : 'text-muted-foreground'">
                    {{ sup.activeOrders }} orders
                  </td>
                  <td class="px-3 py-2.5 text-center text-muted-foreground">{{ sup.paymentTerms }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Detail Panel — v-if 조건부 렌더링 -->
        <div v-if="selected" class="col-span-2 space-y-4">
          <div class="bg-card rounded-xl border border-border overflow-hidden">
            <div class="px-4 py-3 border-b border-border flex items-center justify-between">
              <p class="text-sm font-semibold text-foreground">Supplier Detail</p>
              <button @click="selectedId = null">
                <XCircle class="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <div class="p-4 space-y-4">
              <!-- Header -->
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 class="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p class="font-semibold text-foreground text-sm leading-tight">{{ selected.name }}</p>
                  <p class="text-xs text-muted-foreground font-mono mt-0.5">{{ selected.code }}</p>
                  <div class="mt-1">
                    <span :class="`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${tierColor[selected.tier]}`">
                      <Award class="w-3 h-3" />
                      Tier {{ selected.tier }} — {{ tierLabel[selected.tier] }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Score Bars -->
              <div class="space-y-3 bg-muted/30 rounded-lg p-3">
                <p class="text-xs font-medium text-foreground">Performance KPIs</p>
                <div>
                  <p class="text-xs text-muted-foreground mb-1">On-Time Rate</p>
                  <div class="flex items-center gap-2">
                    <div class="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div class="h-full rounded-full bg-chart-1 transition-all" :style="{ width: `${selected.onTimeRate}%` }" />
                    </div>
                    <span class="text-[11px] font-mono font-medium text-foreground w-10 text-right">{{ selected.onTimeRate }}%</span>
                  </div>
                </div>
                <div>
                  <p class="text-xs text-muted-foreground mb-1">Quality Rate</p>
                  <div class="flex items-center gap-2">
                    <div class="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div class="h-full rounded-full bg-chart-2 transition-all" :style="{ width: `${selected.qualityRate}%` }" />
                    </div>
                    <span class="text-[11px] font-mono font-medium text-foreground w-10 text-right">{{ selected.qualityRate }}%</span>
                  </div>
                </div>
                <div>
                  <p class="text-xs text-muted-foreground mb-1">Lead Time Efficiency (60-day baseline)</p>
                  <div class="flex items-center gap-2">
                    <div class="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div class="h-full rounded-full bg-accent transition-all" :style="{ width: `${leadEfficiency(selected.leadTimeDays)}%` }" />
                    </div>
                    <span class="text-[11px] font-mono font-medium text-foreground w-10 text-right">{{ leadEfficiency(selected.leadTimeDays) }}%</span>
                  </div>
                </div>
              </div>

              <!-- Detail rows -->
              <div class="space-y-2 text-xs">
                <div v-for="row in [
                  { label: 'Country',       value: selected.country },
                  { label: 'Contact',       value: selected.contact },
                  { label: 'Email',         value: selected.email },
                  { label: 'Payment Terms', value: selected.paymentTerms },
                  { label: 'Lead Time',     value: `${selected.leadTimeDays} days` },
                  { label: 'Active Orders', value: `${selected.activeOrders} orders` },
                  { label: 'Total Orders',  value: `$${(selected.totalOrdersUsd / 1000).toFixed(0)}K`, bold: true },
                  { label: 'Last Order',    value: selected.lastOrderDate, mono: true },
                ]" :key="row.label" class="flex items-start justify-between gap-2">
                  <span class="text-muted-foreground flex-shrink-0">{{ row.label }}</span>
                  <span :class="['text-right', row.mono ? 'font-mono' : '', row.bold ? 'font-semibold text-foreground' : 'text-foreground']">
                    {{ row.value }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2 pt-2">
                <button class="flex-1 h-8 text-xs rounded-md border border-border bg-background hover:bg-muted flex items-center justify-center gap-1 transition-colors">
                  <TrendingUp class="w-3.5 h-3.5" /> Order History
                </button>
                <button class="flex-1 h-8 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-1 transition-colors">
                  <Plus class="w-3.5 h-3.5" /> Create PO
                </button>
              </div>
            </div>
          </div>

          <!-- Improvement Note -->
          <div class="bg-card rounded-xl border border-chart-3/30 bg-chart-3/5 p-4">
            <p class="text-xs font-semibold text-chart-3 mb-2">💡 Improvements — Supplier Management</p>
            <ul class="space-y-1.5 text-xs text-muted-foreground">
              <li class="flex gap-2"><span class="text-chart-3">•</span> Auto Tier calculation based on On-Time, Quality, Lead Time KPIs (quarterly reassessment)</li>
              <li class="flex gap-2"><span class="text-chart-3">•</span> Per-supplier FOB price history tracking (with FX integration)</li>
              <li class="flex gap-2"><span class="text-chart-3">•</span> Automatic warning alerts for Tier C suppliers + alternative supplier suggestions</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  </Layout>
</template>
