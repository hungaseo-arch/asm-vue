import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const fxRate = ref(17_580)
  const fxRateChange = ref(+0.46)
  const notificationCount = ref(3)

  function updateFxRate(rate: number) {
    fxRate.value = rate
  }

  return { fxRate, fxRateChange, notificationCount, updateFxRate }
})
