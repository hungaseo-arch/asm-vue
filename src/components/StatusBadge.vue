<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  label: string
  colorClass: string
}
defineProps<Props>()
</script>

<template>
  <span :class="cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', colorClass)">
    {{ label }}
  </span>
</template>
