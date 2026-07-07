import { ref } from 'vue'

export interface ToastItem {
  id: number
  message: string
}

const toasts = ref<ToastItem[]>([])
let nextId = 0

export function showToast(message: string) {
  const id = nextId++
  toasts.value = [...toasts.value, { id, message }]
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, 1000)
}

export function useToast() {
  return { toasts, show: showToast }
}
