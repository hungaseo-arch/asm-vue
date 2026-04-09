<script setup lang="ts">
import { ref, computed } from 'vue'
import Layout from '@/components/Layout.vue'
import PageHeader from '@/components/PageHeader.vue'
import { customers } from '@/data'
import { fmtIDRCompact, fmtNum } from '@/lib/index'
import { TrendingUp, DollarSign, Users, ShoppingCart, Award, Target, MapPin, AlertCircle } from 'lucide-vue-next'

type AnalysisTab = 'dashboard' | 'rep' | 'product' | 'region'
const tab = ref<AnalysisTab>('dashboard')

const monthlyData = [
  { month:'Jan', sales:2_420_000_000, target:2_200_000_000, margin:262_000_000, orders:84 },
  { month:'Feb', sales:1_980_000_000, target:2_200_000_000, margin:208_000_000, orders:72 },
  { month:'Mar', sales:2_760_000_000, target:2_400_000_000, margin:318_000_000, orders:96 },
  { month:'Apr', sales:3_100_000_000, target:2_400_000_000, margin:370_000_000, orders:110 },
  { month:'May', sales:2_850_000_000, target:2_600_000_000, margin:305_000_000, orders:102 },
  { month:'Jun', sales:3_340_000_000, target:2_600_000_000, margin:415_000_000, orders:118 },
  { month:'Jul', sales:2_120_000_000, target:2_800_000_000, margin:225_000_000, orders:76 },
  { month:'Aug', sales:2_640_000_000, target:2_800_000_000, margin:287_000_000, orders:95 },
  { month:'Sep', sales:3_080_000_000, target:3_000_000_000, margin:352_000_000, orders:109 },
  { month:'Oct', sales:3_420_000_000, target:3_000_000_000, margin:411_000_000, orders:122 },
  { month:'Nov', sales:2_940_000_000, target:3_200_000_000, margin:325_000_000, orders:104 },
  { month:'Dec', sales:3_720_000_000, target:3_200_000_000, margin:455_000_000, orders:132 },
]
const repData = [
  { name:'Budi Santoso',   sales:4_890_000_000, margin:21.4, orders:87, target:4_500_000_000, ach:108.7 },
  { name:'Siti Rahayu',    sales:3_680_000_000, margin:19.2, orders:65, target:3_600_000_000, ach:102.2 },
  { name:'Dian Permata',   sales:3_120_000_000, margin:23.8, orders:54, target:3_000_000_000, ach:104.0 },
  { name:'Agus Wijaya',    sales:2_540_000_000, margin:18.6, orders:46, target:2_800_000_000, ach:90.7  },
  { name:'Rina Susanti',   sales:2_860_000_000, margin:20.1, orders:51, target:2_600_000_000, ach:110.0 },
  { name:'Hendra Gunawan', sales:2_110_000_000, margin:16.4, orders:39, target:2_200_000_000, ach:95.9  },
]
const productData = [
  { name:'TIRE TB_R', sales:9_145_621_995,  margin:12.4, qty:3347,  growth:8.2  },
  { name:'TUBE TB',   sales:6_743_641_696,  margin:7.1,  qty:34595, growth:-3.1 },
  { name:'TIRE TB_B', sales:2_191_229_304,  margin:7.0,  qty:1225,  growth:15.6 },
  { name:'TIRE IND',  sales:2_560_444_814,  margin:11.9, qty:1511,  growth:5.4  },
  { name:'TUBE OTR',  sales:1_566_958_364,  margin:14.8, qty:4000,  growth:12.3 },
  { name:'TIRE AGR',  sales:880_566_491,    margin:29.3, qty:403,   growth:22.1 },
  { name:'FLAP TB',   sales:1_122_425_681,  margin:22.2, qty:19606, growth:6.8  },
  { name:'TIRE OTR',  sales:139_955_942,    margin:21.2, qty:27,    growth:44.0 },
]
const regionData = [
  { city:'Jakarta',    q1:4200, q2:5100, q3:4800, q4:6200, total:20300, growth:12.4,  reps:['Budi S.','Ahmad R.'], topProduct:'Tire 185/65R15' },
  { city:'Surabaya',   q1:3100, q2:2900, q3:3600, q4:4100, total:13700, growth:8.7,   reps:['Sari W.'],            topProduct:'Tire 195/65R15' },
  { city:'Bandung',    q1:1200, q2:1500, q3:1800, q4:2100, total:6600,  growth:22.1,  reps:['Dewi P.'],            topProduct:'Tube 700x16' },
  { city:'Semarang',   q1:900,  q2:1100, q3:1000, q4:1400, total:4400,  growth:5.3,   reps:['Ahmad R.'],           topProduct:'Tire 205/65R15' },
  { city:'Medan',      q1:700,  q2:850,  q3:920,  q4:1200, total:3670,  growth:15.8,  reps:['Budi S.'],            topProduct:'Tire 185/70R14' },
  { city:'Pekanbaru',  q1:500,  q2:620,  q3:580,  q4:750,  total:2450,  growth:-2.4,  reps:['Dewi P.'],            topProduct:'Tube 650x16' },
  { city:'Makassar',   q1:400,  q2:480,  q3:510,  q4:680,  total:2070,  growth:9.2,   reps:['Sari W.'],            topProduct:'Tire 215/60R16' },
  { city:'Balikpapan', q1:300,  q2:360,  q3:420,  q4:550,  total:1630,  growth:32.1,  reps:['Ahmad R.'],           topProduct:'Tire 225/55R17' },
]

const COLORS = ['var(--chart-1)','var(--chart-2)','var(--chart-3)','var(--primary)','var(--accent)','var(--chart-4)','var(--destructive)']

// Overview KPIs
const totalSales  = computed(() => monthlyData.reduce((s, m) => s + m.sales, 0))
const totalMargin = computed(() => monthlyData.reduce((s, m) => s + m.margin, 0))
const totalOrders = computed(() => monthlyData.reduce((s, m) => s + m.orders, 0))
const avgMarginPct = computed(() => ((totalMargin.value / totalSales.value) * 100).toFixed(1))
const achRate = computed(() => ((totalSales.value / monthlyData.reduce((s, m) => s + m.target, 0)) * 100).toFixed(1))

const overviewKpis = computed(() => [
  { l:'Annual Revenue',       v:fmtIDRCompact(totalSales.value),  sub:'FY 2025',            icon:DollarSign, bg:'bg-primary/10',  color:'text-primary' },
  { l:'Annual Margin',        v:fmtIDRCompact(totalMargin.value), sub:`${avgMarginPct.value}% Avg`, icon:TrendingUp, bg:'bg-chart-1/10', color:'text-chart-1' },
  { l:'Total Orders',         v:fmtNum(totalOrders.value),        sub:'Annual Total',       icon:ShoppingCart, bg:'bg-chart-3/10', color:'text-chart-3' },
  { l:'Target Achievement',   v:`${achRate.value}%`,              sub:'Annual Sum',         icon:Target,     bg:'bg-chart-2/10',  color:'text-chart-2' },
  { l:'Active Customers',     v:`${customers.filter((c) => c.status === 'Active').length} accts`, sub:'Wholesale+Retail', icon:Users, bg:'bg-accent/10', color:'text-accent' },
])

// SVG chart helpers
const maxSales  = computed(() => Math.max(...monthlyData.map((d) => Math.max(d.sales, d.target))))
const maxMargin = computed(() => Math.max(...monthlyData.map((d) => d.margin)))
const maxOrders = computed(() => Math.max(...monthlyData.map((d) => d.orders)))
const maxRegionTotal = computed(() => Math.max(...regionData.map((r) => r.total)))
const maxProdSales   = computed(() => Math.max(...productData.map((p) => p.sales)))
const maxProdMargin  = computed(() => Math.max(...productData.map((p) => p.margin)))
const maxGrowth      = computed(() => Math.max(...regionData.map((r) => Math.abs(r.growth))))

function sortedRep() { return [...repData].sort((a, b) => b.ach - a.ach) }
function sortedProduct() { return [...productData].sort((a, b) => b.sales - a.sales) }
function sortedProductMargin() { return [...productData].sort((a, b) => b.margin - a.margin) }
function sortedRegion() { return [...regionData].sort((a, b) => b.growth - a.growth) }

function achColor(v: number) { return v >= 100 ? 'bg-chart-1' : v >= 95 ? 'bg-chart-3' : 'bg-destructive' }
function achTextColor(v: number) { return v >= 100 ? 'text-chart-1' : v >= 95 ? 'text-chart-3' : 'text-destructive' }
function marginTextColor(v: number) { return v >= 22 ? 'text-chart-1' : v >= 18 ? 'text-chart-3' : 'text-destructive' }
function prodMarginColor(v: number) { return v >= 20 ? 'text-chart-1' : v >= 10 ? 'text-chart-3' : 'text-destructive' }
function perfLabel(v: number) { return v >= 108 ? 'Exceeded' : v >= 100 ? 'On Target' : 'Below Target' }
function perfBadgeColor(v: number) {
  if (v >= 108) return 'bg-chart-1/20 text-chart-1 border border-chart-1/30'
  if (v >= 100) return 'bg-chart-3/20 text-chart-3 border border-chart-3/30'
  return 'bg-destructive/20 text-destructive border border-destructive/30'
}
function heatColor(val: number, max: number) {
  const r = val / max
  if (r > 0.8) return 'bg-primary text-white'
  if (r > 0.6) return 'bg-primary/70 text-white'
  if (r > 0.4) return 'bg-primary/50 text-white'
  if (r > 0.2) return 'bg-primary/30 text-foreground'
  return 'bg-primary/10 text-foreground'
}

const tabs = [
  { key: 'dashboard' as AnalysisTab, label: 'KPI Dashboard', icon: TrendingUp },
  { key: 'rep'       as AnalysisTab, label: 'By Sales Rep',  icon: Users },
  { key: 'product'   as AnalysisTab, label: 'By Product',    icon: ShoppingCart },
  { key: 'region'    as AnalysisTab, label: 'By Region',     icon: MapPin },
]
</script>

<template>
  <Layout>
    <div class="p-6 space-y-4">
      <PageHeader title="Sales Analytics" subtitle="KPI Dashboard · By Sales Rep · By Product — FY 2025 Performance" />

      <!-- Tab Switcher -->
      <div class="flex items-center gap-1 bg-muted/40 p-1 rounded-xl w-fit">
        <button v-for="t in tabs" :key="t.key" @click="tab = t.key"
          :class="['flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            tab === t.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground']">
          <component :is="t.icon" class="w-3.5 h-3.5" />{{ t.label }}
        </button>
      </div>

      <!-- ── DASHBOARD TAB ── -->
      <div v-if="tab === 'dashboard'" class="space-y-5">
        <div class="grid grid-cols-5 gap-4">
          <div v-for="kpi in overviewKpis" :key="kpi.l" class="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div :class="`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${kpi.bg}`">
              <component :is="kpi.icon" class="w-4 h-4" :class="kpi.color" />
            </div>
            <div><p class="text-xs text-muted-foreground">{{ kpi.l }}</p><p class="text-lg font-bold font-mono text-foreground">{{ kpi.v }}</p><p class="text-[10px] text-muted-foreground">{{ kpi.sub }}</p></div>
          </div>
        </div>

        <!-- Sales vs Target (SVG area chart) -->
        <div class="grid grid-cols-3 gap-5">
          <div class="col-span-2 bg-card rounded-xl border border-border p-4">
            <p class="text-sm font-semibold text-foreground mb-4">Monthly Revenue vs Target</p>
            <svg viewBox="0 0 560 200" class="w-full h-52">
              <defs>
                <linearGradient id="salesGradA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stop-color="var(--primary)" stop-opacity="0.3" />
                  <stop offset="95%" stop-color="var(--primary)" stop-opacity="0" />
                </linearGradient>
              </defs>
              <line v-for="y in [40,80,120,160]" :key="y" x1="20" :y1="y" x2="540" :y2="y" stroke="var(--border)" stroke-dasharray="3,3" />
              <path :d="monthlyData.map((d, i) => `${i===0?'M':'L'}${20+(i/(monthlyData.length-1))*520},${180-((d.sales/maxSales)*160)}`).join(' ') + ` L540,180 L20,180 Z`"
                fill="url(#salesGradA)" />
              <path :d="monthlyData.map((d, i) => `${i===0?'M':'L'}${20+(i/(monthlyData.length-1))*520},${180-((d.sales/maxSales)*160)}`).join(' ')"
                fill="none" stroke="var(--primary)" stroke-width="2" />
              <path :d="monthlyData.map((d, i) => `${i===0?'M':'L'}${20+(i/(monthlyData.length-1))*520},${180-((d.target/maxSales)*160)}`).join(' ')"
                fill="none" stroke="var(--chart-3)" stroke-width="2" stroke-dasharray="6,4" />
              <text v-for="(d, i) in monthlyData" :key="`m${i}`" :x="20+(i/(monthlyData.length-1))*520" y="198" text-anchor="middle" font-size="9" fill="var(--muted-foreground)">{{ d.month }}</text>
            </svg>
          </div>

          <!-- Product pie (SVG donut) -->
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-sm font-semibold text-foreground mb-3">Revenue by Product Type</p>
            <svg viewBox="-1 -1 2 2" class="w-32 h-32 mx-auto" style="transform:rotate(-90deg)">
              <template v-for="(p, i) in productData" :key="i">
                <circle :stroke="COLORS[i % COLORS.length]"
                  :stroke-dasharray="`${(p.sales / 19_202_918_676) * 2 * Math.PI * 0.35} ${2 * Math.PI * 0.35}`"
                  :stroke-dashoffset="`-${productData.slice(0,i).reduce((a,b)=>a+b.sales,0)/19_202_918_676 * 2 * Math.PI * 0.35}`"
                  fill="none" stroke-width="0.3" r="0.35" cx="0" cy="0" />
              </template>
            </svg>
            <div class="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
              <div v-for="(p, i) in productData" :key="p.name" class="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <div class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: COLORS[i % COLORS.length] }" />
                <span class="truncate">{{ p.name.replace('TIRE ','').replace('TUBE ','T-') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Margin + Orders charts (SVG) -->
        <div class="grid grid-cols-2 gap-5">
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-sm font-semibold text-foreground mb-3">Monthly Margin Trend</p>
            <svg viewBox="0 0 460 160" class="w-full h-40">
              <line v-for="y in [30,60,90,120]" :key="y" x1="0" :y1="y" x2="460" :y2="y" stroke="var(--border)" stroke-dasharray="3,3" />
              <rect v-for="(d, i) in monthlyData" :key="i"
                :x="10 + i * 36" :y="140 - (d.margin / maxMargin) * 110"
                width="24" :height="(d.margin / maxMargin) * 110"
                fill="var(--chart-1)" rx="3" />
              <text v-for="(d, i) in monthlyData" :key="`lm${i}`" :x="22 + i * 36" y="156" text-anchor="middle" font-size="8" fill="var(--muted-foreground)">{{ d.month }}</text>
            </svg>
          </div>
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-sm font-semibold text-foreground mb-3">Monthly Order Count</p>
            <svg viewBox="0 0 460 160" class="w-full h-40">
              <line v-for="y in [30,60,90,120]" :key="y" x1="0" :y1="y" x2="460" :y2="y" stroke="var(--border)" stroke-dasharray="3,3" />
              <path :d="monthlyData.map((d, i) => `${i===0?'M':'L'}${22+i*36},${140-((d.orders/maxOrders)*110)}`).join(' ')"
                fill="none" stroke="var(--chart-2)" stroke-width="2.5" />
              <circle v-for="(d, i) in monthlyData" :key="`co${i}`" :cx="22+i*36" :cy="140-((d.orders/maxOrders)*110)" r="3" fill="var(--chart-2)" />
              <text v-for="(d, i) in monthlyData" :key="`lo${i}`" :x="22+i*36" y="156" text-anchor="middle" font-size="8" fill="var(--muted-foreground)">{{ d.month }}</text>
            </svg>
          </div>
        </div>
      </div>

      <!-- ── REP TAB ── -->
      <div v-else-if="tab === 'rep'" class="space-y-5">
        <div class="bg-card rounded-xl border border-border overflow-hidden">
          <div class="px-4 py-3 border-b border-border"><p class="text-sm font-semibold text-foreground">Sales Rep Performance</p></div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-border bg-muted/20">
                  <th v-for="h in ['Rank','Rep','Revenue(IDR)','Target(IDR)','Achievement','Orders','Margin%','Performance']" :key="h" class="text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, idx) in sortedRep()" :key="r.name" class="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td class="px-4 py-3">
                    <span v-if="idx === 0" class="flex items-center gap-1 text-chart-3 font-bold"><Award class="w-3.5 h-3.5" />1</span>
                    <span v-else class="text-muted-foreground font-medium">{{ idx + 1 }}</span>
                  </td>
                  <td class="px-4 py-3 font-medium text-foreground">{{ r.name }}</td>
                  <td class="px-4 py-3 font-mono font-semibold text-foreground">{{ fmtIDRCompact(r.sales) }}</td>
                  <td class="px-4 py-3 font-mono text-muted-foreground">{{ fmtIDRCompact(r.target) }}</td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <div class="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div :class="['h-full rounded-full', achColor(r.ach)]" :style="{ width: `${Math.min(100, r.ach)}%` }" />
                      </div>
                      <span :class="['font-mono font-semibold', achTextColor(r.ach)]">{{ r.ach }}%</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 font-mono text-foreground">{{ r.orders }}</td>
                  <td class="px-4 py-3"><span :class="['font-semibold', marginTextColor(r.margin)]">{{ r.margin }}%</span></td>
                  <td class="px-4 py-3"><span :class="['text-[10px] px-2 py-1 rounded-full font-medium', perfBadgeColor(r.ach)]">{{ perfLabel(r.ach) }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Rep charts (SVG bars) -->
        <div class="grid grid-cols-2 gap-5">
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-sm font-semibold text-foreground mb-4">Revenue vs Target by Rep</p>
            <div class="space-y-3">
              <div v-for="r in sortedRep()" :key="r.name" class="text-xs">
                <div class="flex justify-between mb-1"><span class="text-muted-foreground">{{ r.name.split(' ')[0] }}</span><span class="font-mono text-foreground">{{ fmtIDRCompact(r.sales) }}</span></div>
                <div class="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div class="absolute h-full bg-primary/30 rounded-full" :style="{ width: `${(r.target / 4_890_000_000) * 100}%` }" />
                  <div class="absolute h-full bg-primary rounded-full" :style="{ width: `${(r.sales / 4_890_000_000) * 100}%` }" />
                </div>
              </div>
            </div>
          </div>
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-sm font-semibold text-foreground mb-4">Margin Rate by Rep</p>
            <div class="space-y-3">
              <div v-for="r in [...repData].sort((a,b)=>b.margin-a.margin)" :key="r.name" class="flex items-center gap-3 text-xs">
                <span class="text-muted-foreground w-20 flex-shrink-0 text-right">{{ r.name.split(' ')[0] }}</span>
                <div class="flex-1 h-5 bg-muted rounded-r-md overflow-hidden">
                  <div class="h-full rounded-r-md flex items-center pl-2 text-[10px] text-white font-medium"
                    :style="{ width: `${(r.margin / 30) * 100}%`, background: r.margin >= 22 ? 'var(--chart-1)' : r.margin >= 18 ? 'var(--chart-3)' : 'var(--destructive)' }">
                    {{ r.margin }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── PRODUCT TAB ── -->
      <div v-else-if="tab === 'product'" class="space-y-5">
        <div class="grid grid-cols-2 gap-5">
          <!-- Product sales bars -->
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-sm font-semibold text-foreground mb-4">Revenue by Product Type</p>
            <div class="space-y-2">
              <div v-for="(p, i) in sortedProduct()" :key="p.name" class="flex items-center gap-3 text-xs">
                <span class="text-muted-foreground w-20 flex-shrink-0 text-right">{{ p.name }}</span>
                <div class="flex-1 h-5 bg-muted rounded-r-md overflow-hidden">
                  <div class="h-full rounded-r-md flex items-center pl-2 text-[10px] text-white font-medium"
                    :style="{ width: `${(p.sales / maxProdSales) * 100}%`, background: COLORS[i % COLORS.length] }">
                    {{ fmtIDRCompact(p.sales) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Margin & growth -->
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-sm font-semibold text-foreground mb-4">Margin Rate & Growth by Product Type</p>
            <div class="space-y-2">
              <div v-for="p in sortedProductMargin()" :key="p.name" class="text-xs">
                <div class="flex justify-between mb-0.5">
                  <span class="text-muted-foreground">{{ p.name }}</span>
                  <span class="font-mono"><span :class="prodMarginColor(p.margin)">{{ p.margin }}%</span> / <span :class="p.growth > 0 ? 'text-chart-1' : 'text-destructive'">{{ p.growth > 0 ? '+' : '' }}{{ p.growth }}%</span></span>
                </div>
                <div class="flex gap-1">
                  <div class="flex-1 h-1.5 bg-muted rounded-full overflow-hidden"><div class="h-full bg-chart-1 rounded-full" :style="{ width: `${(p.margin / maxProdMargin) * 100}%` }" /></div>
                  <div class="flex-1 h-1.5 bg-muted rounded-full overflow-hidden"><div :class="['h-full rounded-full', p.growth > 0 ? 'bg-chart-2' : 'bg-destructive']" :style="{ width: `${(Math.abs(p.growth) / 50) * 100}%` }" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Product table -->
        <div class="bg-card rounded-xl border border-border overflow-hidden">
          <div class="px-4 py-3 border-b border-border"><p class="text-sm font-semibold text-foreground">Product Type Overview</p></div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-border bg-muted/20">
                  <th v-for="h in ['Product Type','Revenue(IDR)','Qty','Margin%','Growth%','Class']" :key="h" class="text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in sortedProduct()" :key="p.name" class="border-b border-border/50 hover:bg-muted/20">
                  <td class="px-4 py-3 font-medium text-foreground">{{ p.name }}</td>
                  <td class="px-4 py-3 font-mono font-semibold text-foreground">{{ fmtIDRCompact(p.sales) }}</td>
                  <td class="px-4 py-3 font-mono text-muted-foreground">{{ fmtNum(p.qty) }}</td>
                  <td class="px-4 py-3"><span :class="['font-semibold', prodMarginColor(p.margin)]">{{ p.margin }}%</span></td>
                  <td class="px-4 py-3"><span :class="['font-mono font-medium', p.growth > 0 ? 'text-chart-1' : 'text-destructive']">{{ p.growth > 0 ? '+' : '' }}{{ p.growth }}%</span></td>
                  <td class="px-4 py-3">
                    <span :class="['text-[10px] px-2 py-1 rounded-full font-medium', p.margin >= 20 && p.growth > 10 ? 'bg-chart-1/20 text-chart-1 border border-chart-1/30' : p.margin >= 10 ? 'bg-chart-3/20 text-chart-3 border border-chart-3/30' : 'bg-muted text-muted-foreground border border-border']">
                      {{ p.margin >= 20 && p.growth > 10 ? 'Star' : 'Standard' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ── REGION TAB ── -->
      <div v-else class="space-y-5">
        <div class="grid grid-cols-4 gap-4">
          <div v-for="k in [
            {l:'Cities Covered',v:`${regionData.length} cities`,icon:MapPin,bg:'bg-primary/10',color:'text-primary'},
            {l:'Annual Regional Revenue',v:`Rp ${fmtNum(regionData.reduce((s,r)=>s+r.total,0))}M`,icon:TrendingUp,bg:'bg-chart-1/10',color:'text-chart-1'},
            {l:'Fastest Growing City',v:'Balikpapan +32%',icon:TrendingUp,bg:'bg-chart-3/10',color:'text-chart-3'},
            {l:'Declining Region',v:'Pekanbaru -2.4%',icon:AlertCircle,bg:'bg-destructive/10',color:'text-destructive'},
          ]" :key="k.l" class="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div :class="`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${k.bg}`">
              <component :is="k.icon" class="w-4 h-4" :class="k.color" />
            </div>
            <div><p class="text-xs text-muted-foreground">{{ k.l }}</p><p class="text-base font-bold text-foreground">{{ k.v }}</p></div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-5">
          <!-- Stacked bar (SVG) -->
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-sm font-semibold text-foreground mb-4">City Revenue by Quarter (Rp M)</p>
            <svg viewBox="0 0 420 200" class="w-full h-52">
              <template v-for="(r, i) in regionData.slice(0, 6)" :key="r.city">
                <rect :x="10 + i * 66" :y="180 - ((r.q1 + r.q2 + r.q3 + r.q4) / (regionData[0].total || 1)) * 160" width="46"
                  :height="((r.q1 + r.q2 + r.q3 + r.q4) / (regionData[0].total || 1)) * 160"
                  fill="var(--primary)" opacity="0.8" rx="2" />
                <text :x="33 + i * 66" y="196" text-anchor="middle" font-size="9" fill="var(--muted-foreground)">{{ r.city.slice(0, 5) }}</text>
              </template>
            </svg>
          </div>
          <!-- Growth bars -->
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-sm font-semibold text-foreground mb-4">YoY Growth Rate by City</p>
            <div class="space-y-3">
              <div v-for="r in sortedRegion()" :key="r.city" class="flex items-center gap-3 text-xs">
                <span class="text-muted-foreground w-16 flex-shrink-0">{{ r.city }}</span>
                <div class="flex-1 h-5 bg-muted/30 rounded-md overflow-hidden">
                  <div :class="['h-full rounded-md flex items-center justify-end pr-2 text-[10px] font-semibold', r.growth > 0 ? 'bg-chart-1/70 text-white' : 'bg-destructive/60 text-white']"
                    :style="{ width: `${Math.min(100, Math.abs(r.growth) * 2.5)}%` }">
                    {{ r.growth > 0 ? '+' : '' }}{{ r.growth }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Heatmap table -->
        <div class="bg-card rounded-xl border border-border overflow-hidden">
          <div class="px-4 py-3 border-b border-border"><p class="text-sm font-semibold text-foreground">City × Quarter Revenue Heatmap (Rp M)</p></div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-border bg-muted/20">
                  <th v-for="h in ['City','Sales Rep','Q1','Q2','Q3','Q4','Annual Total','YoY Growth','Top Product']" :key="h" class="text-left px-3 py-2.5 text-muted-foreground font-medium whitespace-nowrap">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, rank) in regionData" :key="r.city" class="border-b border-border/50 hover:bg-muted/20">
                  <td class="px-3 py-2.5">
                    <div class="flex items-center gap-2">
                      <span class="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">{{ rank + 1 }}</span>
                      <span class="font-semibold text-foreground">{{ r.city }}</span>
                    </div>
                  </td>
                  <td class="px-3 py-2.5 text-muted-foreground">{{ r.reps.join(', ') }}</td>
                  <td v-for="(v, qi) in [r.q1, r.q2, r.q3, r.q4]" :key="qi" class="px-3 py-2.5">
                    <span :class="['inline-block px-2 py-0.5 rounded font-mono font-semibold text-[11px]', heatColor(v, 6200)]">{{ v.toLocaleString() }}</span>
                  </td>
                  <td class="px-3 py-2.5 font-mono font-bold text-foreground">{{ r.total.toLocaleString() }}</td>
                  <td class="px-3 py-2.5"><span :class="['text-xs font-semibold', r.growth > 0 ? 'text-chart-1' : 'text-destructive']">{{ r.growth > 0 ? '+' : '' }}{{ r.growth }}%</span></td>
                  <td class="px-3 py-2.5 text-muted-foreground max-w-[140px] truncate">{{ r.topProduct }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </Layout>
</template>
