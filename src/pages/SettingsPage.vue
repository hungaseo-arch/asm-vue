<script setup lang="ts">
import { ref } from 'vue'
import Layout from '@/components/Layout.vue'
import PageHeader from '@/components/PageHeader.vue'
import { Settings, User, Bell, Shield, Database, Globe, ChevronRight, Check } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { fmtNum } from '@/lib/index'

type SettingsSection = 'profile' | 'company' | 'notifications' | 'approval' | 'currency' | 'system'

// React: useState<SettingsSection>('profile') → Vue: ref<SettingsSection>('profile')
const activeSection = ref<SettingsSection>('profile')
const saved = ref(false)
// FX Rate 슬라이더 상태 — React: useState(16250) → Vue: ref(16250)
const fxRate = ref(16250)

const sections = [
  { key: 'profile'       as SettingsSection, label: 'My Account',        icon: User },
  { key: 'company'       as SettingsSection, label: 'Company Info',      icon: Globe },
  { key: 'notifications' as SettingsSection, label: 'Notifications',     icon: Bell },
  { key: 'approval'      as SettingsSection, label: 'Approval Workflow', icon: Shield },
  { key: 'currency'      as SettingsSection, label: 'FX Rate & Pricing', icon: Database },
  { key: 'system'        as SettingsSection, label: 'System Settings',   icon: Settings },
]

const profileFields = [
  { l: 'Username',   v: 'JH SEO',       type: 'text' },
  { l: 'Email',      v: 'jhseo@ptascendo.com', type: 'email' },
  { l: 'Position',   v: 'General Manager',       type: 'text' },
  { l: 'Department', v: 'Sales Division',      type: 'text' },
  { l: 'Phone',      v: '+62 811-155-372',   type: 'tel' },
  { l: 'Warehouse',  v: 'WH-Karawang',         type: 'text' },
]

const companyFields = [
  { l: 'Company Name', v: 'PT. ASCENDO INTERNATIONAL' },
  { l: 'Tax ID',       v: '0315628396031000' },
  { l: 'Address',      v: 'JL PALMERAH BARAT NO.8 D/H 42, RT 002, RW 003, GROGOL UTARA, KEBAYORAN LAMA, KOTA ADM. JAKARTA SELATAN, DKI JAKARTA 12210' },
  { l: 'CEO',          v: 'Kim Jai Hun' },
  { l: 'Phone',        v: '+62 21-530-6869' },
  { l: 'Website',      v: 'www.ascendotyre.com/id' },
  { l: 'Fiscal Year',  v: '2025-01-01 ~ 2025-12-31' },
  { l: 'Base Currency',v: 'IDR (Indonesian Rupiah)' },
]

const notifications = [
  { l: 'Alert when credit limit exceeds 90%',          checked: true },
  { l: 'Alert when stock falls below minimum',          checked: true },
  { l: 'Alert on PO pending approval',                  checked: true },
  { l: 'Immediate alert on inbound NG',                 checked: true },
  { l: 'Delivery delay warning (D-3 before due date)',  checked: true },
  { l: 'Alert on FX rate fluctuation ±3%',              checked: false },
  { l: 'Alert on SO with margin below 10%',             checked: false },
  { l: 'Monthly report auto-generation alert',          checked: true },
]

const soSteps = [
  '1. Draft (Sales Rep)', '2. Team Leader Review',
  '3. Sales Manager Approval', '4. Finance Manager Approval', '5. COO Final Approval',
]
const poSteps = [
  '1. Draft (Procurement Rep)', '2. Team Leader Review',
  '3. Purchase Manager Approval', '4. Finance Manager Approval', '5. COO Final Approval',
]

const pricingFields = [
  { l: 'Pricing Basis',        v: 'WH Price (CIF + Duty + Local Cost)' },
  { l: 'Retail Margin Basis',  v: 'WH Price × 1.25 (min 25%)' },
  { l: 'Wholesale Margin',     v: 'WH Price × 1.18 (min 18%)' },
  { l: 'Min Margin Warning',   v: 'Alert below 10%' },
  { l: 'FX Rate Update',       v: 'Auto-applied every Monday' },
  { l: 'Margin Warning Level', v: 'Yellow alert below 20%' },
]

const systemFields = [
  { l: 'System Language', v: 'Korean / Bahasa Indonesia' },
  { l: 'Date Format',     v: 'YYYY-MM-DD' },
  { l: 'Number Format',   v: 'IDR (Indonesian Rupiah)' },
  { l: 'Timezone',        v: 'WIB (GMT+7, Jakarta)' },
  { l: 'Session Timeout', v: '30 min' },
  { l: 'Version',         v: 'ASM-ERP v2.1.0' },
]

// React: const save = () => { setSaved(true); setTimeout(…) }
// Vue: 동일한 패턴, ref.value 사용
function save() {
  saved.value = true
  setTimeout(() => { saved.value = false }, 2000)
}

const inputClass = 'w-full h-9 px-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring text-foreground'
</script>

<template>
  <Layout>
    <div class="p-6 space-y-5">
      <PageHeader title="Settings" subtitle="Account · Company Info · Approval Workflow · FX Rate Settings" />

      <div class="grid grid-cols-5 gap-5">
        <!-- Sidebar Menu -->
        <div class="col-span-1 bg-card rounded-xl border border-border overflow-hidden">
          <button
            v-for="s in sections"
            :key="s.key"
            @click="activeSection = s.key"
            :class="cn(
              'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-b border-border/50 last:border-0',
              activeSection === s.key
                ? 'bg-primary/5 text-primary border-l-2 border-l-primary'
                : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
            )"
          >
            <component :is="s.icon" class="w-4 h-4" />
            <span class="font-medium">{{ s.label }}</span>
          </button>
        </div>

        <!-- Content Panel -->
        <div class="col-span-4 bg-card rounded-xl border border-border p-6">

          <!-- Profile — v-if 조건부 렌더링 -->
          <div v-if="activeSection === 'profile'" class="space-y-4">
            <h3 class="font-semibold text-foreground">My Account Info</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div v-for="f in profileFields" :key="f.l" class="space-y-1.5">
                <label class="text-xs text-muted-foreground">{{ f.l }}</label>
                <input :type="f.type" :value="f.v" :class="inputClass" />
              </div>
            </div>
            <button @click="save"
              class="flex items-center gap-2 h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Check v-if="saved" class="w-3.5 h-3.5" />
              {{ saved ? 'Saved' : 'Save Changes' }}
            </button>
          </div>

          <!-- Company -->
          <div v-else-if="activeSection === 'company'" class="space-y-4">
            <h3 class="font-semibold text-foreground">Company Info</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div v-for="f in companyFields" :key="f.l" class="space-y-1.5">
                <label class="text-xs text-muted-foreground">{{ f.l }}</label>
                <input type="text" :value="f.v" :class="inputClass" />
              </div>
            </div>
            <button @click="save"
              class="flex items-center gap-2 h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Check v-if="saved" class="w-3.5 h-3.5" />
              {{ saved ? 'Saved' : 'Save Changes' }}
            </button>
          </div>

          <!-- Notifications -->
          <div v-else-if="activeSection === 'notifications'" class="space-y-4">
            <h3 class="font-semibold text-foreground">Notifications</h3>
            <div class="space-y-3">
              <label v-for="(n, i) in notifications" :key="i"
                class="flex items-center justify-between cursor-pointer p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors">
                <span class="text-sm text-foreground">{{ n.l }}</span>
                <input type="checkbox" :checked="n.checked" class="w-4 h-4 accent-primary" />
              </label>
            </div>
            <button @click="save"
              class="flex items-center gap-2 h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Check v-if="saved" class="w-3.5 h-3.5" />
              {{ saved ? 'Saved' : 'Save' }}
            </button>
          </div>

          <!-- Approval Workflow -->
          <div v-else-if="activeSection === 'approval'" class="space-y-4">
            <h3 class="font-semibold text-foreground">Approval Workflow Settings</h3>
            <div class="space-y-3">
              <div class="bg-muted/30 rounded-lg p-4">
                <p class="text-xs font-semibold text-foreground mb-3">SO Approval Path (5 Steps)</p>
                <div v-for="(step, i) in soSteps" :key="i"
                  class="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                  <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span class="text-xs text-primary font-bold">{{ i + 1 }}</span>
                  </div>
                  <span class="text-sm text-foreground">{{ step }}</span>
                  <ChevronRight class="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                </div>
              </div>
              <div class="bg-muted/30 rounded-lg p-4">
                <p class="text-xs font-semibold text-foreground mb-3">PO Approval Path (5 Steps)</p>
                <div v-for="(step, i) in poSteps" :key="i"
                  class="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                  <div class="w-6 h-6 rounded-full bg-chart-2/20 flex items-center justify-center shrink-0">
                    <span class="text-xs text-chart-2 font-bold">{{ i + 1 }}</span>
                  </div>
                  <span class="text-sm text-foreground">{{ step }}</span>
                </div>
              </div>
              <p class="text-xs text-muted-foreground bg-muted/20 rounded-lg p-3">
                * Mobile approval supported: COO & Manager level can approve via mobile (including urgent approvals)
              </p>
            </div>
          </div>

          <!-- FX Rate & Pricing — range input 양방향 바인딩: v-model -->
          <div v-else-if="activeSection === 'currency'" class="space-y-4">
            <h3 class="font-semibold text-foreground">FX Rate & Pricing</h3>
            <div class="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p class="text-xs font-semibold text-foreground mb-3">Current USD/IDR Exchange Rate</p>
              <div class="flex items-center gap-4">
                <div class="flex-1">
                  <!-- v-model — React: onChange={e=>setFxRate(+e.target.value)} -->
                  <input type="range" min="15000" max="17500" step="50" v-model.number="fxRate"
                    class="w-full accent-primary" />
                  <div class="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>Rp 15,000</span><span>Rp 17,500</span>
                  </div>
                </div>
                <div class="text-center min-w-20">
                  <p class="text-2xl font-bold font-mono text-primary">{{ fmtNum(fxRate) }}</p>
                  <p class="text-[10px] text-muted-foreground">IDR/USD</p>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div v-for="f in pricingFields" :key="f.l" class="space-y-1.5">
                <label class="text-xs text-muted-foreground">{{ f.l }}</label>
                <input type="text" :value="f.v" :class="inputClass" />
              </div>
            </div>
            <button @click="save"
              class="flex items-center gap-2 h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Check v-if="saved" class="w-3.5 h-3.5" />
              {{ saved ? 'Saved' : 'Save FX & Pricing Policy' }}
            </button>
          </div>

          <!-- System Settings -->
          <div v-else class="space-y-4">
            <h3 class="font-semibold text-foreground">System Settings</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div v-for="f in systemFields" :key="f.l" class="space-y-1.5">
                <label class="text-xs text-muted-foreground">{{ f.l }}</label>
                <input type="text" :value="f.v" :class="inputClass" />
              </div>
            </div>
            <button @click="save"
              class="flex items-center gap-2 h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Check v-if="saved" class="w-3.5 h-3.5" />
              {{ saved ? 'Saved' : 'Save' }}
            </button>
          </div>

        </div>
      </div>
    </div>
  </Layout>
</template>
