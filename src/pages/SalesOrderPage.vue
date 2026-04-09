<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import Layout from '@/components/Layout.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ApprovalStepper from '@/components/ApprovalStepper.vue'
import { salesOrders } from '@/data'
import { deliveryStatusColor, paymentStatusColor, soApprovalSteps, fmtIDR, fmtIDRCompact, fmtNum } from '@/lib/index'
import type { DeliveryStatus } from '@/lib/index'
import { ShoppingCart, Truck, BarChart3, Plus, Search, Filter, XCircle, CheckCircle2, AlertCircle, TrendingUp, DollarSign, ClipboardList, Package } from 'lucide-vue-next'

type SOTab = 'create' | 'processing' | 'delivery' | 'margin'

// ── Main tab state ──
const tab = ref<SOTab>('processing')

// ── Create SO state ──
const createMode = ref<'new' | 'draft'>('new')
const submitted  = ref(false)
const selectedDraftId = ref('so5')
const addlDiscPct = ref(5)
const PPN_PCT = 11

const form = reactive({
  customerCode: '', customerName: '', customerPO: '', planDate: '',
  warehouse: 'WH-Jakarta', salesRep: 'Budi S.',
  deliveryMethod: 'Freight (JNE Trucking)', paymentTerms: 'TOP 30', remarks: '',
})
const items = ref([
  { no: 1, type: 'Tire', brand: 'ASCENDO', description: 'ASC 10.00R20 AR102HD 18++',          qty: 10, unitPrice: 3196397, costPrice: 2712087, discPct: 0 },
  { no: 2, type: 'Tube', brand: 'ASCENDO', description: 'ASC 10.00-20 TR78 Heavy Duty Tube',  qty: 10, unitPrice: 298198,  costPrice: 245000,  discPct: 0 },
  { no: 3, type: 'Flap', brand: 'ASCENDO', description: 'FLAP 10.00/11.00R20(S) Metal Plate', qty: 10, unitPrice: 63964,   costPrice: 51200,   discPct: 0 },
])

const draftOrders = computed(() => salesOrders.filter((s) => ['Draft','Team Leader','Sales Manager','Division Head'].includes(s.approvalStatus)))
const draft = computed(() => salesOrders.find((s) => s.id === selectedDraftId.value) ?? salesOrders[4]!)

const totalAmount = computed(() => items.value.reduce((s, i) => s + i.qty * i.unitPrice * (1 - i.discPct / 100), 0))
const totalQty    = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
const discounted  = computed(() => totalAmount.value * (1 - addlDiscPct.value / 100))
const withPPN     = computed(() => discounted.value * (1 + PPN_PCT / 100))
const finalAmt    = computed(() => Math.floor(Math.round(withPPN.value) / 1000) * 1000)

function addItem() {
  items.value.push({ no: items.value.length + 1, type: 'Tire', brand: 'ASCENDO', description: '', qty: 0, unitPrice: 0, costPrice: 0, discPct: 0 })
}
function itemNet(item: typeof items.value[0]) { return item.unitPrice * (1 - item.discPct / 100) }
function itemAmount(item: typeof items.value[0]) { return itemNet(item) * item.qty }
function itemMarginPct(item: typeof items.value[0]) {
  const net = itemNet(item)
  return net > 0 ? ((net - item.costPrice) / net * 100).toFixed(1) : null
}
function marginColor(pct: number) { return pct >= 15 ? 'text-chart-1' : pct >= 10 ? 'text-chart-3' : 'text-destructive' }

// ── Processing state ──
const soSearch        = ref('')
const deliveryFilter  = ref<DeliveryStatus | 'All'>('All')
const selectedSOId    = ref<string | null>(null)

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

// ── Margin Analysis data ──
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

// SVG horizontal bar chart for margin
const maxProdMargin = Math.max(...productMargins.map((p) => p.pct))
const COLORS = ['var(--chart-1)','var(--chart-2)','var(--chart-3)','var(--chart-4)','var(--primary)','var(--accent)','var(--destructive)']

const tabs = [
  { key: 'create'     as SOTab, label: 'Create SO',        icon: Plus },
  { key: 'processing' as SOTab, label: 'SO Processing',    icon: ClipboardList },
  { key: 'delivery'   as SOTab, label: 'Delivery Tracking',icon: Truck },
  { key: 'margin'     as SOTab, label: 'Margin Analysis',  icon: BarChart3 },
]

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
function approvalColor(status: string) {
  if (status === 'Confirmed') return 'text-chart-1'
  if (status === 'Rejected')  return 'text-destructive'
  return 'text-chart-3'
}
</script>

<template>
  <Layout>
    <div class="p-6 space-y-4">
      <PageHeader title="Sales Order Management" subtitle="Create SO · Processing · Delivery Tracking · Margin Analysis — Approval Draft→COO→Confirmed" />

      <!-- Tab Switcher -->
      <div class="flex items-center gap-1 bg-muted/40 p-1 rounded-xl w-fit">
        <button v-for="t in tabs" :key="t.key" @click="tab = t.key"
          :class="['flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            tab === t.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground']">
          <component :is="t.icon" class="w-3.5 h-3.5" />{{ t.label }}
        </button>
      </div>

      <!-- ── CREATE SO TAB ── -->
      <div v-if="tab === 'create'" class="space-y-4">
        <!-- Mode Toggle -->
        <div class="flex items-center gap-1 bg-muted/40 p-1 rounded-xl w-fit">
          <button @click="createMode = 'new'; submitted = false"
            :class="['flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors', createMode === 'new' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground']">
            <ClipboardList class="w-3.5 h-3.5" />New SO
          </button>
          <button @click="createMode = 'draft'"
            :class="['flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors', createMode === 'draft' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground']">
            <ClipboardList class="w-3.5 h-3.5" />Draft Approvals ({{ draftOrders.length }})
          </button>
        </div>

        <!-- Submitted State -->
        <div v-if="submitted" class="flex flex-col items-center justify-center py-20 gap-4">
          <div class="w-16 h-16 bg-chart-1/20 rounded-full flex items-center justify-center">
            <CheckCircle2 class="w-8 h-8 text-chart-1" />
          </div>
          <p class="text-lg font-bold text-foreground">Submission Complete</p>
          <p class="text-sm text-muted-foreground">New SO saved as Draft and submitted for Team Leader approval.</p>
          <div class="flex gap-3">
            <button @click="submitted = false" class="h-8 px-3 text-xs rounded-md border border-border hover:bg-muted transition-colors">New SO</button>
            <button @click="createMode = 'draft'; submitted = false" class="h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">View Drafts</button>
          </div>
        </div>

        <!-- New SO Form -->
        <div v-else-if="createMode === 'new'" class="space-y-4">
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-xs font-semibold text-foreground mb-3">Approval Path (5 Steps)</p>
            <div class="overflow-x-auto pb-1">
              <ApprovalStepper :steps="soApprovalSteps" current-step="Draft" />
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <!-- I Customer Info -->
            <div class="bg-card rounded-xl border border-border p-4">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-6 h-6 rounded bg-primary/20 flex items-center justify-center"><span class="text-xs font-bold text-primary">I</span></div>
                <p class="text-sm font-semibold text-foreground">Customer Info</p>
              </div>
              <div class="space-y-3">
                <div v-for="f in [{l:'Customer Code *',k:'customerCode'},{l:'Customer Name *',k:'customerName'},{l:'Customer PO No.',k:'customerPO'}]" :key="f.k" class="space-y-1">
                  <label class="text-[11px] text-muted-foreground font-medium">{{ f.l }}</label>
                  <input v-model="(form as any)[f.k]" class="w-full h-8 px-2 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div class="space-y-1">
                  <label class="text-[11px] text-muted-foreground font-medium">Delivery Date *</label>
                  <input type="date" v-model="form.planDate" class="w-full h-8 px-2 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div class="space-y-1">
                  <label class="text-[11px] text-muted-foreground font-medium">Sales Rep</label>
                  <select v-model="form.salesRep" class="w-full h-8 px-2 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring">
                    <option v-for="o in ['Budi S.','Ahmad R.','Sari W.','Dewi P.']" :key="o">{{ o }}</option>
                  </select>
                </div>
              </div>
            </div>
            <!-- II Shipping -->
            <div class="bg-card rounded-xl border border-border p-4">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-6 h-6 rounded bg-primary/20 flex items-center justify-center"><span class="text-xs font-bold text-primary">II</span></div>
                <p class="text-sm font-semibold text-foreground">Shipping & Payment</p>
              </div>
              <div class="space-y-3">
                <div class="space-y-1">
                  <label class="text-[11px] text-muted-foreground font-medium">Origin WH</label>
                  <select v-model="form.warehouse" class="w-full h-8 px-2 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring">
                    <option v-for="o in ['WH-Jakarta','WH-Surabaya','WH-Karawang','WH-Semarang']" :key="o">{{ o }}</option>
                  </select>
                </div>
                <div class="space-y-1">
                  <label class="text-[11px] text-muted-foreground font-medium">Delivery Method</label>
                  <select v-model="form.deliveryMethod" class="w-full h-8 px-2 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring">
                    <option v-for="o in ['Freight (JNE Trucking)','Freight (ANT Express)','Freight (SCP Express)','Pickup','COD']" :key="o">{{ o }}</option>
                  </select>
                </div>
                <div class="space-y-1">
                  <label class="text-[11px] text-muted-foreground font-medium">Payment Terms</label>
                  <select v-model="form.paymentTerms" class="w-full h-8 px-2 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring">
                    <option v-for="o in ['COD','TOP 14','TOP 30','TOP 45','TOP 60']" :key="o">{{ o }}</option>
                  </select>
                </div>
                <div class="space-y-1">
                  <label class="text-[11px] text-muted-foreground font-medium">Remarks</label>
                  <textarea v-model="form.remarks" class="w-full h-20 px-2 py-1.5 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                </div>
              </div>
            </div>
            <!-- III Amount Summary -->
            <div class="bg-card rounded-xl border border-border p-4">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-6 h-6 rounded bg-primary/20 flex items-center justify-center"><span class="text-xs font-bold text-primary">III</span></div>
                <p class="text-sm font-semibold text-foreground">Amount Summary</p>
              </div>
              <div class="space-y-3">
                <div class="bg-muted/30 rounded-lg p-3 space-y-2 text-xs">
                  <div class="flex justify-between"><span class="text-muted-foreground">Line Items</span><span class="font-semibold text-foreground">{{ items.length }} Lines</span></div>
                  <div class="flex justify-between"><span class="text-muted-foreground">Total Qty</span><span class="font-mono font-semibold text-foreground">{{ fmtNum(totalQty) }} Pcs</span></div>
                  <div class="border-t border-border pt-2 flex justify-between"><span class="text-muted-foreground">Sub-Total</span><span class="font-mono font-semibold text-foreground">{{ fmtIDRCompact(totalAmount) }}</span></div>
                  <div class="flex justify-between"><span class="text-muted-foreground">VAT (11%)</span><span class="font-mono text-muted-foreground">{{ fmtIDRCompact(totalAmount * 0.11) }}</span></div>
                  <div class="border-t border-border pt-2 flex justify-between"><span class="font-semibold text-foreground">Total (inc. VAT)</span><span class="font-mono font-bold text-primary">{{ fmtIDRCompact(totalAmount * 1.11) }}</span></div>
                </div>
                <div class="flex gap-2 pt-2">
                  <button @click="submitted = true" class="flex-1 h-8 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-1 transition-colors">
                    <CheckCircle2 class="w-3.5 h-3.5" />Submit Approval
                  </button>
                  <button class="h-8 px-3 text-xs rounded-md border border-border hover:bg-muted transition-colors">Save Draft</button>
                </div>
              </div>
            </div>
          </div>

          <!-- IV Line Items Table -->
          <div class="bg-card rounded-xl border border-border p-4">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded bg-primary/20 flex items-center justify-center"><span class="text-xs font-bold text-primary">IV</span></div>
                <p class="text-sm font-semibold text-foreground">SO Line Items</p>
              </div>
              <button @click="addItem" class="flex items-center gap-1 h-7 px-2 text-xs rounded-md border border-border hover:bg-muted transition-colors">
                <Plus class="w-3 h-3" />Add Line
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead>
                  <tr class="border-b border-border bg-muted/20">
                    <th class="text-left px-2 py-2 text-muted-foreground font-medium">No.</th>
                    <th class="text-left px-2 py-2 text-muted-foreground font-medium">Type</th>
                    <th class="text-left px-2 py-2 text-muted-foreground font-medium">Brand</th>
                    <th class="text-left px-2 py-2 text-muted-foreground font-medium">Item Description</th>
                    <th class="text-right px-2 py-2 text-muted-foreground font-medium">Qty</th>
                    <th class="text-right px-2 py-2 text-muted-foreground font-medium">Unit Price</th>
                    <th class="text-right px-2 py-2 text-muted-foreground font-medium">Disc%</th>
                    <th class="text-right px-2 py-2 text-muted-foreground font-medium">Net Price</th>
                    <th class="text-right px-2 py-2 text-muted-foreground font-medium">Amount</th>
                    <th class="text-right px-2 py-2 text-muted-foreground font-medium">Margin%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in items" :key="idx" class="border-b border-border/50 hover:bg-muted/10">
                    <td class="px-2 py-1.5 text-muted-foreground">{{ item.no }}</td>
                    <td class="px-2 py-1.5">
                      <select v-model="item.type" class="h-7 px-1 text-[11px] rounded border border-input bg-background text-foreground">
                        <option v-for="o in ['Tire','Tube','Flap','Battery','Rim']" :key="o">{{ o }}</option>
                      </select>
                    </td>
                    <td class="px-2 py-1.5">
                      <select v-model="item.brand" class="h-7 px-1 text-[11px] rounded border border-input bg-background text-foreground">
                        <option v-for="o in ['ASCENDO','ACCELERA','FALKEN','TOYO','ACHILLES']" :key="o">{{ o }}</option>
                      </select>
                    </td>
                    <td class="px-2 py-1.5">
                      <input v-model="item.description" placeholder="ASC 10.00R20..." class="h-7 w-36 px-2 text-[11px] rounded border border-input bg-background text-foreground" />
                    </td>
                    <td class="px-2 py-1.5">
                      <input type="number" v-model.number="item.qty" class="h-7 w-16 px-2 text-[11px] text-right rounded border border-input bg-background font-mono" />
                    </td>
                    <td class="px-2 py-1.5">
                      <input type="number" v-model.number="item.unitPrice" class="h-7 w-28 px-2 text-[11px] text-right rounded border border-input bg-background font-mono" />
                    </td>
                    <td class="px-2 py-1.5">
                      <input type="number" v-model.number="item.discPct" class="h-7 w-14 px-2 text-[11px] text-right rounded border border-input bg-background font-mono" />
                    </td>
                    <td class="px-2 py-1.5 text-right font-mono text-[11px] text-foreground">{{ fmtNum(Math.round(itemNet(item))) }}</td>
                    <td class="px-2 py-1.5 text-right font-mono text-[11px] font-semibold text-foreground">{{ fmtNum(Math.round(itemAmount(item))) }}</td>
                    <td class="px-2 py-1.5 text-right font-mono text-[11px] font-semibold">
                      <span v-if="itemAmount(item) > 0" :class="marginColor(parseFloat(itemMarginPct(item)!))">{{ itemMarginPct(item) }}%</span>
                      <span v-else class="text-muted-foreground">—</span>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="border-t-2 border-border bg-muted/30">
                    <td colspan="4" class="px-2 py-2 text-xs font-semibold text-foreground">Sub-Total</td>
                    <td class="px-2 py-2 text-right font-mono text-xs font-semibold">{{ fmtNum(totalQty) }}</td>
                    <td /><td />
                    <td class="px-2 py-2 text-right font-mono text-xs font-bold text-foreground" colspan="2">{{ fmtNum(Math.round(totalAmount)) }}</td>
                    <td />
                  </tr>
                  <tr class="border-t border-border bg-muted/10">
                    <td colspan="6" class="px-2 py-2 text-xs font-medium text-muted-foreground">Additional Discount</td>
                    <td class="px-2 py-2"><div class="flex items-center justify-end gap-1"><input type="number" v-model.number="addlDiscPct" min="0" max="100" class="h-6 w-14 px-2 text-[11px] text-right rounded border border-input bg-background font-mono" /><span class="text-[11px] text-muted-foreground">%</span></div></td>
                    <td />
                    <td class="px-2 py-2 text-right font-mono text-xs text-destructive">{{ addlDiscPct > 0 ? `−${fmtNum(Math.round(totalAmount * addlDiscPct / 100))}` : '—' }}</td>
                    <td />
                  </tr>
                  <tr class="border-t border-border bg-muted/10">
                    <td colspan="6" class="px-2 py-2 text-xs font-medium text-muted-foreground">PPN (Tax)</td>
                    <td class="px-2 py-2 text-right font-mono text-[11px] text-muted-foreground">{{ PPN_PCT }}%</td>
                    <td />
                    <td class="px-2 py-2 text-right font-mono text-xs text-foreground">{{ fmtNum(Math.round(discounted * PPN_PCT / 100)) }}</td>
                    <td />
                  </tr>
                  <tr class="border-t-2 border-primary/30 bg-primary/5">
                    <td colspan="4" class="px-2 py-2.5 text-xs font-bold text-foreground">Total (incl. PPN)</td>
                    <td colspan="4" />
                    <td class="px-2 py-2.5 text-right font-mono text-sm font-bold text-primary">{{ fmtNum(finalAmt) }}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <!-- Draft Approvals -->
        <div v-else class="space-y-4">
          <div class="grid grid-cols-4 gap-3">
            <button v-for="so in draftOrders" :key="so.id" @click="selectedDraftId = so.id"
              :class="['text-left bg-card border rounded-xl p-3 transition-all hover:shadow-md', selectedDraftId === so.id ? 'border-primary ring-1 ring-primary' : 'border-border']">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-mono font-semibold text-foreground">{{ so.soNo }}</span>
                <span :class="`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${deliveryStatusColor[so.deliveryStatus]}`">{{ so.approvalStatus }}</span>
              </div>
              <p class="text-[11px] text-muted-foreground truncate">{{ so.customerName }}</p>
              <p class="text-xs font-mono font-bold text-primary mt-1">{{ fmtIDRCompact(so.totalAmount) }}</p>
            </button>
          </div>
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-xs font-semibold text-foreground mb-3">Approval Status — {{ draft.soNo }}</p>
            <div class="overflow-x-auto pb-1"><ApprovalStepper :steps="soApprovalSteps" :current-step="draft.approvalStatus" /></div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-card rounded-xl border border-border p-4">
              <p class="text-xs font-semibold text-foreground mb-3">Customer Info</p>
              <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div v-for="r in [{label:'Customer Code',value:draft.customerCode},{label:'Customer Name',value:draft.customerName},{label:'Order Date',value:draft.soDate},{label:'Est. Delivery',value:draft.planDeliveryDate},{label:'Payment Terms',value:draft.paymentTerms},{label:'Sales Rep',value:draft.salesRep}]" :key="r.label" class="flex gap-2">
                  <span class="text-muted-foreground w-20 flex-shrink-0">{{ r.label }}</span>
                  <span class="font-medium text-foreground truncate">{{ r.value }}</span>
                </div>
              </div>
            </div>
            <div class="bg-card rounded-xl border border-border p-4">
              <p class="text-xs font-semibold text-foreground mb-3">Credit Limit Status</p>
              <div class="space-y-3">
                <div class="flex justify-between text-xs"><span class="text-muted-foreground">Credit Available</span><span class="font-mono font-semibold">{{ fmtIDR(draft.creditBalance) }}</span></div>
                <div class="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div :class="['h-full rounded-full', (draft.creditBalance / draft.creditLimit) > 0.3 ? 'bg-chart-1' : 'bg-destructive']" :style="{ width: `${(draft.creditBalance / draft.creditLimit) * 100}%` }" />
                </div>
                <div class="flex justify-between text-[10px] text-muted-foreground">
                  <span>Used: {{ fmtIDR(draft.creditLimit - draft.creditBalance) }}</span>
                  <span>Limit: {{ fmtIDR(draft.creditLimit) }}</span>
                </div>
                <div class="flex gap-2 pt-1">
                  <button class="flex-1 h-7 text-xs rounded-md bg-chart-1 text-white flex items-center justify-center gap-1"><CheckCircle2 class="w-3 h-3" />Approve</button>
                  <button class="h-7 px-3 text-xs rounded-md border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors">Reject</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── PROCESSING TAB ── -->
      <div v-else-if="tab === 'processing'" class="space-y-4">
        <div class="grid grid-cols-5 gap-3">
          <div v-for="kpi in procKpis" :key="kpi.label" class="bg-card rounded-xl border border-border p-3 flex items-center gap-3">
            <div :class="`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${kpi.bg}`">
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
                    <td class="px-3 py-2 text-foreground max-w-[130px] truncate">{{ so.customerName }}</td>
                    <td class="px-3 py-2 text-right font-mono">{{ fmtNum(so.qty) }}</td>
                    <td class="px-3 py-2 text-right font-mono font-semibold">{{ fmtIDRCompact(so.totalAmount) }}</td>
                    <td class="px-3 py-2"><StatusBadge :label="so.paymentStatus" :color-class="paymentStatusColor[so.paymentStatus]" /></td>
                    <td class="px-3 py-2"><StatusBadge :label="so.deliveryStatus" :color-class="deliveryStatusColor[so.deliveryStatus]" /></td>
                    <td class="px-3 py-2 text-[10px]" :class="approvalColor(so.approvalStatus)">{{ so.approvalStatus }}</td>
                    <td class="px-3 py-2 text-muted-foreground">{{ so.salesRep }}</td>
                    <td class="px-3 py-2 text-muted-foreground max-w-[100px] truncate">{{ so.remarks || '-' }}</td>
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

      <!-- ── DELIVERY TAB ── -->
      <div v-else-if="tab === 'delivery'" class="space-y-4">
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
            <span class="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full">{{ salesOrders.filter((so) => so.deliveryStatus !== 'Cancelled').length }} items</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-border bg-muted/20">
                  <th v-for="h in ['Order No.','Customer','Tracking No.','Origin WH','Ship Date','Est. Arrival','Actual Arrival','Status','Remarks']" :key="h" class="text-left px-3 py-2.5 text-muted-foreground font-medium whitespace-nowrap">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="so in salesOrders.filter((so) => so.deliveryStatus !== 'Cancelled')" :key="so.id" class="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td class="px-3 py-2.5 font-mono text-foreground font-medium">{{ so.soNo }}</td>
                  <td class="px-3 py-2.5 text-foreground max-w-[130px] truncate">{{ so.customerName }}</td>
                  <td class="px-3 py-2.5 font-mono text-chart-2">{{ so.trackingNo || '—' }}</td>
                  <td class="px-3 py-2.5 text-muted-foreground">{{ so.originWHShip || so.originWH }}</td>
                  <td class="px-3 py-2.5 font-mono text-muted-foreground">{{ so.shipDate || '—' }}</td>
                  <td class="px-3 py-2.5 font-mono text-muted-foreground">{{ so.estArrival || '—' }}</td>
                  <td class="px-3 py-2.5 font-mono" :class="so.actualArrival ? 'text-chart-1 font-medium' : 'text-muted-foreground'">{{ so.actualArrival || '—' }}</td>
                  <td class="px-3 py-2.5"><StatusBadge :label="so.deliveryStatus" :color-class="deliveryStatusColor[so.deliveryStatus]" /></td>
                  <td class="px-3 py-2.5 text-muted-foreground max-w-[100px] truncate">{{ so.remarks || '' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ── MARGIN ANALYSIS TAB ── -->
      <div v-else class="space-y-4">
        <div class="grid grid-cols-4 gap-4">
          <div v-for="kpi in [
            {label:'Total Sales',value:'Rp 19.2B',sub:'492 SKUs total',icon:DollarSign,bg:'bg-primary/10',color:'text-primary'},
            {label:'Total Margin',value:'Rp 2.0B',sub:'Total profit',icon:TrendingUp,bg:'bg-chart-1/10',color:'text-chart-1'},
            {label:'Avg Margin %',value:'10.5%',sub:'All products',icon:BarChart3,bg:'bg-chart-3/10',color:'text-chart-3'},
            {label:'Top Margin',value:'TIRE AGR',sub:'Margin 29.3%',icon:Package,bg:'bg-chart-2/10',color:'text-chart-2'},
          ]" :key="kpi.label" class="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div :class="`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${kpi.bg}`">
              <component :is="kpi.icon" class="w-4 h-4" :class="kpi.color" />
            </div>
            <div><p class="text-xs text-muted-foreground">{{ kpi.label }}</p><p class="text-lg font-bold font-mono text-foreground">{{ kpi.value }}</p><p class="text-[10px] text-muted-foreground">{{ kpi.sub }}</p></div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <!-- Margin bar chart (SVG) -->
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-sm font-semibold text-foreground mb-3">Margin % by Product Type</p>
            <div class="space-y-2">
              <div v-for="(row, i) in productMargins" :key="row.name" class="flex items-center gap-3 text-xs">
                <span class="text-muted-foreground w-20 flex-shrink-0 text-right">{{ row.name }}</span>
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

    </div>
  </Layout>
</template>
