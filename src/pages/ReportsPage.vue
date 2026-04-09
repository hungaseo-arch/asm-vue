<script setup lang="ts">
import { ref, computed } from 'vue'
import Layout from '@/components/Layout.vue'
import PageHeader from '@/components/PageHeader.vue'
import {
  FileText, Download, Calendar, Filter, BarChart3, ShoppingCart,
  Package, Truck, DollarSign, TrendingUp, ClipboardList,
} from 'lucide-vue-next'
import type { Component } from 'vue'

type ReportCategory = 'sales' | 'procurement' | 'inventory' | 'finance'

interface Report {
  id: string
  category: ReportCategory
  name: string
  desc: string
  format: 'XLSX' | 'PDF'
  lastGen: string
  size: string
  icon: Component
}

const reportList: Report[] = [
  { id:'r1',  category:'sales',       name:'Monthly Revenue Summary',          desc:'Monthly Revenue, Margin & Order Count Summary',         format:'XLSX', lastGen:'2026-03-01', size:'248KB',  icon:BarChart3 },
  { id:'r2',  category:'sales',       name:'Sales Rep Performance Report',     desc:'Actual vs Target Analysis by Sales Rep',                format:'PDF',  lastGen:'2026-03-01', size:'1.2MB',  icon:BarChart3 },
  { id:'r3',  category:'sales',       name:'Margin Analysis by Customer',      desc:'Revenue, Margin Rate & vs Average by Customer',         format:'XLSX', lastGen:'2026-02-28', size:'320KB',  icon:BarChart3 },
  { id:'r4',  category:'sales',       name:'Revenue Analysis by Product',      desc:'Revenue, Margin & Growth Rate by Product Type',         format:'XLSX', lastGen:'2026-02-28', size:'195KB',  icon:BarChart3 },
  { id:'r5',  category:'procurement', name:'PO Execution Status',              desc:'PO Creation, Approval & Completion by Period',          format:'PDF',  lastGen:'2026-03-05', size:'580KB',  icon:ClipboardList },
  { id:'r6',  category:'procurement', name:'Supplier Performance Evaluation',  desc:'Delivery, Quality & Lead Time KPI Assessment',          format:'XLSX', lastGen:'2026-03-01', size:'410KB',  icon:ClipboardList },
  { id:'r7',  category:'procurement', name:'Cost Analysis Report',             desc:'FOB→CIF→Landed Cost→WH Price Cost Structure',           format:'PDF',  lastGen:'2026-02-25', size:'1.5MB',  icon:ClipboardList },
  { id:'r8',  category:'inventory',   name:'Inventory Status Report',          desc:'Stock Level, Min Stock & Buffer % by Warehouse',        format:'XLSX', lastGen:'2026-03-17', size:'280KB',  icon:Package },
  { id:'r9',  category:'inventory',   name:'Inbound Inspection Results',       desc:'Quantity, Pass/Fail Quality & NG Status',               format:'PDF',  lastGen:'2026-03-10', size:'640KB',  icon:Package },
  { id:'r10', category:'finance',     name:'FX Rate Impact Analysis',          desc:'Cost & Margin Impact of FX Rate Fluctuations',          format:'XLSX', lastGen:'2026-03-01', size:'190KB',  icon:DollarSign },
  { id:'r11', category:'finance',     name:'Monthly Payment Schedule',         desc:'Next 3-Month Payment Schedule Based on Open POs',       format:'PDF',  lastGen:'2026-03-01', size:'320KB',  icon:DollarSign },
]

const categoryLabel: Record<ReportCategory, string> = {
  sales:'Sales', procurement:'Procurement', inventory:'Inventory', finance:'Finance',
}
const categoryColor: Record<ReportCategory, string> = {
  sales:'bg-chart-1/20 text-chart-1 border-chart-1/30',
  procurement:'bg-chart-2/20 text-chart-2 border-chart-2/30',
  inventory:'bg-chart-3/20 text-chart-3 border-chart-3/30',
  finance:'bg-primary/20 text-primary border-primary/30',
}
const iconBg: Record<ReportCategory, string> = {
  sales:'bg-chart-1/10', procurement:'bg-chart-2/10', inventory:'bg-chart-3/10', finance:'bg-primary/10',
}

// React: useState → Vue: ref
const category = ref<ReportCategory | 'all'>('all')
const format   = ref<'ALL' | 'XLSX' | 'PDF'>('ALL')

const filtered = computed(() =>
  reportList.filter((r) => {
    const matchCat = category.value === 'all' || r.category === category.value
    const matchFmt = format.value === 'ALL' || r.format === format.value
    return matchCat && matchFmt
  })
)

const categoryTabs = [
  ['all', 'All'], ['sales', 'Sales'], ['procurement', 'Procurement'],
  ['inventory', 'Inventory'], ['finance', 'Finance'],
] as const

const summaryStats = [
  { l:'Total Reports',       v:`${reportList.length} types`, icon:FileText,    bg:'bg-primary/10',  color:'text-primary' },
  { l:'Generated This Month',v:'8',                          icon:Calendar,    bg:'bg-chart-1/10',  color:'text-chart-1' },
  { l:'Downloads',           v:'47',                         icon:Download,    bg:'bg-chart-2/10',  color:'text-chart-2' },
  { l:'Auto-Generated',      v:'Monthly',                    icon:TrendingUp,  bg:'bg-chart-3/10',  color:'text-chart-3' },
]
</script>

<template>
  <Layout>
    <div class="p-6 space-y-5">

      <PageHeader
        title="Reports"
        subtitle="Sales · Procurement · Inventory · Finance Reports — XLSX / PDF Download"
      >
        <template #actions>
          <button class="flex items-center gap-1.5 h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Calendar class="w-3.5 h-3.5" />Period
          </button>
        </template>
      </PageHeader>

      <!-- Period Selector -->
      <div class="bg-card rounded-xl border border-border p-4">
        <div class="flex items-center gap-4 text-xs">
          <div class="flex items-center gap-2">
            <Calendar class="w-3.5 h-3.5 text-muted-foreground" />
            <span class="text-muted-foreground">Search Period:</span>
            <input type="date" value="2025-01-01" class="h-7 px-2 text-xs rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
            <span class="text-muted-foreground">~</span>
            <input type="date" value="2025-12-31" class="h-7 px-2 text-xs rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <button class="flex items-center gap-1 h-7 px-2 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Filter class="w-3 h-3" />Search
          </button>
        </div>
      </div>

      <!-- Category + Format Filters -->
      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-2">
          <!-- v-for 리스트 → React: .map() -->
          <button v-for="[k, l] in categoryTabs" :key="k"
            @click="category = k"
            :class="['px-3 py-1 rounded-full text-xs font-medium transition-colors border',
              category === k ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/40']"
          >{{ l }}</button>
        </div>
        <div class="flex items-center gap-2 ml-4">
          <span class="text-xs text-muted-foreground">Format:</span>
          <button v-for="f in ['ALL', 'XLSX', 'PDF']" :key="f"
            @click="format = f as any"
            :class="['px-3 py-1 rounded-full text-xs font-medium transition-colors border',
              format === f ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/40']"
          >{{ f }}</button>
        </div>
      </div>

      <!-- Report Grid -->
      <div class="grid grid-cols-3 gap-4">
        <div v-for="r in filtered" :key="r.id"
          class="bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <div :class="`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg[r.category]}`">
              <component :is="r.icon" class="w-4 h-4" />
            </div>
            <div class="flex items-center gap-1.5">
              <span :class="`text-[10px] px-2 py-0.5 rounded border font-medium ${categoryColor[r.category]}`">
                {{ categoryLabel[r.category] }}
              </span>
              <span :class="['text-[10px] px-2 py-0.5 rounded border font-mono font-medium',
                r.format === 'XLSX' ? 'bg-chart-1/10 text-chart-1 border-chart-1/30' : 'bg-chart-2/10 text-chart-2 border-chart-2/30']">
                {{ r.format }}
              </span>
            </div>
          </div>
          <h4 class="text-sm font-semibold text-foreground mb-1">{{ r.name }}</h4>
          <p class="text-xs text-muted-foreground mb-3">{{ r.desc }}</p>
          <div class="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Last Generated: {{ r.lastGen }}</span>
            <span>{{ r.size }}</span>
          </div>
          <button class="w-full mt-3 h-8 text-xs rounded-md border border-border bg-background hover:bg-muted flex items-center justify-center gap-1.5 transition-colors">
            <Download class="w-3.5 h-3.5" />Download
          </button>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-4 gap-4">
        <div v-for="k in summaryStats" :key="k.l" class="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div :class="`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${k.bg}`">
            <component :is="k.icon" class="w-4 h-4" :class="k.color" />
          </div>
          <div>
            <p class="text-xs text-muted-foreground">{{ k.l }}</p>
            <p class="text-xl font-bold text-foreground">{{ k.v }}</p>
          </div>
        </div>
      </div>

    </div>
  </Layout>
</template>
