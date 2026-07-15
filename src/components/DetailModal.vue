<script setup lang="ts">
// 공용 상세 모달 래퍼 — 배경 클릭 또는 close 이벤트로 닫음
withDefaults(defineProps<{ open: boolean; widthClass?: string }>(), {
  widthClass: 'max-w-lg',
})
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <div v-if="open"
    class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    @click.self="emit('close')">
    <div :class="['w-full max-h-[85vh] overflow-y-auto space-y-4', widthClass]">
      <slot />
    </div>
  </div>
</template>
