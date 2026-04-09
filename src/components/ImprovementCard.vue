<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  category: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  badge: string
}

const props = defineProps<Props>()

const priorityStyle: Record<string, string> = {
  high:   'border-l-destructive bg-destructive/5',
  medium: 'border-l-chart-3 bg-chart-3/5',
  low:    'border-l-chart-2 bg-chart-2/5',
}
const badgeStyle: Record<string, string> = {
  high:   'bg-destructive/20 text-destructive',
  medium: 'bg-chart-3/20 text-chart-3',
  low:    'bg-chart-2/20 text-chart-2',
}

const cardClass = computed(() => cn('border-l-4 rounded-r-lg p-3', priorityStyle[props.priority]))
const badgeClass = computed(() => cn('text-[10px] px-1.5 py-0.5 rounded font-medium', badgeStyle[props.priority]))
</script>

<template>
  <div :class="cardClass">
    <div class="flex items-center gap-2 mb-1">
      <span class="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{{ category }}</span>
      <span :class="badgeClass">{{ badge }}</span>
    </div>
    <p class="text-sm font-semibold text-foreground">{{ title }}</p>
    <p class="text-xs text-muted-foreground mt-0.5 leading-relaxed">{{ description }}</p>
  </div>
</template>
