import { ref } from 'vue'

const toasts = ref([])

let id = 0

function showToast(message, { type = 'success', duration } = {}) {
  ++id;
  const toast = { id, message, type, createdAt: Date.now() }
  toasts.value.push(toast)
  if (duration > 0) {
    setTimeout(() => removeToast(id), duration)
  }
  return id
}

function removeToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

export {
  toasts,
  showToast,
  removeToast,
}
