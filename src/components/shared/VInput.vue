<template>
  <div>
    <label
      v-if="label"
      class="block mb-1 text-gray-700"
      :for="id"
    >
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="id"
        class="border border-color-gray-700 rounded-xs p-2 text-gray-700 text-lg"
        :name="id"
        :placeholder="placeholder"
        :readonly="readonly"
        :type="computedType"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      >
      <div
        v-if="type === 'password'"
        class="absolute "
        style="width: 24px; height: 24px; top: 50%; transform: translate(0, -50%); right: 5px;}"
      >
        <EyeIcon
          v-if="passwordHidden"
          class="ml-auto cursor-pointer fill-gray-600 hover:fill-gray-900"
          title="Показать"
          @click="passwordHidden = !passwordHidden"
        />
        <EyeClosedIcon
          v-else
          class="ml-auto cursor-pointer fill-gray-600 hover:fill-gray-900"
          title="Скрыть"
          @click="passwordHidden = !passwordHidden"
        />
      </div>
      <CloseIcon
        v-if="type !== 'password' && showCloseIcon"
        class="absolute cursor-pointer"
        style="width: 24px; height: 24px; top: 50%; transform: translate(0, -50%); right: 5px;}"
        @click="$emit('onClickCloseIcon')"
      />
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import EyeClosedIcon from '@/components/icons/EyeClosedIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: ''},
  label: { type: String, default: '' },
  id: { type: String, required: true },
  placeholder: { type: String, default: '' },
  readonly: { type: Boolean, default: false },
  type: { type: String, default: 'text' },
  showCloseIcon: { type: Boolean, default: true },
})

defineEmits(['update:modelValue', 'onClickCloseIcon'])

const passwordHidden = ref(true)

const computedType = computed(() => {
  if (props.type === 'password') {
    return passwordHidden.value ? 'password' : 'text'
  }
  return props.type
})
</script>
