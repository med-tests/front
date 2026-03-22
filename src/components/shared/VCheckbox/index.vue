<script setup>
import {watch} from 'vue'
import {useValidateInput} from '@/composables/useValidateInput.js'

const {
  label,
  required,
  id,
  touchId,
  callbackValidator,
} = defineProps({
  label: { type: String, default: '' },
  required: { type: Boolean, default: false },
  id: { type: String, required: true },
  touchId: { type: String, default: '' },
  // true = все ок
  callbackValidator: { type: Function, default: () => true },
})

const emit = defineEmits(['onValidate'])

const model = defineModel({
  type: Number,
  validator(value) {
    return value === 0 || value === 1
  },
})


const { isInvalid, validate, setIsInvalidTo } = useValidateInput()

watch(
    () => touchId,
    () => {
      validate({
        value: !!model.value,
        required,
        callbackValidator,
      })
    },
)

watch(
    isInvalid,
    () => {
      emit('onValidate', isInvalid.value)
    },
)

watch(
    model,
    () => {
      if (isInvalid.value) {
        setIsInvalidTo(false)
      }
    },
)

</script>

<template>
  <div>
    <label
      v-if="label"
      class="block mb-1 text-gray-700"
      :class="{'required': required }"
      :for="id"
    >
      {{ label }}
    </label>

    <div class="flex">
      <input
        :id
        v-model="model"
        style="width: 16px;"
        type="checkbox"
        :class="{
          'border-red-300': isInvalid
        }"
        :false-value="0"
        :true-value="1"
      >
      <div
        class="px-1"
        :class="{'required': required }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.required::after {
  content: '*';
  color: red;
}
</style>
