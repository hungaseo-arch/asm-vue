<script setup lang="ts">
import { ref, computed } from 'vue'
import Layout from '@/components/Layout.vue'
import PageHeader from '@/components/PageHeader.vue'
import { costBreakdowns, monthlyPOTrend } from '@/data.ts'
import { fmtIDR, fmtUSD, fmtNum } from '@/lib/index.ts'
import { TrendingUp, DollarSign, BarChart3, AlertCircle } from 'lucide-vue-next'

const fxScenarios = [
  { fxRate: 16_500, label: '16,500 (IDR Strong)',      landedCost: 2_378_451, whPrice: 2_568_567, margin: 19.8 },
  { fxRate: 17_000, label: '17,000 (Baseline)',        landedCost: 2_444_451, whPrice: 2_640_527, margin: 17.5 },
  { fxRate: 17_500, label: '17,500 (Current)',         landedCost: 2_512_451, whPrice: 2_712_087, margin: 15.25 },
  { fxRate: 18_000, label: '18,000 (IDR Weak)',        landedCost: 2_582_451, whPrice: 2_787_207, margin: 12.8 },
  { fxRate: 18_500, label: '18,500 (Weak Deepened)',   landedCost: 2_652_451, whPrice: 2_864_647, margin: 10.2 },
]

const selectedProduct = ref(costBreakdowns[0])
const fxInput = ref(17_580)

// React: useMemo / derived state → Vue: computed
const simLandedCost = computed(() =>
  Math.round(selectedProduct.value.cifUsd * fxInput.value + selectedProduct.value.dutyIdr + selectedProduct.value.customsIdr + selectedProduct.value.inlandIdr)
)
const simWHPrice = computed(() => Math.round(simLandedCost.value * 1.0795))
const simMargin  = computed(() =>
  (((selectedProduct.value.sellingIdr - simWHPrice.value) / selectedProduct.value.sellingIdr) * 100).toFixed(1)
)
const simMarginDiff = computed(() =>
  (parseFloat(simMargin.value) - selectedProduct.value.marginPct).toFixed(1)
)

// Waterfall steps — computed
const waterfallSteps = computed(() => {
  const d = selectedProduct.value
  return [
    { name: 'FOB',          value: Math.round(d.fobUsd * d.fxRate),                                                                isMilestone: false },
    { name: '+ Freight/Ins',value: Math.round((d.cifUsd - d.fobUsd) * d.fxRate),   base: Math.round(d.fobUsd * d.fxRate),          isMilestone: false },
    { name: '+ Import Duty',value: d.dutyIdr,                                        base: Math.round(d.cifUsd * d.fxRate),          isMilestone: false },
    { name: '+ Customs Fee',value: d.customsIdr,                                     base: Math.round(d.cifUsd * d.fxRate) + d.dutyIdr, isMilestone: false },
    { name: '+ Inland Tpt', value: d.inlandIdr,                                      base: Math.round(d.cifUsd * d.fxRate) + d.dutyIdr + d.customsIdr, isMilestone: false },
    { name: '= Landed',     value: d.landedCostIdr,                                  base: 0,                                        isMilestone: true },
    { name: '+ Overhead',   value: d.overheadIdr,                                    base: d.landedCostIdr,                          isMilestone: false },
    { name: '= WH Price',   value: d.whPriceIdr,                                     base: 0,                                        isMilestone: true },
    { name: '+ Delivery',   value: d.deliveredIdr - d.whPriceIdr,                   base: d.whPriceIdr,                             isMilestone: false },
    { name: '+ Margin',     value: d.sellingIdr - d.deliveredIdr,                   base: d.deliveredIdr,                           isMilestone: false },
    { name: '= Selling',    value: d.sellingIdr,                                     base: 0,                                        isMilestone: true },
  ]
})

const kpis = computed(() => [
  { label: 'FOB Price',   value: fmtUSD(selectedProduct.value.fobUsd),       sub: 'Factory Price (USD)',          icon: DollarSign, bg: 'bg-chart-2/10', color: 'text-chart-2' },
  { label: 'Landed Cost', value: fmtIDR(selectedProduct.value.landedCostIdr),sub: 'CIF + Import Duty + Customs + Inland', icon: TrendingUp, bg: 'bg-primary/10',  color: 'text-primary' },
  { label: 'WH Price',    value: fmtIDR(selectedProduct.value.whPriceIdr),   sub: 'Landed + Overhead',            icon: BarChart3,  bg: 'bg-accent/10',  color: 'text-accent' },
  { label: 'Margin',      value: `${selectedProduct.value.marginPct}%`,      sub: `Selling Price ${fmtIDR(selectedProduct.value.sellingIdr)}`, icon: TrendingUp, bg: 'bg-chart-1/10', color: 'text-chart-1' },
])

const simRows = computed(() => [
  { label: 'Landed Cost (IDR)', value: fmtIDR(simLandedCost.value), compare: fmtIDR(selectedProduct.value.landedCostIdr), diff: simLandedCost.value - selectedProduct.value.landedCostIdr, isMargin: false },
  { label: 'WH Price (IDR)',    value: fmtIDR(simWHPrice.value),    compare: fmtIDR(selectedProduct.value.whPriceIdr),    diff: simWHPrice.value - selectedProduct.value.whPriceIdr,    isMargin: false },
  { label: 'Margin Rate (%)',   value: `${simMargin.value}%`,       compare: `Baseline ${selectedProduct.value.marginPct}%`, diff: parseFloat(simMarginDiff.value), isMargin: true },
])

function marginColor(v: number) {
  return v >= 15 ? 'text-chart-1' : v >= 10 ? 'text-chart-3' : 'text-destructive'
}
function scenarioBarColor(v: number) {
  return v >= 15 ? 'bg-chart-1' : v >= 10 ? 'bg-chart-3' : 'bg-destructive'
}

function diffLabel(row: typeof simRows.value[0]) {
  const d = row.diff
  if (row.isMargin) return `${d > 0 ? '+' : ''}${d.toFixed(1)}%p`
  return `${d > 0 ? '+' : ''}${fmtIDR(Math.round(d))}`
}
function diffPositive(row: typeof simRows.value[0]) {
  return row.isMargin ? row.diff > 0 : row.diff < 0
}

const improvements = [
  { title: 'Real-Time FX Rate Simulation', tag: 'Implemented', color: 'text-chart-1 bg-chart-1/10',
    desc: 'Real-time calculation of FOB → CIF → Landed Cost → WH Price via FX rate slider. Warning displayed when margin falls below 10%.' },
  { title: 'ASM Cost Structure Waterfall', tag: 'Implemented', color: 'text-chart-1 bg-chart-1/10',
    desc: '6-stage cost flow (FOB → CIF → Import Duty → Customs → Landed → Overhead → WH Price) visualized as a Waterfall chart.' },
  { title: 'Product / Supplier Cross Analysis', tag: 'Planned', color: 'text-chart-3 bg-chart-3/10',
    desc: 'Planned: per-supplier FOB comparison for same SKU, seasonal order pattern analysis, FX sensitivity-based product grouping.' },
]

// SVG Line chart for monthly trend
function linePath(data: number[], w: number, h: number) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  return data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 16) - 8
    return `${i === 0 ? 'M' : 'L'}${x},${y}`
  }).join(' ')
}

// 1. 인터페이스 정의
interface POTrend {
  month: string;
  value: number;
}
</script>

<template>
  <Layout>
    <div class="p-6 space-y-5">

      <PageHeader
        title="Cost Analysis"
        subtitle="FOB → CIF → Landed Cost → WH Price structure analysis and FX rate simulation"
      />

      <!-- Product Selector -->
      <div class="bg-card rounded-xl border border-border p-4">
        <p class="text-xs font-medium text-muted-foreground mb-3">Select Product for Analysis</p>
        <div class="flex gap-2 flex-wrap">
          <button v-for="p in costBreakdowns" :key="p.productCode"
            @click="selectedProduct = p"
            :class="['px-3 py-2 rounded-lg text-xs font-medium transition-colors border',
              selectedProduct.productCode === p.productCode
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:border-primary/50']"
          >{{ p.description }}</button>
        </div>
      </div>

      <!-- Top KPIs -->
      <div class="grid grid-cols-4 gap-4">
        <div v-for="kpi in kpis" :key="kpi.label" class="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div :class="`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${kpi.bg}`">
            <component :is="kpi.icon" class="w-4 h-4" :class="kpi.color" />
          </div>
          <div>
            <p class="text-xs text-muted-foreground">{{ kpi.label }}</p>
            <p class="text-lg font-bold font-mono text-foreground">{{ kpi.value }}</p>
            <p class="text-[10px] text-muted-foreground">{{ kpi.sub }}</p>
          </div>
        </div>
      </div>

      <!-- Waterfall + FX Simulation -->
      <div class="grid grid-cols-2 gap-4">

        <!-- Cost Waterfall (순수 div 기반) -->
        <div class="bg-card rounded-xl border border-border p-4">
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm font-semibold text-foreground">Cost Structure Waterfall</p>
            <span class="text-xs text-muted-foreground font-mono">{{ selectedProduct.description }}</span>
          </div>
          <div class="space-y-1.5">
            <div v-for="step in waterfallSteps" :key="step.name" class="flex items-center gap-3 text-xs">
              <span :class="['w-20 text-right shrink-0', step.isMilestone ? 'font-semibold text-foreground' : 'text-muted-foreground']">
                {{ step.name }}
              </span>
              <div class="flex-1 relative h-5">
                <!-- v-if/v-else 조건부 렌더링 — React: {!step.isMilestone && ...} -->
                <div v-if="!step.isMilestone"
                  class="absolute top-0 h-full bg-muted/50 rounded"
                  :style="{ left: `${((step.base ?? 0) / selectedProduct.sellingIdr) * 100}%`, width: `${(step.value / selectedProduct.sellingIdr) * 100}%` }" />
                <div v-else
                  class="absolute top-0 h-full bg-primary/80 rounded"
                  :style="{ left: 0, width: `${(step.value / selectedProduct.sellingIdr) * 100}%` }" />
              </div>
              <span :class="['w-28 font-mono shrink-0', step.isMilestone ? 'font-semibold text-primary' : 'text-foreground']">
                {{ fmtIDR(step.value) }}
              </span>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
            <p>* FX Rate: {{ fmtNum(selectedProduct.fxRate) }} IDR/USD baseline</p>
            <p>* Import Duty (BM) 5%, Customs Fee (IE) fixed, Overhead 8%</p>
          </div>
        </div>

        <!-- FX Simulation -->
        <div class="bg-card rounded-xl border border-border p-4">
          <p class="text-sm font-semibold text-foreground mb-4">FX Rate Simulation</p>

          <!-- FX Slider — v-model.number 양방향 바인딩 -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">Applied Exchange Rate (IDR/USD)</span>
              <span class="font-mono font-bold text-chart-3 text-base">{{ fmtNum(fxInput) }}</span>
            </div>
            <input type="range" min="16000" max="19000" step="100" v-model.number="fxInput"
              class="w-full h-2 rounded-full appearance-none cursor-pointer"
              style="accent-color: var(--chart-3)" />
            <div class="flex justify-between text-[10px] text-muted-foreground">
              <span>16,000</span>
              <span class="text-chart-3">Current 17,580</span>
              <span>19,000</span>
            </div>
          </div>

          <!-- Sim Results -->
          <div class="space-y-2">
            <div v-for="row in simRows" :key="row.label"
              class="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg">
              <span class="text-xs text-muted-foreground">{{ row.label }}</span>
              <div class="flex items-center gap-3">
                <span class="text-[10px] text-muted-foreground">{{ row.compare }}</span>
                <span class="font-mono font-semibold text-foreground text-sm">{{ row.value }}</span>
                <span :class="['text-[10px] font-medium', diffPositive(row) ? 'text-chart-1' : 'text-destructive']">
                  {{ diffLabel(row) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Margin Warning -->
          <div v-if="parseFloat(simMargin) < 10"
            class="mt-3 bg-destructive/10 border border-destructive/30 rounded-lg p-2.5 flex items-start gap-2">
            <AlertCircle class="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" />
            <p class="text-xs text-destructive">Margin Warning: Below 10%! Price review or supplier negotiation required.</p>
          </div>

          <!-- Scenario Table -->
          <div class="mt-4">
            <p class="text-xs font-medium text-foreground mb-2">Margin Comparison by FX Rate Scenario</p>
            <div class="space-y-1">
              <div v-for="sc in fxScenarios" :key="sc.fxRate" class="flex items-center gap-3 text-xs">
                <span class="text-muted-foreground w-36 shrink-0">{{ sc.label }}</span>
                <div class="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div :class="['h-full rounded-full', scenarioBarColor(sc.margin)]"
                    :style="{ width: `${Math.min(100, sc.margin * 3)}%` }" />
                </div>
                <span :class="['font-mono font-semibold w-10 text-right shrink-0', marginColor(sc.margin)]">
                  {{ sc.margin }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comparison Table -->
      <div class="bg-card rounded-xl border border-border overflow-hidden">
        <div class="px-4 py-3 border-b border-border">
          <p class="text-sm font-semibold text-foreground">Product Cost Comparison (ASM Terminology)</p>
          <p class="text-xs text-muted-foreground mt-0.5">FOB → CIF → Landed Cost → WH Price → Delivered Price → Selling Price</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-border bg-muted/20">
                <th v-for="h in ['Product','FOB (USD)','CIF (USD)','Import Duty','Landed Cost','WH Price','Selling Price','vs FOB','Margin %']"
                  :key="h" class="text-left px-3 py-2.5 text-muted-foreground font-medium first:pl-4">{{ h }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in costBreakdowns" :key="p.productCode"
                @click="selectedProduct = p"
                :class="['border-b border-border/50 transition-colors cursor-pointer',
                  selectedProduct.productCode === p.productCode ? 'bg-primary/5' : 'hover:bg-muted/20']"
              >
                <td class="px-4 py-2.5 font-medium text-foreground">{{ p.description }}</td>
                <td class="px-3 py-2.5 text-right font-mono text-foreground">{{ fmtUSD(p.fobUsd) }}</td>
                <td class="px-3 py-2.5 text-right font-mono text-foreground">{{ fmtUSD(p.cifUsd) }}</td>
                <td class="px-3 py-2.5 text-right font-mono text-muted-foreground">{{ fmtIDR(p.dutyIdr) }}</td>
                <td class="px-3 py-2.5 text-right font-mono font-semibold text-foreground">{{ fmtIDR(p.landedCostIdr) }}</td>
                <td class="px-3 py-2.5 text-right font-mono font-semibold text-primary">{{ fmtIDR(p.whPriceIdr) }}</td>
                <td class="px-3 py-2.5 text-right font-mono text-foreground">{{ fmtIDR(p.sellingIdr) }}</td>
                <td class="px-3 py-2.5 text-right font-mono text-chart-3">
                  {{ ((p.whPriceIdr / (p.fobUsd * p.fxRate)) * 100).toFixed(0) }}%
                </td>
                <td class="px-3 py-2.5 text-right font-mono">
                  <span :class="['font-semibold', marginColor(p.marginPct)]">{{ p.marginPct }}%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Monthly Trend Chart (SVG native) -->
      <div class="bg-card rounded-xl border border-border p-4">
        <p class="text-sm font-semibold text-foreground mb-4">Monthly PO Amount Trend (USD)</p>
        <svg viewBox="0 0 640 160" class="w-full h-40">
          <line v-for="y in [32,64,96,128]" :key="y" x1="0" :y1="y" x2="640" :y2="y"
            stroke="var(--border)" stroke-dasharray="3,3" />
          <path :d="linePath(monthlyPOTrend.map((d: POTrend) => d.value), 600, 140)"
            fill="none" stroke="var(--primary)" stroke-width="2" transform="translate(20,0)" />
          <circle v-for="(d, i) in monthlyPOTrend" :key="i"
            :cx="20 + (i / (monthlyPOTrend.length - 1)) * 600"
            :cy="140 - ((d.value - Math.min(...monthlyPOTrend.map((d: POTrend) => d.value))) / (Math.max(...monthlyPOTrend.map((d: POTrend) => d.value)) - Math.min(...monthlyPOTrend.map((d: POTrend) => d.value)))) * 124"
            r="4" fill="var(--primary)" />
          <text v-for="(d, i) in monthlyPOTrend" :key="`lbl-${i}`"
            :x="20 + (i / (monthlyPOTrend.length - 1)) * 600"
            y="158" text-anchor="middle" font-size="10" fill="var(--muted-foreground)">
            {{ d.month }}
          </text>
        </svg>
      </div>

      <!-- Improvement Notes -->
      <div class="bg-card rounded-xl border border-border p-4">
        <p class="text-sm font-semibold text-foreground mb-3">💡 Cost Analysis — Improvements</p>
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
