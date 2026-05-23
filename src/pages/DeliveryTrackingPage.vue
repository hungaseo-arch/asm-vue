<script setup lang="ts">
import { computed } from 'vue'
import Layout from '@/components/Layout.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { salesOrders } from '@/data'
import { deliveryStatusColor } from '@/lib/index'

const activeOrders = computed(() => salesOrders.filter((so) => so.deliveryStatus !== 'Cancelled'))

function deliveryBorderColor(s: string) {
  if (s === 'On Hold') return 'border-destructive/40'
  if (s === 'Delivered') return 'border-chart-1/40'
  if (s === 'In Transit') return 'border-chart-2/40'
  return 'border-chart-3/40'
}
function deliveryBarColor(s: string) {
  if (s === 'Delivered') return 'bg-chart-1'
  if (s === 'In Transit') return 'bg-chart-2'
  if (s === 'On Hold') return 'bg-destructive'
  return 'bg-chart-3'
}
</script>

<template>
  <Layout>
    <div class="p-6 space-y-4">
      <PageHeader title="Delivery Tracking" subtitle="Track shipment status · Origin WH · Tracking numbers · Arrival dates" />

      <div class="grid grid-cols-4 gap-4">
        <div v-for="s in ['Delivered','In Transit','Packing','On Hold']" :key="s"
          :class="`bg-card rounded-xl border p-4 text-center ${deliveryBorderColor(s)}`">
          <p class="text-2xl font-bold text-foreground">{{ salesOrders.filter((so) => so.deliveryStatus === s).length }}</p>
          <p class="text-xs text-muted-foreground mt-1">{{ s }}</p>
          <div class="mt-2 h-1 bg-muted rounded-full overflow-hidden">
            <div :class="['h-full rounded-full', deliveryBarColor(s)]"
              :style="{ width: `${(salesOrders.filter((so) => so.deliveryStatus === s).length / salesOrders.length) * 100}%` }" />
          </div>
        </div>
      </div>

      <div class="bg-card rounded-xl border border-border overflow-hidden">
        <div class="px-4 py-3 border-b border-border flex items-center justify-between">
          <p class="text-sm font-semibold text-foreground">Delivery Tracking</p>
          <span class="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full">{{ activeOrders.length }} items</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-border bg-muted/20">
                <th v-for="h in ['Order No.','Customer','Tracking No.','Origin WH','Ship Date','Est. Arrival','Actual Arrival','Status','Remarks']" :key="h" class="text-left px-3 py-2.5 text-muted-foreground font-medium whitespace-nowrap">{{ h }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="so in activeOrders" :key="so.id" class="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td class="px-3 py-2.5 font-mono text-foreground font-medium">{{ so.soNo }}</td>
                <td class="px-3 py-2.5 text-foreground max-w-32.5 truncate">{{ so.customerName }}</td>
                <td class="px-3 py-2.5 font-mono text-chart-2">{{ so.trackingNo || '—' }}</td>
                <td class="px-3 py-2.5 text-muted-foreground">{{ so.originWHShip || so.originWH }}</td>
                <td class="px-3 py-2.5 font-mono text-muted-foreground">{{ so.shipDate || '—' }}</td>
                <td class="px-3 py-2.5 font-mono text-muted-foreground">{{ so.estArrival || '—' }}</td>
                <td class="px-3 py-2.5 font-mono" :class="so.actualArrival ? 'text-chart-1 font-medium' : 'text-muted-foreground'">{{ so.actualArrival || '—' }}</td>
                <td class="px-3 py-2.5"><StatusBadge :label="so.deliveryStatus" :color-class="deliveryStatusColor[so.deliveryStatus]" /></td>
                <td class="px-3 py-2.5 text-muted-foreground max-w-25 truncate">{{ so.remarks || '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </Layout>
</template>
