import {ref} from 'vue'
import {showToast} from '@/components/shared/toaster/toast.js'

export function useValidateInput () {
  const isInvalid = ref(false)

  function validate ({
   value,
   required,
   callbackValidator,
  }) {
    if (required && (!value && value !== 0)) {
      isInvalid.value = true
      showToast('Заполните обязательные поля', {type: 'error'})
      return
    }

    const isCustomValid = callbackValidator(value)
    if (!isCustomValid) {
      isInvalid.value = true
      return
    }

    isInvalid.value = false
  }

  function setIsInvalidTo (value) {
    isInvalid.value = value
  }

  return {
    isInvalid,
    validate,
    setIsInvalidTo,
  }
}
