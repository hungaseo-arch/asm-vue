<script setup lang="ts">
import { computed } from 'vue'
import Layout from '@/components/Layout.vue'
import PageHeader from '@/components/PageHeader.vue'
import { salesOrders } from '@/data'
import { fmtIDRCompact, fmtNum, marginColor } from '@/lib/index'
import { DollarSign, TrendingUp, BarChart3, Package } from 'lucide-vue-next'

const productMargins = [
  { name:'TIRE TB_R', qty:3347,  sales:9_145_621_995,  margin:1_134_447_630, pct:12.4, ratio:56.3 },
  { name:'TIRE IND',  qty:1511,  sales:2_560_444_814,  margin:305_483_605,   pct:11.9, ratio:15.2 },
  { name:'TIRE AGR',  qty:403,   sales:880_566_491,    margin:257_957_955,   pct:29.3, ratio:12.8 },
  { name:'TUBE TB',   qty:34595, sales:6_743_641_696,  margin:476_786_099,   pct:7.1,  ratio:23.7 },
  { name:'TUBE OTR',  qty:4000,  sales:1_566_958_364,  margin:231_884_713,   pct:14.8, ratio:11.5 },
  { name:'FLAP TB',   qty:19606, sales:1_122_425_681,  margin:248_953_241,   pct:22.2, ratio:12.4 },
  { name:'TIRE TB_B', qty:1225,  sales:2_191_229_304,  margin:154_368_297,   pct:7.0,  ratio:7.7  },
  { name:'TIRE OTR',  qty:27,    sales:139_955_942,    margin:29_675_527,    pct:21.2, ratio:1.5  },
]
const TOTAL_SALES = 19_202_918_676

const custMargins = computed(() => {
  const acc: { name: string; sales: number; margin: number; qty: number; pct: number }[] = []
  salesOrders.forEach((so) => {
    const ex = acc.find((a) => a.name === so.customerName)
    if (ex) { ex.sales += so.totalAmount; ex.margin += so.totalAmount - so.totalCogs; ex.qty += so.qty }
    else acc.push({ name: so.customerName.replace('PT ','').replace('CV ','').slice(0,16), sales: so.totalAmount, margin: so.totalAmount - so.totalCogs, qty: so.qty, pct: 0 })
  })
  return acc.map((c) => ({ ...c, pct: +((c.margin / c.sales) * 100).toFixed(1) })).sort((a, b) => b.sales - a.sales)
})

const maxProdMargin = Math.max(...productMargins.map((p) => p.pct))
const COLORS = ['var(--chart-1)','var(--chart-2)','var(--chart-3)','var(--chart-4)','var(--primary)','var(--accent)','var(--destructive)']


</script>

<template>
  <Layout>
    <div class="p-6 space-y-4">
      <PageHeader title="Margin Analysis" subtitle="Margin by product type · Customer margin breakdown · Sales share analysis" />

      <div class="grid grid-cols-4 gap-4">
        <div v-for="kpi in [
          {label:'Total Sales',value:'Rp 19.2B',sub:'492 SKUs total',icon:DollarSign,bg:'bg-primary/10',color:'text-primary'},
          {label:'Total Margin',value:'Rp 2.0B',sub:'Total profit',icon:TrendingUp,bg:'bg-chart-1/10',color:'text-chart-1'},
          {label:'Avg Margin %',value:'10.5%',sub:'All products',icon:BarChart3,bg:'bg-chart-3/10',color:'text-chart-3'},
          {label:'Top Margin',value:'TIRE AGR',sub:'Margin 29.3%',icon:Package,bg:'bg-chart-2/10',color:'text-chart-2'},
        ]" :key="kpi.label" class="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div :class="`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${kpi.bg}`">
            <component :is="kpi.icon" class="w-4 h-4" :class="kpi.color" />
          </div>
          <div><p class="text-xs text-muted-foreground">{{ kpi.label }}</p><p class="text-lg font-bold font-mono text-foreground">{{ kpi.value }}</p><p class="text-[10px] text-muted-foreground">{{ kpi.sub }}</p></div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Margin bar chart -->
        <div class="bg-card rounded-xl border border-border p-4">
          <p class="text-sm font-semibold text-foreground mb-3">Margin % by Product Type</p>
          <div class="space-y-2">
            <div v-for="(row, i) in productMargins" :key="row.name" class="flex items-center gap-3 text-xs">
              <span class="text-muted-foreground w-20 shrink-0 text-right">{{ row.name }}</span>
              <div class="flex-1 h-5 bg-muted rounded-r-md overflow-hidden">
                <div class="h-full rounded-r-md flex items-center pl-1.5 text-[10px] text-white font-medium"
                  :style="{ width: `${(row.pct / maxProdMargin) * 100}%`, background: COLORS[i % COLORS.length] }">
                  {{ row.pct }}%
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Customer margin table -->
        <div class="bg-card rounded-xl border border-border p-4">
          <p class="text-sm font-semibold text-foreground mb-3">Margin by Customer</p>
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-border">
                  <th class="text-left py-2 text-muted-foreground font-medium">Customer</th>
                  <th class="text-right py-2 text-muted-foreground font-medium">Qty</th>
                  <th class="text-right py-2 text-muted-foreground font-medium">Sales</th>
                  <th class="text-right py-2 text-muted-foreground font-medium">Margin%</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(c, i) in custMargins.slice(0, 8)" :key="i" class="border-b border-border/50">
                  <td class="py-2 text-foreground">{{ c.name }}</td>
                  <td class="py-2 text-right font-mono text-muted-foreground">{{ fmtNum(c.qty) }}</td>
                  <td class="py-2 text-right font-mono">{{ fmtIDRCompact(c.sales) }}</td>
                  <td class="py-2 text-right"><span :class="['font-semibold', marginColor(c.pct)]">{{ c.pct }}%</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Full product margin table -->
      <div class="bg-card rounded-xl border border-border overflow-hidden">
        <div class="px-4 py-3 border-b border-border"><p class="text-sm font-semibold text-foreground">Margin by Product Type (Actual Data)</p></div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-border bg-muted/20">
                <th v-for="h in ['Product Type','Qty','Sales (IDR)','Margin (IDR)','Margin%','Sales Share','Margin Share']" :key="h" class="text-right first:text-left px-4 py-2.5 text-muted-foreground font-medium">{{ h }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in productMargins" :key="row.name" class="border-b border-border/50 hover:bg-muted/20">
                <td class="px-4 py-2.5 font-medium text-foreground">{{ row.name }}</td>
                <td class="px-4 py-2.5 text-right font-mono text-muted-foreground">{{ fmtNum(row.qty) }}</td>
                <td class="px-4 py-2.5 text-right font-mono text-foreground">{{ fmtIDRCompact(row.sales) }}</td>
                <td class="px-4 py-2.5 text-right font-mono text-foreground">{{ fmtIDRCompact(row.margin) }}</td>
                <td class="px-4 py-2.5 text-right"><span :class="['font-semibold', row.pct >= 20 ? 'text-chart-1' : row.pct >= 10 ? 'text-chart-3' : 'text-destructive']">{{ row.pct }}%</span></td>
                <td class="px-4 py-2.5 text-right"><div class="flex items-center justify-end gap-2"><div class="w-16 h-1.5 bg-muted rounded-full overflow-hidden"><div class="h-full bg-primary/60 rounded-full" :style="{ width: `${(row.sales / TOTAL_SALES) * 100}%` }" /></div><span class="font-mono text-muted-foreground">{{ ((row.sales / TOTAL_SALES) * 100).toFixed(1) }}%</span></div></td>
                <td class="px-4 py-2.5 text-right"><div class="flex items-center justify-end gap-2"><div class="w-16 h-1.5 bg-muted rounded-full overflow-hidden"><div class="h-full bg-chart-1/60 rounded-full" :style="{ width: `${row.ratio}%` }" /></div><span class="font-mono text-chart-1">{{ row.ratio }}%</span></div></td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="bg-primary/5 border-t-2 border-border">
                <td class="px-4 py-2.5 font-bold text-foreground">TOTAL</td>
                <td class="px-4 py-2.5 text-right font-mono font-bold text-foreground">{{ fmtNum(58773) }}</td>
                <td class="px-4 py-2.5 text-right font-mono font-bold text-foreground">Rp 19.2B</td>
                <td class="px-4 py-2.5 text-right font-mono font-bold text-primary">Rp 2.01B</td>
                <td class="px-4 py-2.5 text-right font-bold text-chart-1">10.5%</td>
                <td class="px-4 py-2.5 text-right font-mono font-bold text-foreground">100%</td>
                <td class="px-4 py-2.5 text-right font-mono font-bold text-foreground">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  </Layout>
</template>
