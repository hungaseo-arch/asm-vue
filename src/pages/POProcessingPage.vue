<script setup lang="ts">
import { ref, computed } from 'vue'
import Layout from '@/components/Layout.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ApprovalStepper from '@/components/ApprovalStepper.vue'
import { purchaseOrders } from '@/data'
import { poStatusColor, approvalSteps, fmtUSD, fmtIDR, fmtNum } from '@/lib/index'
import type { POStatus } from '@/lib/index'
import { Search, Filter, Download, Eye, CheckCircle2, XCircle } from 'lucide-vue-next'

const ALL_STATUSES: (POStatus | 'All')[] = ['All','Draft','Pending','Confirmed','In Transit','On Hold','Cancelled']

const search       = ref('')
const statusFilter = ref<POStatus | 'All'>('All')
const selectedId   = ref<string | null>(null)

const filtered = computed(() =>
  purchaseOrders.filter((po) => {
    const q = search.value.toLowerCase()
    const matchSearch = po.poNo.toLowerCase().includes(q) || po.supplier.toLowerCase().includes(q)
    const matchStatus = statusFilter.value === 'All' || po.status === statusFilter.value
    return matchSearch && matchStatus
  })
)

const selected = computed(() => purchaseOrders.find((po) => po.id === selectedId.value) ?? null)

function toggleSelect(id: string) {
  selectedId.value = selectedId.value === id ? null : id
}

function approvalColor(status: string) {
  if (status === 'Confirmed') return 'text-chart-1'
  if (status === 'Rejected')  return 'text-destructive'
  return 'text-chart-3'
}

const pendingApproval = computed(() =>
  selected.value && ['Team Leader','Purchase Manager','Division Head','COO'].includes(selected.value.approvalStatus)
)

const improvements = [
  { title: 'Approval Line Visualization', tag: 'Implemented', color: 'text-chart-1 bg-chart-1/10',
    desc: 'Clearly shows 5-stage progress (Draft→Team Leader→Purchase Manager→Division Head→COO→Confirmed) via Stepper UI. Current pending stage highlighted; mobile approval support planned.' },
  { title: 'Status Color Coding', tag: 'Implemented', color: 'text-chart-1 bg-chart-1/10',
    desc: 'Confirmed(green), In Transit(blue), Pending(yellow), On Hold(red) for at-a-glance visibility. Quick status filtering via filter buttons.' },
  { title: 'FOB→WH Price Auto Calculation', tag: 'Planned', color: 'text-chart-3 bg-chart-3/10',
    desc: 'Linked with FX Rate: entering FOB auto-calculates CIF→Landed Cost→WH Price. Auto-applies import duty (BM 5%), IE, OF, LS, Claim 1%.' },
]
</script>

<template>
  <Layout>
    <div class="p-6 space-y-5">

      <PageHeader
        title="PO Processing (Purchase Order Management)"
        subtitle="View order list and manage by status — includes approval progress"
      >
        <template #actions>
          <button class="flex items-center gap-1.5 h-8 px-3 text-xs rounded-md border border-border bg-background hover:bg-muted transition-colors">
            <Download class="w-3.5 h-3.5" /> Export
          </button>
        </template>
      </PageHeader>

      <!-- Filters -->
      <div class="flex items-center gap-3">
        <div class="relative flex-1 max-w-xs">
          <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input v-model="search"
            class="w-full h-9 pl-8 pr-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Search PO number, supplier..." />
        </div>
        <div class="flex items-center gap-2">
          <Filter class="w-4 h-4 text-muted-foreground" />
          <span class="text-xs text-muted-foreground">Status:</span>
          <button v-for="s in ALL_STATUSES" :key="s"
            @click="statusFilter = s"
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium transition-colors border',
              statusFilter === s
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:border-primary/50'
            ]"
          >{{ s }}</button>
        </div>
      </div>

      <!-- Table + Detail -->
      <div :class="['grid gap-4', selectedId ? 'grid-cols-5' : 'grid-cols-1']">

        <!-- Table -->
        <div :class="['bg-card rounded-xl border border-border overflow-hidden', selectedId ? 'col-span-3' : '']">
          <div class="px-4 py-3 border-b border-border flex items-center justify-between">
            <p class="text-sm font-semibold text-foreground">
              All POs
              <span class="ml-2 bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full">{{ filtered.length }}</span>
            </p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-border bg-muted/20">
                  <th v-for="h in ['PO No.','Supplier','Product','Qty','Amount (USD)','Status','Approval','ETA','Action']"
                    :key="h" class="text-left px-3 py-2.5 text-muted-foreground font-medium whitespace-nowrap first:pl-4">
                    {{ h }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="po in filtered" :key="po.id"
                  @click="toggleSelect(po.id)"
                  :class="['border-b border-border/50 transition-colors cursor-pointer', selectedId === po.id ? 'bg-primary/5' : 'hover:bg-muted/30']"
                >
                  <td class="px-4 py-2.5 font-mono text-foreground font-medium">{{ po.poNo }}</td>
                  <td class="px-3 py-2.5 text-muted-foreground max-w-30 truncate">
                    {{ po.supplier.split(' ').slice(0, 2).join(' ') }}
                  </td>
                  <td class="px-3 py-2.5 text-foreground max-w-35 truncate">{{ po.productDesc }}</td>
                  <td class="px-3 py-2.5 text-right font-mono text-foreground">{{ fmtNum(po.qty) }}</td>
                  <td class="px-3 py-2.5 text-right font-mono font-semibold text-foreground">{{ fmtUSD(po.totalUsd) }}</td>
                  <td class="px-3 py-2.5 text-center">
                    <StatusBadge :label="po.status" :color-class="poStatusColor[po.status]" />
                  </td>
                  <td class="px-3 py-2.5 text-center text-[10px] font-medium" :class="approvalColor(po.approvalStatus)">
                    {{ po.approvalStatus }}
                  </td>
                  <td class="px-3 py-2.5 text-center font-mono text-muted-foreground text-[10px]">{{ po.etaDate }}</td>
                  <td class="px-3 py-2.5 text-center">
                    <button class="w-6 h-6 flex items-center justify-center rounded hover:bg-primary/10 text-muted-foreground hover:text-primary mx-auto">
                      <Eye class="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Detail Panel — v-if -->
        <div v-if="selected" class="col-span-2 space-y-4">

          <!-- PO Detail -->
          <div class="bg-card rounded-xl border border-border overflow-hidden">
            <div class="px-4 py-3 border-b border-border flex items-center justify-between">
              <p class="text-sm font-semibold text-foreground">PO Detail</p>
              <button @click="selectedId = null">
                <XCircle class="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <div class="p-4 space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-mono font-bold text-foreground text-sm">{{ selected.poNo }}</span>
                <StatusBadge :label="selected.status" :color-class="poStatusColor[selected.status]" />
              </div>
              <div class="space-y-2 text-xs">
                <div v-for="row in [
                  { label: 'Supplier',    value: selected.supplier },
                  { label: 'Order Date',  value: selected.poDate },
                  { label: 'ETA',         value: selected.etaDate },
                  { label: 'Warehouse',   value: selected.warehouse },
                  { label: 'Handler',     value: selected.buyer },
                  { label: 'Qty',         value: `${fmtNum(selected.qty)} ${selected.unit}` },
                  { label: 'Total (USD)', value: fmtUSD(selected.totalUsd),    bold: true },
                  { label: 'Total (IDR)', value: fmtIDR(selected.totalIdr),    bold: true },
                ]" :key="row.label" class="flex items-start justify-between gap-2">
                  <span class="text-muted-foreground shrink-0">{{ row.label }}</span>
                  <span :class="['text-right font-mono', row.bold ? 'font-semibold text-foreground' : 'text-foreground']">
                    {{ row.value }}
                  </span>
                </div>
                <div v-if="selected.remarks" class="pt-1 border-t border-border">
                  <span class="text-muted-foreground">Remarks: </span>
                  <span class="text-foreground">{{ selected.remarks }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Approval Stepper -->
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-xs font-semibold text-foreground mb-4">Approval Progress</p>
            <div class="overflow-x-auto pb-2">
              <ApprovalStepper :steps="approvalSteps" :current-step="selected.approvalStatus" />
            </div>
            <div v-if="pendingApproval" class="mt-4 flex gap-2">
              <button class="flex-1 h-8 text-xs rounded-md bg-chart-1 text-white hover:bg-chart-1/90 flex items-center justify-center gap-1 transition-colors">
                <CheckCircle2 class="w-3.5 h-3.5" /> Approve
              </button>
              <button class="flex-1 h-8 text-xs rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 flex items-center justify-center gap-1 transition-colors">
                <XCircle class="w-3.5 h-3.5" /> Reject
              </button>
            </div>
          </div>

          <!-- Cost Structure -->
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-xs font-semibold text-foreground mb-3">Cost Structure</p>
            <div class="space-y-2">
              <div v-for="row in [
                { label: 'FOB Price',    value: fmtUSD(selected.fobUsd),          pct: 87,  highlight: false },
                { label: 'CIF Price',    value: fmtUSD(selected.cifUsd),          pct: 92,  highlight: false },
                { label: 'Landed Cost', value: fmtIDR(selected.landedCostIdr),   pct: 100, highlight: true  },
                { label: 'WH Price',    value: fmtIDR(selected.whPriceIdr),      pct: 108, highlight: false },
              ]" :key="row.label" class="text-xs">
                <div class="flex justify-between mb-0.5">
                  <span :class="row.highlight ? 'text-foreground font-medium' : 'text-muted-foreground'">{{ row.label }}</span>
                  <span class="font-mono text-foreground">{{ row.value }}</span>
                </div>
                <div class="h-1 bg-muted rounded-full overflow-hidden">
                  <div :class="['h-full rounded-full transition-all', row.highlight ? 'bg-primary' : 'bg-primary/40']"
                    :style="{ width: `${row.pct}%` }" />
                </div>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
              <span class="text-muted-foreground">FX Rate</span>
              <span class="font-mono font-semibold text-chart-3">17,580 IDR/USD</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Improvement Notes -->
      <div class="bg-card rounded-xl border border-border p-4">
        <p class="text-sm font-semibold text-foreground mb-3">💡 PO Processing — Improvement Notes</p>
        <div class="grid grid-cols-3 gap-3">
          <div v-for="item in improvements" :key="item.title" class="border border-border rounded-lg p-3 space-y-1.5">
            <div class="flex items-center gap-2">
              <p class="text-sm font-medium text-foreground">{{ item.title }}</p>
              <span :class="`text-[10px] px-1.5 py-0.5 rounded font-medium ${item.color}`">{{ item.tag }}</span>
            </div>
            <p class="text-xs text-muted-foreground leading-relaxed">{{ item.desc }}</p>
          </div>
        </div>
      </div>

    </div>
  </Layout>
</template>
