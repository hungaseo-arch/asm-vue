<script setup lang="ts">
import { ref, computed } from 'vue'
import Layout from '@/components/Layout.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ApprovalStepper from '@/components/ApprovalStepper.vue'
import { salesOrders } from '@/data'
import { deliveryStatusColor, paymentStatusColor, soApprovalSteps, fmtIDRCompact, fmtNum } from '@/lib/index'
import type { DeliveryStatus } from '@/lib/index'
import { Search, Filter, XCircle, CheckCircle2, AlertCircle, Truck, ClipboardList, Package } from 'lucide-vue-next'

const soSearch       = ref('')
const deliveryFilter = ref<DeliveryStatus | 'All'>('All')
const selectedSOId   = ref<string | null>(null)

const DELIVERY_STATUSES: (DeliveryStatus | 'All')[] = ['All','Delivered','In Transit','Packing','On Hold','Cancelled']

const filteredSO = computed(() =>
  salesOrders.filter((so) => {
    const q = soSearch.value.toLowerCase()
    const matchSearch = so.soNo.toLowerCase().includes(q) || so.customerName.toLowerCase().includes(q)
    const matchDel = deliveryFilter.value === 'All' || so.deliveryStatus === deliveryFilter.value
    return matchSearch && matchDel
  })
)
const selectedSO = computed(() => salesOrders.find((s) => s.id === selectedSOId.value) ?? null)
const procKpis = computed(() => [
  { label: 'Total Orders',     value: salesOrders.length,                                                  icon: ClipboardList, bg: 'bg-primary/10',     color: 'text-primary' },
  { label: 'Delivered',        value: salesOrders.filter((s) => s.deliveryStatus === 'Delivered').length,  icon: CheckCircle2,  bg: 'bg-chart-1/10',     color: 'text-chart-1' },
  { label: 'Shipping',         value: salesOrders.filter((s) => s.deliveryStatus === 'In Transit').length, icon: Truck,         bg: 'bg-chart-2/10',     color: 'text-chart-2' },
  { label: 'On Hold',          value: salesOrders.filter((s) => s.deliveryStatus === 'On Hold').length,    icon: AlertCircle,   bg: 'bg-destructive/10', color: 'text-destructive' },
  { label: 'Pending Approval', value: salesOrders.filter((s) => !['Confirmed','Rejected'].includes(s.approvalStatus)).length, icon: Package, bg: 'bg-chart-3/10', color: 'text-chart-3' },
])

function approvalColor(status: string) {
  if (status === 'Confirmed') return 'text-chart-1'
  if (status === 'Rejected')  return 'text-destructive'
  return 'text-chart-3'
}
</script>

<template>
  <Layout>
    <div class="p-6 space-y-4">
      <PageHeader title="SO Processing" subtitle="Sales Order list · Approval tracking · Filter by delivery status" />

      <div class="grid grid-cols-5 gap-3">
        <div v-for="kpi in procKpis" :key="kpi.label" class="bg-card rounded-xl border border-border p-3 flex items-center gap-3">
          <div :class="`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${kpi.bg}`">
            <component :is="kpi.icon" class="w-3.5 h-3.5" :class="kpi.color" />
          </div>
          <div><p class="text-xl font-bold text-foreground">{{ kpi.value }}</p><p class="text-[10px] text-muted-foreground">{{ kpi.label }}</p></div>
        </div>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <div class="relative">
          <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input v-model="soSearch" class="h-8 w-56 pl-8 pr-3 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring" placeholder="SO No., Customer Name..." />
        </div>
        <div class="flex items-center gap-1.5">
          <Filter class="w-3.5 h-3.5 text-muted-foreground" />
          <button v-for="s in DELIVERY_STATUSES" :key="s" @click="deliveryFilter = s"
            :class="['px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border', deliveryFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/40']">{{ s }}</button>
        </div>
      </div>

      <div :class="['grid gap-4', selectedSOId ? 'grid-cols-5' : 'grid-cols-1']">
        <div :class="['bg-card rounded-xl border border-border overflow-hidden', selectedSOId ? 'col-span-3' : '']">
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-border bg-muted/20">
                  <th v-for="h in ['SO No.','Order Date','Customer','Qty','Amount','Payment','Delivery','Approval','Sales Rep','Remarks']" :key="h" class="text-left px-3 py-2.5 text-muted-foreground font-medium whitespace-nowrap">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="so in filteredSO" :key="so.id"
                  @click="selectedSOId = selectedSOId === so.id ? null : so.id"
                  :class="['border-b border-border/50 cursor-pointer transition-colors', selectedSOId === so.id ? 'bg-primary/5' : 'hover:bg-muted/30']">
                  <td class="px-3 py-2 font-mono text-foreground font-medium">{{ so.soNo }}</td>
                  <td class="px-3 py-2 text-muted-foreground">{{ so.soDate }}</td>
                  <td class="px-3 py-2 text-foreground max-w-32.5 truncate">{{ so.customerName }}</td>
                  <td class="px-3 py-2 text-right font-mono">{{ fmtNum(so.qty) }}</td>
                  <td class="px-3 py-2 text-right font-mono font-semibold">{{ fmtIDRCompact(so.totalAmount) }}</td>
                  <td class="px-3 py-2"><StatusBadge :label="so.paymentStatus" :color-class="paymentStatusColor[so.paymentStatus]" /></td>
                  <td class="px-3 py-2"><StatusBadge :label="so.deliveryStatus" :color-class="deliveryStatusColor[so.deliveryStatus]" /></td>
                  <td class="px-3 py-2 text-[10px]" :class="approvalColor(so.approvalStatus)">{{ so.approvalStatus }}</td>
                  <td class="px-3 py-2 text-muted-foreground">{{ so.salesRep }}</td>
                  <td class="px-3 py-2 text-muted-foreground max-w-25 truncate">{{ so.remarks || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="selectedSO" class="col-span-2 space-y-3">
          <div class="bg-card rounded-xl border border-border p-4">
            <div class="flex justify-between items-center mb-3">
              <span class="font-mono font-bold text-foreground text-sm">{{ selectedSO.soNo }}</span>
              <button @click="selectedSOId = null"><XCircle class="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div class="space-y-2 text-xs">
              <div v-for="row in [{l:'Customer',v:selectedSO.customerName},{l:'Sales Rep',v:selectedSO.salesRep},{l:'Order Date',v:selectedSO.soDate},{l:'Est. Delivery',v:selectedSO.planDeliveryDate},{l:'Payment Terms',v:selectedSO.paymentTerms},{l:'Qty',v:`${fmtNum(selectedSO.qty)} Pcs`},{l:'Amount',v:fmtIDRCompact(selectedSO.totalAmount),bold:true},{l:'Margin',v:`${selectedSO.marginPct}%`,color:'text-chart-1'}]"
                :key="row.l" class="flex justify-between gap-2">
                <span class="text-muted-foreground">{{ row.l }}</span>
                <span :class="['text-right font-mono', (row as any).bold ? 'font-semibold text-foreground' : '', (row as any).color || 'text-foreground']">{{ row.v }}</span>
              </div>
            </div>
            <div class="mt-3 flex gap-2">
              <StatusBadge :label="selectedSO.deliveryStatus" :color-class="deliveryStatusColor[selectedSO.deliveryStatus]" />
              <StatusBadge :label="selectedSO.paymentStatus" :color-class="paymentStatusColor[selectedSO.paymentStatus]" />
            </div>
          </div>
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-xs font-semibold text-foreground mb-3">Order Items</p>
            <div v-for="item in selectedSO.items" :key="item.no" class="flex items-center justify-between py-2 border-b border-border/50 text-xs">
              <div><p class="text-foreground font-medium">{{ item.description }}</p><p class="text-muted-foreground">{{ item.type }} · {{ item.qty }}Pcs · Disc {{ item.discPct }}%</p></div>
              <div class="text-right"><p class="font-mono font-semibold text-foreground">{{ fmtIDRCompact(item.amount) }}</p><p class="text-chart-1 font-medium">{{ item.marginPct }}%</p></div>
            </div>
          </div>
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-xs font-semibold text-foreground mb-3">Approval Status</p>
            <div class="overflow-x-auto"><ApprovalStepper :steps="soApprovalSteps" :current-step="selectedSO.approvalStatus" /></div>
          </div>
        </div>
      </div>

    </div>
  </Layout>
</template>
