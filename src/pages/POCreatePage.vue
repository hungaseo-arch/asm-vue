<script setup lang="ts">
import { ref, computed } from 'vue'
import Layout from '@/components/Layout.vue'
import PageHeader from '@/components/PageHeader.vue'
import ApprovalStepper from '@/components/ApprovalStepper.vue'
import { fmtUSD, fmtIDR, fmtNum } from '@/lib/index'
import { poLineItems } from '@/data'
import { Save, Send, ChevronDown, Plus, Trash2, AlertCircle } from 'lucide-vue-next'
import type { POLineItem } from '@/lib/index'

const supplierOptions = [
  'Hubei Aulice Tyre Co., Ltd.',
  'Shandong Linglong Tyre Co.',
  'Qingdao Doublestar Tire Industrial Co.',
  'Zhongce Rubber Group Co.',
  'Shandong Haian Rubber Co.',
]
const warehouses = ['WH-Surabaya', 'WH-Karawang', 'WH-Semarang']

const approvalStatus = ref('Draft')
const fxRate = ref(17_580)

// React: useState(poLineItems) → Vue: ref([...poLineItems])
// 깊은 복사로 반응성 보장
const lines = ref<POLineItem[]>(poLineItems.map((l) => ({ ...l })))

const totalUSD         = computed(() => lines.value.reduce((s, l) => s + l.cifUsd * l.qty, 0))
const totalIDR         = computed(() => lines.value.reduce((s, l) => s + l.landedCostIdr * l.qty, 0))
const totalSubtotalIDR = computed(() => lines.value.reduce((s, l) => s + l.whPriceIdr * l.qty, 0))

// React: handleQtyChange → Vue: 직접 반응형 업데이트
function handleQtyChange(no: number, val: number) {
  const line = lines.value.find((l) => l.no === no)
  if (line) {
    line.qty = val
    line.amount = line.cifUsd * val
  }
}

function addLine() {
  lines.value.push({
    no: lines.value.length + 1,
    brand: 'ASCENDO',
    description: '',
    type: '',
    qty: 0,
    unit: 'Pcs',
    fobUsd: 0,
    cifUsd: 0,
    landedCostIdr: 0,
    whPriceIdr: 0,
    amount: 0,
    fxRate: fxRate.value,
  })
}

function removeLine(no: number) {
  lines.value = lines.value.filter((l) => l.no !== no)
}

const costFields = computed(() => [
  { label: 'FOB Price (USD)',     key: 'fob',     value: '$134.20',       note: 'Ex-factory price',          editable: true },
  { label: 'CIF Price (USD)',     key: 'cif',     value: '$142.23',       note: 'FOB + Freight + Insurance', editable: false },
  { label: 'Import Duty (BM)',    key: 'duty',    value: 'Rp 124,451',   note: '5% duty rate',              editable: false },
  { label: 'Customs Fee (IE)',    key: 'customs', value: 'Rp 20,000',    note: 'Fixed per shipment',        editable: false },
  { label: 'Inland Freight (OF)',key: 'inland',  value: 'Rp 35,000',    note: 'To warehouse',              editable: false },
  { label: 'WH Price (IDR)',      key: 'wh',      value: 'Rp 2,712,087', note: 'Warehouse outbound price',  editable: false },
])

const inputCls = 'w-full h-9 px-3 text-sm rounded-md border border-input focus:outline-none focus:ring-1 focus:ring-ring'

</script>

<template>
  <Layout>
    <div class="p-6 space-y-5">

      <PageHeader
        title="Create PO"
        subtitle="Create a new purchase order and request approval through the approval line"
      >
        <template #actions>
          <div class="flex gap-2">
            <button class="flex items-center gap-1.5 h-8 px-3 text-xs rounded-md border border-border bg-background hover:bg-muted transition-colors">
              <Save class="w-3.5 h-3.5" /> Save Draft
            </button>
            <button class="flex items-center gap-1.5 h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Send class="w-3.5 h-3.5" /> Submit for Approval
            </button>
          </div>
        </template>
      </PageHeader>

      <!-- Improvement Banner + Approval Stepper -->
      <div class="flex items-stretch gap-4">
        <div class="flex-1 bg-chart-3/10 border border-chart-3/30 rounded-lg px-4 py-3 flex items-start gap-3">
          <AlertCircle class="w-4 h-4 text-chart-3 mt-0.5 shrink-0" />
          <div>
            <p class="text-sm font-medium text-chart-3">💡 Improvement Planned</p>
            <p class="text-xs text-muted-foreground mt-0.5">
              When FOB price is entered, CIF·Landed Cost·WH Price will be auto-calculated based on current FX rate ({{ fmtNum(fxRate) }} IDR/USD). Import duty (5%), customs clearance fee, and inland freight will be automatically applied.
            </p>
          </div>
        </div>
        <div class="bg-card rounded-xl border border-border p-4 w-1/2 shrink-0">
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm font-semibold text-foreground">Approval Progress</p>
            <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono">ASM-PO-2603-NEW</span>
          </div>
          <ApprovalStepper :steps="['Draft','Team Leader','Purchase Manager','Division Head']" :current-step="approvalStatus" />
        </div>
      </div>

      <!-- I. Supplier Information -->
      <div class="bg-card rounded-xl border border-border overflow-hidden">
        <div class="px-4 py-3 border-b border-border bg-muted/30">
          <p class="text-sm font-semibold text-foreground">I. Supplier Information</p>
        </div>
        <div class="p-4 grid grid-cols-3 gap-4">
          <!-- Supplier Select -->
          <div class="space-y-1.5">
            <label class="text-xs text-muted-foreground font-medium">Supplier *</label>
            <div class="relative">
              <select :class="`${inputCls} pr-8 bg-background appearance-none`">
                <option value="">Select...</option>
                <!-- v-for 리스트 → React: .map() -->
                <option v-for="s in supplierOptions" :key="s">{{ s }}</option>
              </select>
              <ChevronDown class="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-xs text-muted-foreground font-medium">Supplier Code</label>
            <input :class="`${inputCls} bg-muted/30 text-muted-foreground`" readonly value="SUP-CN-001" />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs text-muted-foreground font-medium">Payment Terms</label>
            <input :class="`${inputCls} bg-background`" value="LC 60" />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs text-muted-foreground font-medium">Order Date *</label>
            <input type="date" :class="`${inputCls} bg-background`" value="2026-03-26" />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs text-muted-foreground font-medium">ETA (Expected Arrival Date) *</label>
            <input type="date" :class="`${inputCls} bg-background`" />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs text-muted-foreground font-medium">Receiving Warehouse *</label>
            <div class="relative">
              <select :class="`${inputCls} pr-8 bg-background appearance-none`">
                <option v-for="w in warehouses" :key="w">{{ w }}</option>
              </select>
              <ChevronDown class="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <!-- II. Cost Information -->
      <div class="bg-card rounded-xl border border-border overflow-hidden">
        <div class="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
          <p class="text-sm font-semibold text-foreground">II. Cost Information (ASM Cost Structure)</p>
          <div class="flex items-center gap-2 text-xs">
            <span class="text-muted-foreground">Applied FX Rate:</span>
            <span class="font-mono font-semibold text-chart-3">{{ fmtNum(fxRate) }} IDR/USD</span>
            <span class="text-chart-3 text-[10px]">▲ +0.46%</span>
          </div>
        </div>
        <div class="p-4 grid grid-cols-6 gap-3">
          <div v-for="field in costFields" :key="field.key" class="space-y-1.5">
            <label class="text-xs text-muted-foreground font-medium">{{ field.label }}</label>
            <input
              :class="[inputCls, 'font-mono', field.editable ? 'bg-background' : 'bg-muted/50 text-muted-foreground']"
              :value="field.value"
              :readonly="!field.editable"
            />
            <p class="text-[10px] text-muted-foreground/70">{{ field.note }}</p>
          </div>
        </div>
      </div>

      <!-- III. PO Line Items -->
      <div class="bg-card rounded-xl border border-border overflow-hidden">
        <div class="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
          <p class="text-sm font-semibold text-foreground">III. Order Detail (Detail PO)</p>
          <button @click="addLine"
            class="flex items-center gap-1.5 h-7 px-2 text-xs rounded-md border border-border bg-background hover:bg-muted transition-colors">
            <Plus class="w-3 h-3" /> Add Item
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-border bg-muted/20">
                <th v-for="h in ['No.','Brand','Product Description','Type','Qty','FOB(USD)','CIF(USD)','Landed(IDR)','WH(IDR)','Subtotal(IDR)','']"
                  :key="h" class="text-left px-3 py-2.5 text-muted-foreground font-medium whitespace-nowrap first:pl-4">{{ h }}</th>
              </tr>
            </thead>
            <tbody>
              <!-- v-for 리스트 — React: lines.map() -->
              <tr v-for="line in lines" :key="line.no" class="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td class="px-4 py-2.5 text-muted-foreground">{{ line.no }}</td>
                <td class="px-3 py-2.5 font-medium text-foreground">{{ line.brand }}</td>
                <td class="px-3 py-2.5">
                  <input :value="line.description"
                    class="w-full h-7 px-2 text-xs rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
                </td>
                <td class="px-3 py-2.5 text-muted-foreground">{{ line.type }}</td>
                <td class="px-3 py-2.5">
                  <!-- v-model.number — React: onChange + Number() 변환 -->
                  <input type="number" v-model.number="line.qty"
                    @change="handleQtyChange(line.no, line.qty)"
                    class="w-full h-7 px-2 text-xs text-right rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring font-mono" />
                </td>
                <td class="px-3 py-2.5 text-right font-mono text-foreground">{{ fmtUSD(line.fobUsd) }}</td>
                <td class="px-3 py-2.5 text-right font-mono text-foreground">{{ fmtUSD(line.cifUsd) }}</td>
                <td class="px-3 py-2.5 text-right font-mono text-foreground">{{ fmtIDR(line.landedCostIdr) }}</td>
                <td class="px-3 py-2.5 text-right font-mono text-foreground">{{ fmtIDR(line.whPriceIdr) }}</td>
                <td class="px-3 py-2.5 text-right font-mono font-semibold text-primary">{{ fmtIDR(line.whPriceIdr * line.qty) }}</td>
                <td class="px-3 py-2.5">
                  <button @click="removeLine(line.no)"
                    class="w-5 h-5 flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                    <Trash2 class="w-3 h-3" />
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="bg-muted/30 border-t-2 border-border">
                <td colspan="9" class="px-4 py-3 text-sm font-semibold text-foreground text-right">Total</td>
                <td class="px-3 py-3 text-right font-mono font-bold text-primary">{{ fmtIDR(totalSubtotalIDR) }}</td>
                <td />
              </tr>
              <tr class="bg-muted/20">
                <td colspan="9" class="px-4 py-2 text-xs text-muted-foreground text-right">Landed Cost Total (IDR)</td>
                <td class="px-3 py-2 text-right font-mono text-sm font-semibold text-foreground">{{ fmtIDR(totalIDR) }}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- IV. Remarks -->
      <div class="bg-card rounded-xl border border-border overflow-hidden">
        <div class="px-4 py-3 border-b border-border bg-muted/30">
          <p class="text-sm font-semibold text-foreground">IV. Remarks & Attachments</p>
        </div>
        <div class="p-4 grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs text-muted-foreground font-medium">Remarks</label>
            <textarea class="w-full h-20 px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              placeholder="Enter special notes..." />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs text-muted-foreground font-medium">Attachments</label>
            <div class="h-20 border-2 border-dashed border-border rounded-md flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
              <p class="text-xs text-muted-foreground">Click to attach files (Quotation, Proforma Invoice)</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </Layout>
</template>
