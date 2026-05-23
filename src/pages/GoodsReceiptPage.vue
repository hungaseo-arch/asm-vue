<script setup lang="ts">
import { ref, computed } from 'vue'
import Layout from '@/components/Layout.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { goodsReceipts } from '@/data'
import { grStatusColor, fmtNum } from '@/lib/index'
import type { GRStatus } from '@/lib/index'
import { Search, PackageCheck, AlertTriangle, CheckCircle2, ClipboardList, Truck, XCircle } from 'lucide-vue-next'

const GR_STATUSES: (GRStatus | 'All')[] = ['All','Completed','Pending','In Progress','Partial','NG']

const search       = ref('')
const statusFilter = ref<GRStatus | 'All'>('All')
const selectedId   = ref<string | null>(null)

const filtered = computed(() =>
  goodsReceipts.filter((gr) => {
    const q = search.value.toLowerCase()
    const matchSearch = gr.grNo.toLowerCase().includes(q) || gr.poNo.toLowerCase().includes(q) || gr.supplier.toLowerCase().includes(q)
    const matchStatus = statusFilter.value === 'All' || gr.status === statusFilter.value
    return matchSearch && matchStatus
  })
)

const selected = computed(() => goodsReceipts.find((gr) => gr.id === selectedId.value) ?? null)

const totalGoodQty = computed(() => goodsReceipts.reduce((s, g) => s + g.goodQty, 0))
const totalNGQty   = computed(() => goodsReceipts.reduce((s, g) => s + g.ngQty, 0))
const ngRate = computed(() => {
  const total = totalGoodQty.value + totalNGQty.value
  return total > 0 ? ((totalNGQty.value / total) * 100).toFixed(1) : '0'
})

const kpis = computed(() => [
  { label: 'Total GR',        value: goodsReceipts.length,                                          sub: 'orders', icon: ClipboardList, bg: 'bg-primary/10',     color: 'text-primary' },
  { label: 'Completed',       value: goodsReceipts.filter((g) => g.status === 'Completed').length,  sub: 'orders', icon: CheckCircle2,  bg: 'bg-chart-1/10',    color: 'text-chart-1' },
  { label: 'Pending Receipt', value: goodsReceipts.filter((g) => g.status === 'Pending').length,    sub: 'orders', icon: Truck,         bg: 'bg-chart-3/10',    color: 'text-chart-3' },
  { label: 'NG Rate',         value: `${ngRate.value}%`, sub: `Total ${totalNGQty.value} pcs NG`,   icon: AlertTriangle, bg: 'bg-destructive/10', color: 'text-destructive' },
])

function toggleSelect(id: string) {
  selectedId.value = selectedId.value === id ? null : id
}

function qtyPct(qty: number, total: number) {
  return total > 0 ? `${(qty / total) * 100}%` : '0%'
}
</script>

<template>
  <Layout>
    <div class="p-6 space-y-5">

      <PageHeader
        title="Goods Receipt"
        subtitle="Goods receipt inspection status and NG claim management"
      >
        <template #actions>
          <button class="flex items-center gap-1.5 h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <PackageCheck class="w-3.5 h-3.5" /> Register Receipt
          </button>
        </template>
      </PageHeader>

      <!-- KPI Cards -->
      <div class="grid grid-cols-4 gap-4">
        <div v-for="kpi in kpis" :key="kpi.label"
          class="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
          <div :class="`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${kpi.bg}`">
            <component :is="kpi.icon" class="w-4 h-4" :class="kpi.color" />
          </div>
          <div>
            <p class="text-xs text-muted-foreground">{{ kpi.label }}</p>
            <p class="text-2xl font-bold text-foreground">{{ kpi.value }}</p>
            <p class="text-xs text-muted-foreground">{{ kpi.sub }}</p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-3 flex-wrap">
        <div class="relative">
          <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input v-model="search"
            class="h-9 w-64 pl-8 pr-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Search GR No / PO No / Supplier..." />
        </div>
        <div class="flex items-center gap-2">
          <button v-for="s in GR_STATUSES" :key="s"
            @click="statusFilter = s"
            :class="['px-3 py-1 rounded-full text-xs font-medium transition-colors border',
              statusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/50']"
          >{{ s }}</button>
        </div>
      </div>

      <!-- Table + Detail -->
      <div :class="['grid gap-4', selectedId ? 'grid-cols-5' : 'grid-cols-1']">

        <div :class="['bg-card rounded-xl border border-border overflow-hidden', selectedId ? 'col-span-3' : '']">
          <div class="px-4 py-3 border-b border-border">
            <p class="text-sm font-semibold text-foreground">
              Receipt List
              <span class="ml-2 bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full">{{ filtered.length }} orders</span>
            </p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-border bg-muted/20">
                  <th v-for="h in ['GR No.','Linked PO','Supplier','Warehouse','Scheduled Date','Total Qty','Good','NG','Container','Status']"
                    :key="h" class="text-left px-3 py-2.5 text-muted-foreground font-medium whitespace-nowrap first:pl-4">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="gr in filtered" :key="gr.id"
                  @click="toggleSelect(gr.id)"
                  :class="['border-b border-border/50 transition-colors cursor-pointer', selectedId === gr.id ? 'bg-primary/5' : 'hover:bg-muted/30']"
                >
                  <td class="px-4 py-2.5 font-mono text-foreground font-medium">{{ gr.grNo }}</td>
                  <td class="px-3 py-2.5 font-mono text-primary">{{ gr.poNo }}</td>
                  <td class="px-3 py-2.5 text-muted-foreground max-w-30 truncate">{{ gr.supplier.split(' ').slice(0, 2).join(' ') }}</td>
                  <td class="px-3 py-2.5 text-muted-foreground">{{ gr.warehouse }}</td>
                  <td class="px-3 py-2.5 text-center font-mono text-muted-foreground">{{ gr.grDate }}</td>
                  <td class="px-3 py-2.5 text-right font-mono text-foreground">{{ fmtNum(gr.totalQty) }}</td>
                  <td class="px-3 py-2.5 text-right font-mono" :class="gr.goodQty > 0 ? 'text-chart-1 font-semibold' : 'text-muted-foreground'">
                    {{ fmtNum(gr.goodQty) }}
                  </td>
                  <td class="px-3 py-2.5 text-right font-mono" :class="gr.ngQty > 0 ? 'text-destructive font-semibold' : 'text-muted-foreground'">
                    {{ fmtNum(gr.ngQty) }}
                  </td>
                  <td class="px-3 py-2.5 text-center font-mono text-muted-foreground">{{ gr.container }}</td>
                  <td class="px-3 py-2.5 text-center">
                    <StatusBadge :label="gr.status" :color-class="grStatusColor[gr.status]" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Detail Panel -->
        <div v-if="selected" class="col-span-2 space-y-4">
          <div class="bg-card rounded-xl border border-border overflow-hidden">
            <div class="px-4 py-3 border-b border-border flex items-center justify-between">
              <p class="text-sm font-semibold text-foreground">Receipt Detail</p>
              <button @click="selectedId = null">
                <XCircle class="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <div class="p-4 space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-mono font-bold text-foreground text-sm">{{ selected.grNo }}</span>
                <StatusBadge :label="selected.status" :color-class="grStatusColor[selected.status]" />
              </div>

              <!-- Inspection Result -->
              <div class="bg-muted/30 rounded-lg p-3">
                <p class="text-xs text-muted-foreground mb-2">Inspection Results</p>
                <div class="flex items-center gap-4">
                  <div class="text-center">
                    <p class="text-2xl font-bold font-mono text-foreground">{{ fmtNum(selected.totalQty) }}</p>
                    <p class="text-[10px] text-muted-foreground">Total Received Qty</p>
                  </div>
                  <div class="flex-1 space-y-1.5">
                    <div>
                      <div class="flex justify-between text-xs mb-0.5">
                        <span class="text-chart-1">Accepted Qty</span>
                        <span class="font-mono font-medium text-chart-1">{{ fmtNum(selected.goodQty) }}</span>
                      </div>
                      <div class="h-2 bg-muted rounded-full overflow-hidden">
                        <div class="h-full bg-chart-1 rounded-full" :style="{ width: qtyPct(selected.goodQty, selected.totalQty) }" />
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between text-xs mb-0.5">
                        <span class="text-destructive">NG Qty</span>
                        <span class="font-mono font-medium text-destructive">{{ fmtNum(selected.ngQty) }}</span>
                      </div>
                      <div class="h-2 bg-muted rounded-full overflow-hidden">
                        <div class="h-full bg-destructive rounded-full" :style="{ width: qtyPct(selected.ngQty, selected.totalQty) }" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Detail Rows -->
              <div class="space-y-2 text-xs">
                <div v-for="row in [
                  { label: 'Linked PO',    value: selected.poNo,       mono: true },
                  { label: 'Supplier',     value: selected.supplier },
                  { label: 'Warehouse',    value: selected.warehouse },
                  { label: 'Container No.',value: selected.container,  mono: true },
                  { label: 'Inspector',    value: selected.inspector },
                  { label: 'Receipt Date', value: selected.grDate,     mono: true },
                ]" :key="row.label" class="flex items-start justify-between gap-2">
                  <span class="text-muted-foreground shrink-0">{{ row.label }}</span>
                  <span :class="['text-right text-foreground', row.mono ? 'font-mono' : '']">{{ row.value }}</span>
                </div>
              </div>

              <!-- NG Alert -->
              <div v-if="selected.ngQty > 0"
                class="mt-3 bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-2">
                  <AlertTriangle class="w-3.5 h-3.5 text-destructive" />
                  <p class="text-xs font-medium text-destructive">NG Action Required</p>
                </div>
                <p class="text-xs text-muted-foreground">{{ selected.ngQty }}pcs NG detected. Please proceed with the supplier claim process.</p>
                <button class="mt-2 w-full h-7 text-xs rounded-md bg-destructive text-white hover:bg-destructive/90 transition-colors">
                  File Claim
                </button>
              </div>

              <!-- Start Inspection CTA -->
              <button v-if="selected.status === 'Pending'"
                class="w-full h-8 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-1.5 mt-2 transition-colors">
                <PackageCheck class="w-3.5 h-3.5" /> Start Inspection
              </button>
            </div>
          </div>

          <!-- Improvement Notes -->
          <div class="rounded-xl border border-chart-3/30 bg-chart-3/5 p-4">
            <p class="text-xs font-semibold text-chart-3 mb-2">💡 Improvements — Goods Receipt</p>
            <ul class="space-y-1.5 text-xs text-muted-foreground">
              <li class="flex gap-2"><span class="text-chart-3 shrink-0">•</span> Auto-trigger supplier claim on NG occurrence (linked to supplier code)</li>
              <li class="flex gap-2"><span class="text-chart-3 shrink-0">•</span> Container No. → real-time location tracking via shipping API integration</li>
              <li class="flex gap-2"><span class="text-chart-3 shrink-0">•</span> Auto inventory update after receipt (WH-Surabaya, WH-Karawang, etc.)</li>
              <li class="flex gap-2"><span class="text-chart-3 shrink-0">•</span> Mobile support for inspection checklist (size, pattern, PR, packaging condition)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
