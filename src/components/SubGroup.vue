<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { ChevronDown, ChevronRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import type { Component } from 'vue'

interface MenuItem {
  label: string
  path: string
  icon: Component
}

interface Props {
  label: string
  icon: Component
  isActive: boolean
  open: boolean
  items: MenuItem[]
  badge?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const route = useRoute()

function toggle() {
  emit('update:open', !props.open)
}
</script>

<template>
  <div class="pt-1">
    <button
      @click="toggle"
      :class="cn(
        'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
        isActive
          ? 'bg-sidebar-primary/20 text-sidebar-primary font-medium'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
      )"
    >
      <component :is="icon" class="w-4 h-4 shrink-0" />
      <span class="flex-1 text-left">{{ label }}</span>
      <span
        v-if="badge"
        class="bg-sidebar-primary/30 text-sidebar-primary text-[10px] px-1.5 py-0 h-4 inline-flex items-center rounded-full"
      >{{ badge }}</span>
      <ChevronDown v-if="open" class="w-3.5 h-3.5" />
      <ChevronRight v-else class="w-3.5 h-3.5" />
    </button>

    <div v-if="open" class="ml-3 mt-0.5 border-l border-sidebar-border pl-2.5 space-y-0.5">
      <RouterLink
        v-for="item in items"
        :key="item.path"
        :to="item.path"
        :class="cn(
          'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors',
          route.path === item.path
            ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
            : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
        )"
      >
        <component :is="item.icon" class="w-3.5 h-3.5 shrink-0" />
        {{ item.label }}
      </RouterLink>
    </div>
  </div>
</template>
