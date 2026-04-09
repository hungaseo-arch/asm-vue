<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import type { Component } from 'vue'

interface Props {
  title: string
  value: string | number
  sub?: string
  trend?: number
  icon: Component
  iconBg?: string
  mono?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  iconBg: 'bg-primary/10',
})

const trendColor = computed(() => {
  if (props.trend === undefined) return ''
  if (props.trend > 0) return 'text-chart-1'
  if (props.trend < 0) return 'text-destructive'
  return 'text-muted-foreground'
})
</script>

<template>
  <div class="bg-card rounded-xl border border-border p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <p class="text-xs text-muted-foreground font-medium">{{ title }}</p>
      <div :class="cn('w-8 h-8 rounded-lg flex items-center justify-center', iconBg)">
        <component :is="icon" class="w-4 h-4" />
      </div>
    </div>
    <div>
      <p :class="cn('text-2xl font-bold text-foreground', mono && 'font-mono')">{{ value }}</p>
      <p v-if="sub" class="text-xs text-muted-foreground mt-0.5">{{ sub }}</p>
    </div>
    <!-- v-if 조건부 렌더링 — React: {trend !== undefined && (...)} -->
    <div v-if="trend !== undefined" class="flex items-center gap-1 text-xs">
      <!-- v-if/v-else-if/v-else — React: 중첩 삼항 연산자 대체 -->
      <TrendingUp v-if="trend > 0" class="w-3.5 h-3.5 text-chart-1" />
      <TrendingDown v-else-if="trend < 0" class="w-3.5 h-3.5 text-destructive" />
      <Minus v-else class="w-3.5 h-3.5 text-muted-foreground" />
      <span :class="cn('font-medium', trendColor)">
        {{ trend > 0 ? '+' : '' }}{{ trend }}% vs prev. month
      </span>
    </div>
  </div>
</template>
