<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  steps: string[]
  currentStep: string
  rejected?: boolean
}

const props = defineProps<Props>()

const currentIdx = computed(() => props.steps.indexOf(props.currentStep))

function stepClass(idx: number) {
  const isCompleted = idx < currentIdx.value
  const isCurrent = idx === currentIdx.value
  const isConfirmed = props.currentStep === 'Confirmed'

  if (isCompleted || (isCurrent && isConfirmed))
    return 'bg-chart-1 border-chart-1 text-white'
  if (isCurrent && props.rejected)
    return 'bg-destructive border-destructive text-white'
  if (isCurrent)
    return 'bg-chart-3 border-chart-3 text-white'
  return 'bg-muted border-border text-muted-foreground'
}

function labelClass(idx: number) {
  const isCompleted = idx < currentIdx.value
  const isCurrent = idx === currentIdx.value
  const isConfirmed = props.currentStep === 'Confirmed'

  if (isCompleted || (isCurrent && isConfirmed)) return 'text-chart-1 font-medium'
  if (isCurrent) return 'text-chart-3 font-medium'
  return 'text-muted-foreground'
}

function stepLabel(idx: number) {
  const isCompleted = idx < currentIdx.value
  const isCurrent = idx === currentIdx.value
  const isConfirmed = props.currentStep === 'Confirmed'
  return isCompleted || (isCurrent && isConfirmed) ? '✓' : String(idx + 1)
}
</script>

<template>
  <div class="flex items-center gap-0">
    <!-- v-for 리스트 렌더링 — React: steps.map((step, idx) => ...) -->
    <div v-for="(step, idx) in steps" :key="step" class="flex items-center">
      <div class="flex flex-col items-center gap-1">
        <div
          :class="cn('w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors', stepClass(idx))"
        >
          {{ stepLabel(idx) }}
        </div>
        <p :class="cn('text-[9px] text-center leading-tight max-w-13', labelClass(idx))">
          {{ step }}
        </p>
      </div>
      <!-- v-if 조건부 — React: {!isLast && <div />} -->
      <div
        v-if="idx < steps.length - 1"
        :class="cn('w-8 h-0.5 mb-4', idx < currentIdx ? 'bg-chart-1' : 'bg-border')"
      />
    </div>
  </div>
</template>
