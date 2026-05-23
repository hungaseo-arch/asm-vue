<script setup lang="ts">
import { ref, computed } from 'vue'
import Layout from '@/components/Layout.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { customers, salesOrders } from '@/data'
import { fmtIDR, fmtIDRCompact } from '@/lib/index'
import { Search, Users, TrendingUp, AlertCircle, ShoppingCart, Plus, XCircle, Filter } from 'lucide-vue-next'

type CustomerStatus = 'Active' | 'On Hold' | 'Inactive'
const statusColor: Record<CustomerStatus, string> = {
  Active:    'bg-chart-1/20 text-chart-1 border-chart-1/40',
  'On Hold': 'bg-destructive/20 text-destructive border-destructive/40',
  Inactive:  'bg-muted text-muted-foreground border-border',
}

const search        = ref('')
const channelFilter = ref<'All' | 'Wholesale' | 'Retail'>('All')
const statusFilter  = ref<CustomerStatus | 'All'>('All')
const selectedId    = ref<string | null>(null)

const filtered = computed(() =>
  customers.filter((c) => {
    const q = search.value.toLowerCase()
    const matchSearch = c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    const matchCh = channelFilter.value === 'All' || c.channel === channelFilter.value
    const matchSt = statusFilter.value === 'All' || c.status === statusFilter.value
    return matchSearch && matchCh && matchSt
  })
)
const selected = computed(() => customers.find((c) => c.id === selectedId.value) ?? null)
const selectedOrders = computed(() =>
  selected.value ? salesOrders.filter((so) => so.customerCode === selected.value!.code) : []
)
const totalSales  = computed(() => customers.reduce((s, c) => s + c.totalSalesIdr, 0))
const avgMargin   = computed(() => (customers.reduce((s, c) => s + c.marginPct, 0) / customers.length).toFixed(1))
const onHoldCount = computed(() => customers.filter((c) => c.status === 'On Hold').length)

const kpis = computed(() => [
  { l: 'Total Customers',  v: `${customers.length} companies`, sub: 'Registered',       icon: Users,        bg: 'bg-primary/10',     color: 'text-primary'     },
  { l: 'This Month Sales', v: fmtIDRCompact(totalSales.value), sub: 'Combined',          icon: ShoppingCart, bg: 'bg-chart-1/10',     color: 'text-chart-1'     },
  { l: 'Avg Margin %',     v: `${avgMargin.value}%`,           sub: 'All customers avg', icon: TrendingUp,   bg: 'bg-chart-3/10',     color: 'text-chart-3'     },
  { l: 'Credit Watch',     v: `${onHoldCount.value} co.`,      sub: 'On Hold status',    icon: AlertCircle,  bg: 'bg-destructive/10', color: 'text-destructive' },
])

function toggleSelect(id: string) { selectedId.value = selectedId.value === id ? null : id }
function creditPct(used: number, limit: number) { return limit > 0 ? (used / limit) * 100 : 0 }
function creditBarColor(pct: number) { return pct >= 90 ? 'bg-destructive' : pct >= 70 ? 'bg-chart-3' : 'bg-chart-1' }
function marginColor(v: number) { return v >= 22 ? 'text-chart-1' : v >= 18 ? 'text-chart-3' : 'text-destructive' }
function dotColor(v: number) { return v >= 22 ? 'var(--chart-1)' : v >= 18 ? 'var(--chart-3)' : 'var(--destructive)' }

const quarterlyData = computed(() => {
  const orders = selectedOrders.value
  return [
    { q: 'Q1', amount: orders.filter((s) => s.soDate.startsWith('2026-0')).reduce((s, o) => s + o.totalAmount, 0) },
    { q: 'Q2', amount: orders.reduce((s, o) => s + o.totalAmount / 1.2, 0) },
    { q: 'Q3', amount: orders.reduce((s, o) => s + o.totalAmount / 1.5, 0) },
    { q: 'Q4', amount: orders.reduce((s, o) => s + o.totalAmount / 1.3, 0) },
  ]
})
const maxQBar = computed(() => Math.max(...quarterlyData.value.map((d) => d.amount)) || 1)
</script>

<template>
  <Layout>
    <div class="p-6 space-y-5">
      <PageHeader title="Customer Management" subtitle="Customer Credit Limit · Order History · Margin Analysis — Wholesale / Retail Channel">
        <template #actions>
          <button class="flex items-center gap-1.5 h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus class="w-3.5 h-3.5" />Add Customer
          </button>
        </template>
      </PageHeader>

      <!-- KPIs -->
      <div class="grid grid-cols-4 gap-4">
        <div v-for="kpi in kpis" :key="kpi.l" class="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div :class="`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${kpi.bg}`">
            <component :is="kpi.icon" class="w-4 h-4" :class="kpi.color" />
          </div>
          <div>
            <p class="text-xs text-muted-foreground">{{ kpi.l }}</p>
            <p class="text-xl font-bold font-mono text-foreground">{{ kpi.v }}</p>
            <p class="text-[10px] text-muted-foreground">{{ kpi.sub }}</p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-3 flex-wrap">
        <div class="relative">
          <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input v-model="search" class="h-9 w-56 pl-8 pr-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Search customer name or code..." />
        </div>
        <div class="flex items-center gap-2">
          <Filter class="w-3.5 h-3.5 text-muted-foreground" />
          <button v-for="ch in ['All', 'Wholesale', 'Retail']" :key="ch" @click="channelFilter = ch as any"
            :class="['px-3 py-1 rounded-full text-xs font-medium transition-colors border', channelFilter === ch ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/40']">{{ ch }}</button>
        </div>
        <div class="flex items-center gap-2">
          <button v-for="s in ['All', 'Active', 'On Hold']" :key="s" @click="statusFilter = s as any"
            :class="['px-3 py-1 rounded-full text-xs font-medium transition-colors border', statusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/40']">{{ s }}</button>
        </div>
      </div>

      <!-- Table + Detail -->
      <div :class="['grid gap-4', selectedId ? 'grid-cols-5' : 'grid-cols-1']">
        <div :class="['bg-card rounded-xl border border-border overflow-hidden', selectedId ? 'col-span-3' : '']">
          <div class="px-4 py-3 border-b border-border">
            <p class="text-sm font-semibold text-foreground">Customers <span class="ml-2 bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full">{{ filtered.length }} companies</span></p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-border bg-muted/20">
                  <th v-for="h in ['Code','Customer','City','Channel','Credit Usage','Payment Terms','This Month Sales','Margin%','vs Avg','Rep','Status']" :key="h" class="text-left px-3 py-2.5 text-muted-foreground font-medium whitespace-nowrap">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in filtered" :key="c.id" @click="toggleSelect(c.id)"
                  :class="['border-b border-border/50 cursor-pointer transition-colors', selectedId === c.id ? 'bg-primary/5' : 'hover:bg-muted/20', c.status === 'On Hold' ? 'bg-destructive/5' : '']">
                  <td class="px-3 py-2.5 font-mono text-[10px] text-foreground">{{ c.code }}</td>
                  <td class="px-3 py-2.5 font-medium text-foreground max-w-35 truncate">{{ c.name }}</td>
                  <td class="px-3 py-2.5 text-muted-foreground">{{ c.city }}</td>
                  <td class="px-3 py-2.5">
                    <span :class="['text-[10px] px-2 py-0.5 rounded-full font-medium border', c.channel === 'Wholesale' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-accent/10 text-accent border-accent/20']">{{ c.channel }}</span>
                  </td>
                  <td class="px-3 py-2.5 min-w-30">
                    <div class="space-y-0.5">
                      <div class="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div :class="['h-full rounded-full transition-all', creditBarColor(creditPct(c.creditUsed, c.creditLimit))]" :style="{ width: `${creditPct(c.creditUsed, c.creditLimit)}%` }" />
                      </div>
                      <div class="flex justify-between text-[10px] text-muted-foreground">
                        <span>{{ fmtIDRCompact(c.creditUsed) }}</span><span>{{ fmtIDRCompact(c.creditLimit) }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-2.5 text-muted-foreground">{{ c.paymentTerms }}</td>
                  <td class="px-3 py-2.5 font-mono font-semibold text-foreground">{{ fmtIDRCompact(c.totalSalesIdr) }}</td>
                  <td class="px-3 py-2.5 font-mono"><span :class="['font-semibold', marginColor(c.marginPct)]">{{ c.marginPct }}%</span></td>
                  <td class="px-3 py-2.5"><span :class="['font-mono text-[11px]', c.vsAvgMargin > 0 ? 'text-chart-1' : c.vsAvgMargin < 0 ? 'text-destructive' : 'text-muted-foreground']">{{ c.vsAvgMargin > 0 ? '+' : '' }}{{ c.vsAvgMargin }}%</span></td>
                  <td class="px-3 py-2.5 text-muted-foreground">{{ c.salesRep }}</td>
                  <td class="px-3 py-2.5"><StatusBadge :label="c.status" :color-class="statusColor[c.status as CustomerStatus]" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Detail Panel -->
        <div v-if="selected" class="col-span-2 space-y-4">
          <div class="bg-card rounded-xl border border-border p-4">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="font-bold text-foreground text-sm">{{ selected.name }}</h3>
                <p class="text-xs font-mono text-muted-foreground">{{ selected.code }}</p>
              </div>
              <div class="flex items-center gap-2">
                <StatusBadge :label="selected.status" :color-class="statusColor[selected.status as CustomerStatus]" />
                <button @click="selectedId = null"><XCircle class="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
              </div>
            </div>
            <div class="bg-muted/30 rounded-lg p-3 mb-3">
              <p class="text-xs font-medium text-foreground mb-2">Credit Limit Status</p>
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-muted-foreground text-xs">Available Balance</span>
                <span class="font-mono font-bold text-foreground">{{ fmtIDR(selected.creditBalance) }}</span>
              </div>
              <div class="h-3 bg-muted rounded-full overflow-hidden">
                <div :class="['h-full rounded-full transition-all', creditBarColor(creditPct(selected.creditUsed, selected.creditLimit))]" :style="{ width: `${creditPct(selected.creditUsed, selected.creditLimit)}%` }" />
              </div>
              <div class="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Used: {{ fmtIDR(selected.creditUsed) }}</span>
                <span :class="creditPct(selected.creditUsed, selected.creditLimit) >= 90 ? 'text-destructive font-medium' : ''">{{ creditPct(selected.creditUsed, selected.creditLimit).toFixed(0) }}% Used</span>
                <span>Limit: {{ fmtIDR(selected.creditLimit) }}</span>
              </div>
            </div>
            <div class="space-y-2 text-xs">
              <div v-for="row in [
                { l:'Channel',v:selected.channel },{ l:'City',v:selected.city },
                { l:'Contact',v:selected.phone },{ l:'Sales Rep',v:selected.salesRep },
                { l:'Payment Terms',v:selected.paymentTerms },{ l:'Margin %',v:`${selected.marginPct}%` },
                { l:'This Month Sales',v:fmtIDRCompact(selected.totalSalesIdr),bold:true },
                { l:'Join Date',v:selected.joinDate },{ l:'Last Order',v:selected.lastOrderDate },
                { l:'Trend',v:selected.trend,tc:selected.trend.includes('▲')?'text-chart-1':selected.trend.includes('▼')?'text-destructive':'text-muted-foreground' },
              ]" :key="row.l" class="flex justify-between gap-2">
                <span class="text-muted-foreground">{{ row.l }}</span>
                <span :class="['text-right', row.bold ? 'font-semibold text-foreground font-mono' : '', row.tc || 'text-foreground']">{{ row.v }}</span>
              </div>
            </div>
          </div>

          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-xs font-semibold text-foreground mb-3">Recent Orders</p>
            <p v-if="selectedOrders.length === 0" class="text-xs text-muted-foreground">No order history.</p>
            <div v-else class="space-y-3">
              <div>
                <p class="text-[10px] text-muted-foreground mb-1">Quarterly Sales (Est.)</p>
                <svg viewBox="0 0 200 60" class="w-full h-14">
                  <rect v-for="(d, i) in quarterlyData" :key="d.q" :x="10 + i * 48" :y="60 - (d.amount / maxQBar) * 50" width="32" :height="(d.amount / maxQBar) * 50" fill="var(--primary)" :opacity="0.4 + i * 0.15" rx="3" />
                  <text v-for="(d, i) in quarterlyData" :key="`l${i}`" :x="26 + i * 48" y="58" text-anchor="middle" font-size="8" fill="var(--muted-foreground)">{{ d.q }}</text>
                </svg>
              </div>
              <div v-for="so in selectedOrders.slice(0, 4)" :key="so.id" class="flex items-center justify-between py-2 border-b border-border/50 text-xs">
                <div>
                  <p class="font-mono text-foreground font-medium">{{ so.soNo }}</p>
                  <p class="text-muted-foreground">{{ so.soDate }} · {{ so.qty }}Pcs · {{ so.salesRep }}</p>
                </div>
                <div class="text-right">
                  <p class="font-mono font-semibold text-foreground">{{ fmtIDRCompact(so.totalAmount) }}</p>
                  <p class="text-chart-1 font-medium">{{ so.marginPct }}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Margin vs Average -->
      <div class="bg-card rounded-xl border border-border p-4">
        <p class="text-sm font-semibold text-foreground mb-4">Customer Margin vs Average (Top Customers)</p>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="c in customers.slice(0, 8)" :key="c.id" class="flex items-center gap-3 text-xs p-2.5 bg-muted/20 rounded-lg">
            <div class="w-2 h-2 rounded-full shrink-0" :style="{ background: dotColor(c.marginPct) }" />
            <span class="text-foreground flex-1 truncate">{{ c.name.replace('PT ', '').replace('CV ', '').slice(0, 18) }}</span>
            <span :class="['font-mono font-semibold', marginColor(c.marginPct)]">{{ c.marginPct }}%</span>
            <span :class="['font-mono text-[10px]', c.vsAvgMargin > 0 ? 'text-chart-1' : c.vsAvgMargin < 0 ? 'text-destructive' : 'text-muted-foreground']">{{ c.vsAvgMargin > 0 ? '+' : '' }}{{ c.vsAvgMargin }}%p</span>
            <span class="text-[11px] text-muted-foreground">{{ c.trend }}</span>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
