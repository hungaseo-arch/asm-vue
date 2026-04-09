import { ref, onMounted, onUnmounted } from 'vue'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const isMobile = ref(false)
  let mql: MediaQueryList | null = null

  const check = () => {
    isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
  }

  onMounted(() => {
    mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener('change', check)
    check()
  })

  onUnmounted(() => {
    mql?.removeEventListener('change', check)
  })

  return { isMobile }
}
