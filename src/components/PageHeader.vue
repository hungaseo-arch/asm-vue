<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}
defineProps<Props>()
</script>

<template>
  <div class="flex items-start justify-between">
    <div>
      <h1 class="text-xl font-bold text-foreground">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm text-muted-foreground mt-0.5 px-3">{{ subtitle }}</p>
    </div>
    <!-- named slot — React: actions prop (ReactNode) → Vue: <slot name="actions" /> -->
    <div v-if="$slots.actions" class="flex items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
