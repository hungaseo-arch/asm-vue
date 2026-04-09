import { ref, computed } from 'vue'

export function useTableFilter<T>(
  data: T[],
  filterFn: (item: T, query: string) => boolean,
) {
  const query = ref('')

  const filtered = computed(() =>
    query.value.trim()
      ? data.filter((item) => filterFn(item, query.value.toLowerCase()))
      : data,
  )

  return { query, filtered }
}
