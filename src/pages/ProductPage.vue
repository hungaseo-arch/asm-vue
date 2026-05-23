<script setup lang="ts">
import { ref, computed } from 'vue'
import Layout from '@/components/Layout.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { products, priceHistories } from '@/data'
import { fmtIDR, fmtUSD, fmtNum, fmtIDRCompact } from '@/lib/index'
import type { ProductStatus } from '@/lib/index'
import { Package, Plus, Search, AlertTriangle, TrendingUp, History, ClipboardList, ArrowUp, ArrowDown } from 'lucide-vue-next'

type ProdTab = 'register' | 'inventory' | 'price-history'

const statusColor: Record<ProductStatus, string> = {
  Active:       'bg-chart-1/20 text-chart-1 border-chart-1/40',
  Inactive:     'bg-muted text-muted-foreground border-border',
  Discontinued: 'bg-destructive/20 text-destructive border-destructive/40',
}

const WAREHOUSES = ['All', 'WH-Surabaya', 'WH-Karawang', 'WH-Semarang']
const PRICE_TYPES = ['All', 'WH Price', 'Retail', 'Wholesale', 'Promo']

// React: multiple useState → Vue: multiple refs
const tab           = ref<ProdTab>('inventory')
const selectedProdId = ref<string>(products[0]?.id ?? '')
const whTab         = ref('All')
const invSearch     = ref('')
const filterType    = ref('All')

// Register tab
const selectedProd = computed(() => products.find((p) => p.id === selectedProdId.value) ?? products[0]!)

// Inventory tab
const whFiltered = computed(() => products.filter((p) => whTab.value === 'All' || p.warehouse === whTab.value))
const lowStock   = computed(() => whFiltered.value.filter((p) => p.currentStock < p.minStock).length)
const totalStock = computed(() => whFiltered.value.reduce((s, p) => s + p.currentStock, 0))
const critical   = computed(() => whFiltered.value.filter((p) => p.currentStock < p.minStock))
const invFiltered = computed(() =>
  whFiltered.value.filter((p) => {
    const q = invSearch.value.toLowerCase()
    return p.size.toLowerCase().includes(q) || p.pattern.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
  })
)
const invKpis = computed(() => [
  { l: 'Registered SKUs',      v: `${products.length} SKUs`,           icon: Package,       bg: 'bg-primary/10',     color: 'text-primary' },
  { l: `Total Stock (${whTab.value})`, v: `${fmtNum(totalStock.value)} Pcs`, icon: ClipboardList, bg: 'bg-chart-1/10',     color: 'text-chart-1' },
  { l: 'Low Stock',            v: `${lowStock.value} items`,           icon: AlertTriangle, bg: 'bg-destructive/10', color: 'text-destructive' },
  { l: 'Inventory Value (WH)', v: fmtIDRCompact(whFiltered.value.reduce((s, p) => s + p.currentStock * p.whPriceIdr, 0)), icon: TrendingUp, bg: 'bg-chart-3/10', color: 'text-chart-3' },
])

// Price History tab
const filteredPH = computed(() =>
  priceHistories
    .filter((ph) => filterType.value === 'All' || ph.priceType === filterType.value)
    .sort((a, b) => b.date.localeCompare(a.date))
)

const tabs = [
  { key: 'register'      as ProdTab, label: 'Products',      icon: Plus    },
  { key: 'inventory'     as ProdTab, label: 'Inventory',     icon: Package },
  { key: 'price-history' as ProdTab, label: 'Price History', icon: History },
]

function bufferBarColor(pct: number) { return pct >= 100 ? 'bg-chart-1' : pct >= 50 ? 'bg-chart-3' : 'bg-destructive' }
function bufferTextColor(pct: number) { return pct >= 100 ? 'text-chart-1' : pct >= 50 ? 'text-chart-3' : 'text-destructive' }
function stockTextColor(p: typeof products[0]) {
  if (p.currentStock < p.minStock) return 'text-destructive'
  return p.bufferPct >= 100 ? 'text-chart-1' : 'text-chart-3'
}
</script>

<template>
  <Layout>
    <div class="p-6 space-y-4">
      <PageHeader title="Product Management" subtitle="Products · Inventory · Price History — Approval Draft→COO→Confirmed" />

      <!-- Tab Switcher -->
      <div class="flex items-center gap-1 bg-muted/40 p-1 rounded-xl w-fit">
        <button v-for="t in tabs" :key="t.key" @click="tab = t.key"
          :class="['flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            tab === t.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground']">
          <component :is="t.icon" class="w-3.5 h-3.5" />{{ t.label }}
        </button>
      </div>

      <!-- ── Register Tab ── -->
      <div v-if="tab === 'register'" class="grid grid-cols-3 gap-4">
        <!-- Product List -->
        <div class="bg-card rounded-xl border border-border overflow-hidden">
          <div class="px-4 py-3 border-b border-border flex items-center justify-between">
            <p class="text-sm font-semibold text-foreground">Product List</p>
            <button class="flex items-center gap-1 h-7 px-2 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus class="w-3 h-3" />Register
            </button>
          </div>
          <div class="divide-y divide-border">
            <div v-for="prod in products" :key="prod.id"
              @click="selectedProdId = prod.id"
              :class="['px-4 py-3 cursor-pointer transition-colors', selectedProdId === prod.id ? 'bg-primary/5 border-l-2 border-primary' : 'hover:bg-muted/20']">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <p class="text-xs font-semibold text-foreground truncate">{{ prod.brand }} {{ prod.size }} {{ prod.pattern }} {{ prod.pr }}PR</p>
                  <p class="text-[10px] text-muted-foreground">{{ prod.type1 }} / {{ prod.category }}</p>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-xs font-mono font-semibold text-foreground">{{ fmtIDRCompact(prod.retailPriceIdr) }}</p>
                  <span :class="`text-[10px] px-1.5 py-0.5 rounded border ${statusColor[prod.status]}`">{{ prod.status }}</span>
                </div>
              </div>
              <div v-if="prod.currentStock < prod.minStock" class="mt-1.5 flex items-center gap-1 text-[10px] text-destructive">
                <AlertTriangle class="w-3 h-3" />Low Stock ({{ prod.currentStock }}pcs &lt; min {{ prod.minStock }}pcs)
              </div>
            </div>
          </div>
        </div>

        <!-- Detail (col-span-2) -->
        <div class="col-span-2 space-y-4">
          <div class="bg-card rounded-xl border border-border p-4">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="font-bold text-foreground">{{ selectedProd.brand }} {{ selectedProd.size }} {{ selectedProd.pattern }} {{ selectedProd.pr }}PR</h3>
                <p class="text-xs text-muted-foreground font-mono mt-0.5">{{ selectedProd.code }}</p>
              </div>
              <StatusBadge :label="selectedProd.status" :color-class="statusColor[selectedProd.status]" />
            </div>
            <div class="grid grid-cols-3 gap-4">
              <!-- I Basic Info -->
              <div>
                <p class="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <span class="w-5 h-5 bg-primary/20 text-primary rounded text-[10px] flex items-center justify-center font-bold">I</span> Basic Info
                </p>
                <div class="space-y-1.5 text-xs">
                  <div v-for="r in [{l:'Brand',v:selectedProd.brand},{l:'Category',v:selectedProd.category},{l:'Size',v:selectedProd.size},{l:'Pattern',v:selectedProd.pattern},{l:'PR',v:selectedProd.pr},{l:'Type 1',v:selectedProd.type1},{l:'Type 2',v:selectedProd.type2},{l:'Type 3',v:selectedProd.type3}]"
                    :key="r.l" class="flex justify-between gap-2">
                    <span class="text-muted-foreground">{{ r.l }}</span>
                    <span class="font-medium text-foreground">{{ r.v }}</span>
                  </div>
                </div>
              </div>
              <!-- II Cost Info -->
              <div>
                <p class="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <span class="w-5 h-5 bg-primary/20 text-primary rounded text-[10px] flex items-center justify-center font-bold">II</span> Import & Cost Info
                </p>
                <div class="space-y-1.5 text-xs">
                  <div v-for="r in [
                    {l:'FOB Price',v:fmtUSD(selectedProd.fobUsd),bold:true},{l:'CIF Price',v:fmtUSD(selectedProd.cifUsd),bold:true},
                    {l:'WH Price',v:fmtIDR(selectedProd.whPriceIdr),bold:true},{l:'FX Rate',v:`${fmtNum(selectedProd.fxRate)} IDR/USD`},
                    {l:'HS Code',v:selectedProd.hsCode},{l:'Last FX Update',v:selectedProd.lastFxUpdate},
                  ]" :key="r.l" class="flex justify-between gap-2">
                    <span class="text-muted-foreground">{{ r.l }}</span>
                    <span :class="['font-mono', r.bold ? 'font-semibold text-foreground' : 'text-foreground']">{{ r.v }}</span>
                  </div>
                </div>
              </div>
              <!-- III Pricing -->
              <div>
                <p class="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <span class="w-5 h-5 bg-primary/20 text-primary rounded text-[10px] flex items-center justify-center font-bold">III</span> Price Info
                </p>
                <div class="space-y-1.5 text-xs">
                  <div v-for="r in [
                    {l:'Retail Price',v:fmtIDR(selectedProd.retailPriceIdr),bold:true,color:''},
                    {l:'Retail Margin',v:`${selectedProd.retailMarginPct}%`,bold:false,color:'text-chart-1'},
                    {l:'Wholesale',v:fmtIDR(selectedProd.wholesalePriceIdr),bold:true,color:''},
                    {l:'WS Margin',v:`${selectedProd.wholesaleMarginPct}%`,bold:false,color:'text-chart-1'},
                    {l:'Promo Price',v:fmtIDR(selectedProd.promoPriceIdr),bold:false,color:''},
                    {l:'Promo Margin',v:`${selectedProd.promoMarginPct}%`,bold:false,color:selectedProd.promoMarginPct < 10 ? 'text-destructive' : 'text-chart-3'},
                  ]" :key="r.l" class="flex justify-between gap-2">
                    <span class="text-muted-foreground">{{ r.l }}</span>
                    <span :class="['font-mono', r.bold ? 'font-semibold text-foreground' : '', r.color || 'text-foreground']">{{ r.v }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- IV Stock Settings -->
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
              <span class="w-5 h-5 bg-primary/20 text-primary rounded text-[10px] flex items-center justify-center font-bold">IV</span> Stock Settings
            </p>
            <div class="grid grid-cols-3 gap-4 text-xs">
              <div v-for="r in [
                {l:'Min. Stock Alert',v:`${selectedProd.minStock} Pcs`,bold:false},
                {l:'Reorder Point',v:`${selectedProd.reorderPoint} Pcs`,bold:false},
                {l:'Current Stock',v:`${fmtNum(selectedProd.currentStock)} Pcs`,bold:true},
                {l:'Buffer Stock %',v:`${selectedProd.bufferPct}%`,bold:false},
                {l:'Default WH',v:selectedProd.warehouse,bold:false},
                {l:'Approval Status',v:selectedProd.approvalStatus,bold:false},
              ]" :key="r.l" class="bg-muted/30 rounded-lg p-3">
                <p class="text-muted-foreground mb-1">{{ r.l }}</p>
                <p :class="['font-mono font-semibold', r.bold ? (selectedProd.currentStock < selectedProd.minStock ? 'text-destructive' : 'text-chart-1') : 'text-foreground']">{{ r.v }}</p>
              </div>
            </div>
            <div v-if="selectedProd.currentStock < selectedProd.minStock" class="mt-3 flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2.5">
              <AlertTriangle class="w-3.5 h-3.5 text-destructive shrink-0" />
              <p class="text-xs text-destructive">Low Stock! Current {{ selectedProd.currentStock }}pcs — min {{ selectedProd.minStock }}pcs required.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Inventory Tab ── -->
      <div v-else-if="tab === 'inventory'" class="space-y-4">
        <!-- WH Tabs -->
        <div class="flex items-center gap-1 bg-muted/40 p-1 rounded-xl w-fit">
          <button v-for="wh in WAREHOUSES" :key="wh" @click="whTab = wh"
            :class="['px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', whTab === wh ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground']">{{ wh }}</button>
        </div>
        <!-- Low Stock Banner -->
        <div v-if="critical.length > 0" class="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle class="w-4 h-4 text-destructive shrink-0" />
          <div class="flex-1">
            <p class="text-xs font-semibold text-destructive">Low Stock Warning — {{ critical.length }} items</p>
            <p class="text-[11px] text-destructive/80">{{ critical.map((p) => `${p.brand} ${p.size} ${p.pattern} (stock ${fmtNum(p.currentStock)}, min ${p.minStock})`).join(' · ') }}</p>
          </div>
        </div>
        <!-- KPIs -->
        <div class="grid grid-cols-4 gap-4">
          <div v-for="kpi in invKpis" :key="kpi.l" class="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div :class="`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${kpi.bg}`">
              <component :is="kpi.icon" class="w-4 h-4" :class="kpi.color" />
            </div>
            <div><p class="text-xs text-muted-foreground">{{ kpi.l }}</p><p class="text-xl font-bold font-mono text-foreground">{{ kpi.v }}</p></div>
          </div>
        </div>
        <!-- Search -->
        <div class="relative w-64">
          <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input v-model="invSearch" class="h-9 w-full pl-8 pr-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Size, pattern, code search..." />
        </div>
        <!-- Inventory Table -->
        <div class="bg-card rounded-xl border border-border overflow-hidden">
          <div class="px-4 py-3 border-b border-border flex items-center justify-between">
            <p class="text-sm font-semibold text-foreground">Inventory Status (Weekly)</p>
            <p class="text-xs text-muted-foreground">As of: 2026-03-17 | {{ whTab === 'All' ? 'All Warehouses' : whTab }}</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-border bg-muted/20">
                  <th v-for="h in ['Item Code','Description','Type','Warehouse','Current Stock','Min Stock','Buffer %','WH Price','Stock Value','Status']"
                    :key="h" class="text-left px-3 py-2.5 text-muted-foreground font-medium whitespace-nowrap">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="prod in invFiltered" :key="prod.id"
                  :class="['border-b border-border/50 hover:bg-muted/20', prod.currentStock < prod.minStock ? 'bg-destructive/5' : '']">
                  <td class="px-3 py-2.5 font-mono text-[10px] text-foreground">{{ prod.code }}</td>
                  <td class="px-3 py-2.5 font-medium text-foreground max-w-40">{{ prod.brand }} {{ prod.size }} {{ prod.pattern }} {{ prod.pr }}PR</td>
                  <td class="px-3 py-2.5 text-muted-foreground">{{ prod.type1 }}</td>
                  <td class="px-3 py-2.5 text-muted-foreground">{{ prod.warehouse }}</td>
                  <td class="px-3 py-2.5 font-mono font-semibold" :class="stockTextColor(prod)">{{ fmtNum(prod.currentStock) }}</td>
                  <td class="px-3 py-2.5 font-mono text-muted-foreground">{{ prod.minStock }}</td>
                  <td class="px-3 py-2.5">
                    <div class="flex items-center gap-2">
                      <div class="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div :class="['h-full rounded-full', bufferBarColor(prod.bufferPct)]" :style="{ width: `${Math.min(100, prod.bufferPct)}%` }" />
                      </div>
                      <span :class="['font-mono', bufferTextColor(prod.bufferPct)]">{{ prod.bufferPct }}%</span>
                    </div>
                  </td>
                  <td class="px-3 py-2.5 font-mono text-foreground">{{ fmtIDRCompact(prod.whPriceIdr) }}</td>
                  <td class="px-3 py-2.5 font-mono text-foreground">{{ fmtIDRCompact(prod.currentStock * prod.whPriceIdr) }}</td>
                  <td class="px-3 py-2.5">
                    <span v-if="prod.currentStock < prod.minStock" class="flex items-center gap-1 text-destructive text-[10px] font-medium">
                      <AlertTriangle class="w-3 h-3" />Low
                    </span>
                    <span v-else class="text-[10px] text-chart-1 font-medium">OK</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ── Price History Tab ── -->
      <div v-else class="space-y-4">
        <div class="flex items-center gap-2">
          <History class="w-4 h-4 text-muted-foreground" />
          <span class="text-xs text-muted-foreground">Price Type:</span>
          <button v-for="t in PRICE_TYPES" :key="t" @click="filterType = t"
            :class="['px-3 py-1 rounded-full text-xs font-medium transition-colors border', filterType === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/40']">{{ t }}</button>
        </div>
        <div class="bg-card rounded-xl border border-border overflow-hidden">
          <div class="px-4 py-3 border-b border-border">
            <p class="text-sm font-semibold text-foreground">Price Change History</p>
            <p class="text-xs text-muted-foreground mt-0.5">When WH Price changes → Retail/Wholesale auto-recalculation process</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-border bg-muted/20">
                  <th v-for="h in ['Date','Product','Price Type','Old Price','New Price','Change','Change Reason','Changed By','FX Rate','Approved By']"
                    :key="h" class="text-left px-3 py-2.5 text-muted-foreground font-medium whitespace-nowrap">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ph in filteredPH" :key="ph.id" class="border-b border-border/50 hover:bg-muted/20">
                  <td class="px-3 py-2.5 font-mono text-muted-foreground">{{ ph.date }}</td>
                  <td class="px-3 py-2.5 text-foreground max-w-37.5 truncate font-medium">{{ ph.productDesc }}</td>
                  <td class="px-3 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">{{ ph.priceType }}</span></td>
                  <td class="px-3 py-2.5 font-mono text-muted-foreground">{{ fmtIDR(ph.oldPrice) }}</td>
                  <td class="px-3 py-2.5 font-mono font-semibold text-foreground">{{ fmtIDR(ph.newPrice) }}</td>
                  <td class="px-3 py-2.5">
                    <span :class="['flex items-center gap-1 font-mono font-medium', (ph.newPrice - ph.oldPrice) > 0 ? 'text-chart-1' : 'text-destructive']">
                      <ArrowUp v-if="(ph.newPrice - ph.oldPrice) > 0" class="w-3 h-3" />
                      <ArrowDown v-else class="w-3 h-3" />
                      {{ (ph.newPrice - ph.oldPrice) > 0 ? '+' : '' }}{{ fmtIDRCompact(ph.newPrice - ph.oldPrice) }}
                      ({{ (ph.newPrice - ph.oldPrice) > 0 ? '+' : '' }}{{ (((ph.newPrice - ph.oldPrice) / ph.oldPrice) * 100).toFixed(1) }}%)
                    </span>
                  </td>
                  <td class="px-3 py-2.5 text-muted-foreground max-w-45 truncate">{{ ph.changeReason }}</td>
                  <td class="px-3 py-2.5 text-muted-foreground">{{ ph.changedBy }}</td>
                  <td class="px-3 py-2.5 font-mono text-muted-foreground">{{ fmtNum(ph.fxRateAtChange) }}</td>
                  <td class="px-3 py-2.5 text-muted-foreground">{{ ph.approvedBy }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </Layout>
</template>
