<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import Layout from '@/components/Layout.vue'
import PageHeader from '@/components/PageHeader.vue'
import ApprovalStepper from '@/components/ApprovalStepper.vue'
import { salesOrders, products } from '@/data'
import { deliveryStatusColor, fmtIDR, fmtIDRCompact, fmtNum, marginColor } from '@/lib/index'
import { Plus, CheckCircle2, ClipboardList } from 'lucide-vue-next'

const SO_STEPS = ['Draft', 'Team Leader', 'Sales Manager', 'Division Head']
const PPN_PCT = 11

const createMode = ref<'new' | 'draft'>('new')
const submitted  = ref(false)
const selectedDraftId = ref('so5')
const addlDiscPct = ref(5)

const form = reactive({
  customerName: '', customerPO: '', planDate: '',
  warehouse: 'WH-Karawang', salesRep: 'Budi S.',
  deliveryMethod: 'Self-Pickup', paymentTerms: 'CBD', remarks: '',
})
const items = ref([
  { no: 1, type: 'Tire', brand: 'ASCENDO', description: 'ASC 10.00R20 AR102HD 18PR', qty: 10, unitPrice: 3200000, costPrice: 2712087, discPct: 0 },
  { no: 2, type: 'Tube', brand: 'ASCENDO', description: 'ASC 11.00-20 TR78 Heavy Duty',       qty: 10, unitPrice: 420000,  costPrice: 349740,  discPct: 0 },
  { no: 3, type: 'Flap', brand: 'ASCENDO', description: 'ASC 10.00/11.00R20(S) Metal Plate',  qty: 10, unitPrice: 95000,   costPrice: 72468,   discPct: 0 },
])

const draftOrders = computed(() => salesOrders.filter((s) => SO_STEPS.includes(s.approvalStatus)))
const draft       = computed(() => salesOrders.find((s) => s.id === selectedDraftId.value) ?? salesOrders[4]!)

const totalAmount = computed(() => items.value.reduce((s, i) => s + i.qty * i.unitPrice * (1 - i.discPct / 100), 0))
const totalQty    = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
const discounted  = computed(() => totalAmount.value * (1 - addlDiscPct.value / 100))
const withPPN     = computed(() => Math.round(discounted.value * (1 + PPN_PCT / 100)))
const truncation  = computed(() => withPPN.value % 1000)
const finalAmt    = computed(() => withPPN.value - truncation.value)

const productCatalog = products.map((p) => ({
  description: p.type1 === 'Tire'
    ? `${p.brand.slice(0, 3)} ${p.size} ${p.pattern} ${p.pr}PR`
    : p.type1 === 'Flap'
    ? `${p.brand.slice(0, 3)} ${p.size} ${p.type3}`
    : `${p.brand.slice(0, 3)} ${p.size} ${p.pattern} ${p.type3}`,
  type:      p.type1,
  brand:     p.brand,
  unitPrice: p.retailPriceIdr,
  costPrice: p.whPriceIdr,
}))

type Item = typeof items.value[0]
function addItem() {
  items.value.push({ no: items.value.length + 1, type: 'Tire', brand: 'ASCENDO', description: '', qty: 0, unitPrice: 0, costPrice: 0, discPct: 0 })
}
function onSelectDescription(item: Item, description: string) {
  const p = productCatalog.find((c) => c.description === description)
  if (!p) return
  item.type      = p.type
  item.brand     = p.brand
  item.unitPrice = p.unitPrice
  item.costPrice = p.costPrice
}
function itemNet(item: Item)       { return item.unitPrice * (1 - item.discPct / 100) }
function itemAmount(item: Item)    { return itemNet(item) * item.qty }
function itemMarginPct(item: Item) {
  const net = itemNet(item)
  return net > 0 ? ((net - item.costPrice) / net * 100).toFixed(1) : null
}


const inputCls  = 'w-full h-8 px-2 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring'
const cellInput = 'h-7 px-2 text-[11px] rounded border border-input bg-background'
</script>

<template>
  <Layout>
    <div class="p-6 space-y-4">
      <PageHeader title="Create SO" subtitle="Create a new sales order and request approval through the approval line" />

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
        <div class="grid grid-cols-2 gap-4">
          <!-- Mode Toggle -->
          <div class="bg-card rounded-xl border border-border p-4 flex flex-col gap-3">
            <div class="flex items-center gap-1 bg-muted/40 p-1 rounded-xl">
              <button @click="createMode = 'new'; submitted = false"
                class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-colors bg-card text-foreground shadow-sm">
                <ClipboardList class="w-4 h-4" />New SO
              </button>
              <button @click="createMode = 'draft'"
                class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                <ClipboardList class="w-4 h-4" />Draft Approvals ({{ draftOrders.length }})
              </button>
            </div>
            <div class="flex gap-2">
              <button @click="submitted = true" class="flex-1 h-9 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-1.5 transition-colors">
                <CheckCircle2 class="w-3.5 h-3.5" />Submit Approval
              </button>
              <button class="h-9 px-4 text-xs rounded-md border border-border hover:bg-muted transition-colors">Save Draft</button>
            </div>
          </div>
          <!-- Approval Progress -->
          <div class="bg-card rounded-xl border border-border p-4">
            <div class="flex items-center justify-between mb-4">
              <p class="text-sm font-semibold text-foreground">Approval Progress</p>
              <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono">ASM-SO-NEW</span>
            </div>
            <div class="overflow-x-auto pb-1">
              <ApprovalStepper :steps="SO_STEPS" current-step="Draft" />
            </div>
          </div>
        </div>

        <!-- I. Order Information -->
        <div class="bg-card rounded-xl border border-border p-4">
          <div class="flex items-center gap-2 mb-5">
            <div class="w-6 h-6 rounded bg-primary/20 flex items-center justify-center"><span class="text-xs font-bold text-primary">I</span></div>
            <p class="text-sm font-semibold text-foreground">Order Information</p>
          </div>
          <div class="grid grid-cols-3 gap-x-6 gap-y-4">
            <div class="space-y-1">
              <label class="text-[11px] text-muted-foreground font-medium">Customer Name *</label>
              <input v-model="form.customerName" :class="inputCls" />
            </div>
            <div class="space-y-1">
              <label class="text-[11px] text-muted-foreground font-medium">Customer PO No.</label>
              <input v-model="form.customerPO" :class="inputCls" />
            </div>
            <div class="space-y-1">
              <label class="text-[11px] text-muted-foreground font-medium">Sales Rep</label>
              <select v-model="form.salesRep" :class="inputCls">
                <option v-for="o in ['Budi S.','Ahmad R.','Sari W.','Dewi P.']" :key="o">{{ o }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-[11px] text-muted-foreground font-medium">Delivery Date *</label>
              <input type="date" v-model="form.planDate" :class="inputCls" />
            </div>
            <div class="space-y-1">
              <label class="text-[11px] text-muted-foreground font-medium">Origin WH</label>
              <select v-model="form.warehouse" :class="inputCls">
                <option v-for="o in ['WH-Surabaya','WH-Karawang','WH-Semarang']" :key="o">{{ o }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-[11px] text-muted-foreground font-medium">Delivery Method</label>
              <select v-model="form.deliveryMethod" :class="inputCls">
                <option v-for="o in ['Self-Pickup','Delivery-Support']" :key="o">{{ o }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-[11px] text-muted-foreground font-medium">Payment Terms</label>
              <select v-model="form.paymentTerms" :class="inputCls">
                <option v-for="o in ['CBD','TOP 15','TOP 30','TOP 45','TOP 60']" :key="o">{{ o }}</option>
              </select>
            </div>
            <div class="col-span-2 space-y-1">
              <label class="text-[11px] text-muted-foreground font-medium">Remarks</label>
              <input v-model="form.remarks" :class="inputCls" />
            </div>
          </div>
        </div>

        <!-- IV SO Items Table -->
        <div class="bg-card rounded-xl border border-border p-4">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded bg-primary/20 flex items-center justify-center"><span class="text-xs font-bold text-primary">IV</span></div>
              <p class="text-sm font-semibold text-foreground">SO Items</p>
            </div>
            <button @click="addItem" class="flex items-center gap-1 h-7 px-2 text-xs rounded-md border border-border hover:bg-muted transition-colors">
              <Plus class="w-3 h-3" />Add Line
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-border bg-muted/20">
                  <th v-for="h in ['No.','Type','Brand','Item Description','Qty','Unit Price','Discount','Net Price','Amount','Margin']"
                    :key="h" :class="['px-2 py-2 text-muted-foreground font-medium',
                      ['Net Price','Amount','Margin'].includes(h) ? 'text-right' :
                      ['Item Description','Qty','Unit Price','Discount'].includes(h) ? 'text-center' :
                      'text-left']">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in items" :key="idx" class="border-b border-border/50 hover:bg-muted/10">
                  <td class="px-2 py-1.5 text-muted-foreground">{{ item.no }}</td>
                  <td class="px-2 py-1.5 text-foreground">{{ item.type }}</td>
                  <td class="px-2 py-1.5 text-foreground">{{ item.brand }}</td>
                  <td class="px-2 py-1.5">
                    <select
                      v-model="item.description"
                      @change="onSelectDescription(item, item.description)"
                      :class="`${cellInput} w-44 text-foreground appearance-none`"
                    >
                      <option value="" disabled>Select product...</option>
                      <option v-for="p in productCatalog" :key="p.description" :value="p.description">{{ p.description }}</option>
                    </select>
                  </td>
                  <td class="px-2 py-1.5">
                    <input type="number" v-model.number="item.qty" :class="`${cellInput} w-16 text-right font-mono`" />
                  </td>
                  <td class="px-2 py-1.5">
                    <input
                      type="text" inputmode="numeric"
                      :value="item.unitPrice ? fmtNum(item.unitPrice) : ''"
                      @focus="($event.target as HTMLInputElement).value = item.unitPrice ? String(item.unitPrice) : ''"
                      @blur="item.unitPrice = +($event.target as HTMLInputElement).value.replace(/,/g, '') || 0; ($event.target as HTMLInputElement).value = item.unitPrice ? fmtNum(item.unitPrice) : ''"
                      :class="`${cellInput} w-28 text-right font-mono`"
                    />
                  </td>
                  <td class="px-2 py-1.5">
                    <input type="number" v-model.number="item.discPct" :class="`${cellInput} w-14 text-right font-mono`" />
                    <span class="text-[11px] text-muted-foreground">%</span>
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
                  <td colspan="2" class="px-2 py-2 text-right font-mono text-xs font-bold text-foreground">{{ fmtNum(Math.round(totalAmount)) }}</td>
                  <td />
                </tr>
                <tr class="border-t border-border bg-muted/10">
                  <td colspan="6" class="px-2 py-2 text-xs font-medium text-muted-foreground">Additional Discount</td>
                  <td class="px-2 py-2">
                    <div class="flex items-center justify-end gap-1">
                      <input type="number" v-model.number="addlDiscPct" min="0" max="100" :class="`${cellInput} w-14 text-right font-mono`" />
                      <span class="text-[11px] text-muted-foreground">%</span>
                    </div>
                  </td>
                  <td />
                  <td class="px-2 py-2 text-right font-mono text-xs text-destructive">{{ addlDiscPct > 0 ? `−${fmtNum(Math.round(totalAmount * addlDiscPct / 100))}` : '—' }}</td>
                  <td />
                </tr>
                <tr class="border-t border-border bg-muted/10">
                  <td colspan="6" class="px-2 py-2 text-xs font-medium text-muted-foreground">PPN (Tax)</td>
                  <td class="px-2 py-2 text-right font-mono text-[11px] text-muted-foreground">{{ PPN_PCT }}%</td>
                  <td />
                  <td class="px-2 py-2 text-right font-mono text-xs text-foreground">{{ fmtNum(withPPN - Math.round(discounted)) }}</td>
                  <td />
                </tr>
                <tr class="border-t border-border bg-muted/10">
                  <td colspan="8" class="px-2 py-2 text-xs font-medium text-muted-foreground">Truncation (1,000↓)</td>
                  <td class="px-2 py-2 text-right font-mono text-xs text-destructive">{{ truncation > 0 ? `−${fmtNum(truncation)}` : '—' }}</td>
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
        <!-- Row 1: 3-column — Mode Toggle | Draft Cards | Approval Status -->
        <div class="grid grid-cols-3 gap-4 items-stretch">
          <!-- Col 1: Mode Toggle -->
          <div class="bg-card rounded-xl border border-border p-4 flex items-center">
            <div class="flex items-center gap-1 bg-muted/40 p-1 rounded-xl w-full">
              <button @click="createMode = 'new'; submitted = false"
                class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                <ClipboardList class="w-4 h-4" />New SO
              </button>
              <button @click="createMode = 'draft'"
                class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-colors bg-card text-foreground shadow-sm">
                <ClipboardList class="w-4 h-4" />Draft Approvals ({{ draftOrders.length }})
              </button>
            </div>
          </div>
          <!-- Col 2: Draft Order Cards -->
          <div class="flex flex-col gap-3">
            <button v-for="so in draftOrders" :key="so.id" @click="selectedDraftId = so.id"
              :class="['flex-1 text-left bg-card border rounded-xl p-3 transition-all hover:shadow-md', selectedDraftId === so.id ? 'border-primary ring-1 ring-primary' : 'border-border']">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-mono font-semibold text-foreground">{{ so.soNo }}</span>
                <span :class="`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${deliveryStatusColor[so.deliveryStatus]}`">{{ so.approvalStatus }}</span>
              </div>
              <p class="text-[11px] text-muted-foreground truncate">{{ so.customerName }}</p>
              <p class="text-xs font-mono font-bold text-primary mt-1">{{ fmtIDRCompact(so.totalAmount) }}</p>
            </button>
          </div>
          <!-- Col 3: Approval Status -->
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-sm font-semibold text-foreground mb-3">Approval Status — {{ draft.soNo }}</p>
            <div class="overflow-x-auto pb-1">
              <ApprovalStepper :steps="SO_STEPS" :current-step="draft.approvalStatus" />
            </div>
          </div>
        </div>

        <!-- Row 2: Customer Info + Credit Limit -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-xs font-semibold text-foreground mb-3">Customer Info</p>
            <div class="space-y-2 text-xs">
              <div v-for="r in [
                {label:'Customer Name', value:draft.customerName},
                {label:'Order Date',    value:draft.soDate},
                {label:'Est. Delivery', value:draft.planDeliveryDate},
                {label:'Payment Terms', value:draft.paymentTerms},
                {label:'Sales Rep',     value:draft.salesRep},
              ]" :key="r.label" class="flex gap-2">
                <span class="text-muted-foreground w-24 shrink-0">{{ r.label }}</span>
                <span class="font-medium text-foreground truncate">{{ r.value }}</span>
              </div>
            </div>
          </div>
          <div class="bg-card rounded-xl border border-border p-4">
            <p class="text-xs font-semibold text-foreground mb-3">Credit Limit Status</p>
            <div class="space-y-3">
              <div class="flex justify-between text-xs">
                <span class="text-muted-foreground">Credit Available</span>
                <span class="font-mono font-semibold">{{ fmtIDR(draft.creditBalance) }}</span>
              </div>
              <div class="h-2.5 bg-muted rounded-full overflow-hidden">
                <div :class="['h-full rounded-full', (draft.creditBalance / draft.creditLimit) > 0.3 ? 'bg-chart-1' : 'bg-destructive']"
                     :style="{ width: `${(draft.creditBalance / draft.creditLimit) * 100}%` }" />
              </div>
              <div class="flex justify-between text-[10px] text-muted-foreground">
                <span>Used: {{ fmtIDR(draft.creditLimit - draft.creditBalance) }}</span>
                <span>Limit: {{ fmtIDR(draft.creditLimit) }}</span>
              </div>
              <div class="flex gap-2 pt-1">
                <button class="flex-1 h-7 text-xs rounded-md bg-chart-1 text-white flex items-center justify-center gap-1">
                  <CheckCircle2 class="w-3 h-3" />Approve
                </button>
                <button class="h-7 px-3 text-xs rounded-md border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors">Reject</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </Layout>
</template>
