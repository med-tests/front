import { ref } from 'vue'

const toasts = ref([])

function showToast(message, { type = 'success', duration = 4000 } = {}) {
  const id = toasts.value.length + 1
  const toast = { id, message, type }
  toasts.value.push(toast)
  if (duration > 0) {
    setTimeout(() => removeToast(id), duration)
  }
}

function removeToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

export {
  toasts,
  showToast,
  removeToast,
}
