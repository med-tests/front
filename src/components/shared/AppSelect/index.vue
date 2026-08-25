<template>
  <div 
    v-click-outside="() => showList = false"
    class="relative"
  >
    <div 
      class="p-2 border rounded-xs flex justify-between items-center"
      data-test="select-trigger-label"
      :class="{
        'border-emerald-800': !disabled && !isInvalid,
        'cursor-pointer': !disabled,
        'rounded-b-none': showList,
        'border-b-0': showList && isSearch,
        [disabledBgClass]: disabled,
        [disabledBorderClass]: disabled && !isInvalid,
        [invalidBorderClass]: isInvalid
      }"
      @click="toggleList"
    >
      <div
        v-if="!selected"
        class="text-gray-500 text-base"
      >
        Не выбрано
      </div>
      <div
        v-else
        class="text-gray-700 text-base"
      >
        {{ selected.label }}
      </div>
      <ChevronIcon
        v-if="!disabled"
        class="stroke-gray-600 hover:stroke-gray-900"
        data-test="select-trigger-icon"
        :class="{
          'rotate-x-180': showList
        }"
      />
    </div>

    <div
      v-if="showList && !disabled"
      class="overflow-hidden z-1 bg-white absolute top-[100%] left-0 w-full border border-t-0 rounded-xs"
      data-test="select-list-wrap"
      :class="{
        'border-t-0 rounded-t-none': showList,
        'border-emerald-800': !isInvalid,
        [invalidBorderClass]: isInvalid,
      }"
    >
      <AppTextInput
        v-if="isSearch"
        v-bind="inputSettings"
        v-model="searchText"
        class="mx-1 mt-1"
        data-test="select-search"
      />
      <ul
        v-if="filteredList.length"
        class="overflow-y-auto max-h-[160px]"
        data-test="select-list"
      >
        <li
          v-if="isAllowEmpty"
          class="p-2 text-gray-700 text-base cursor-pointer item-hover"
          data-test="not-select-list-item"
          :class="{
            'bg-emerald-400/15 hover:bg-emerald-400/15': selected === null
          }"
          @click="onClickItem(null)"
        >
          Не выбрано
        </li>
        <li
          v-for="item in filteredList"
          :key="item.value"
          class="p-2 text-gray-700 text-base cursor-pointer item-hover"
          data-test="select-list-item"
          :class="{
            'bg-emerald-400/15 hover:bg-emerald-400/15': item.value === selected?.value
          }"
          @click="onClickItem(item)"
        >
          {{ item.label }}
        </li>
      </ul>
      <div
        v-else
        class="p-2 text-gray-700 text-base"
        data-test="select-nothing-found"
      >
        Ничего не найдено
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppTextInput from '@/components/shared/inputs/AppTextInput'
import { input as inputClasses } from '@/assets/vars.js'
import ChevronIcon from '@/components/icons/ChevronIcon.vue'

const {
  invalidBorderClass,
  disabledBorderClass,
  disabledBgClass,
} = inputClasses

const {
  list,
  disabled,
  modelValue,
} = defineProps({
  modelValue: { type: [String, Number, null], default: null },
  list: {
    type: Array,
    default: () => ([]),
    validator(value) {
      return value.every(item => Object.hasOwn(item, 'label') && Object.hasOwn(item, 'value'))
    },
  },
  disabled: { type: Boolean, default: false },
  isInvalid: { type: Boolean, default: false },
  isSearch: { type: Boolean, default: false },
  isAllowEmpty: { type: Boolean, default: false },
  inputSettings: {
    type: Object,
    default: () => ({
      placeholder: 'Найти',
    }),
    validator(value) {
      const fieldList = ['placeholder', 'hideCloseIcon']
      return Object.keys(value).every(key => fieldList.includes(key))
    },
  },
})

const emit = defineEmits(['update:modelValue']) // value || null 

const selected = ref(null) // { label: '', value: } || null

watch(
    () => modelValue,
    (newModelValue) => {
      if (newModelValue === null) {
        selected.value = null
      }

      const listItem = list.find(({ value }) => value === newModelValue)
      if (listItem) {
        selected.value = listItem
      }
      else {
        selected.value = null
      }
    },
    { immediate: true },
)

const searchText = ref('')
const filteredList = ref(list)
watch(
    () => list,
    (newList) => {
      filteredList.value = newList
    },
)

watch(
    searchText,
    (newSearchText) => {
      if(!newSearchText.trim().length) {
        filteredList.value = list
        return
      }
      filteredList.value = list.filter(({ label }) => label.toLowerCase().includes(newSearchText.toLowerCase()))
    },
)


function onClickItem (item) {
  if (disabled) return

  emit('update:modelValue', item?.value ?? null)
  showList.value = false
}

const showList = ref(false)
function toggleList () {
  if (disabled) {
    return
  }
  showList.value = !showList.value
}
watch(
    showList,
    (newShowList) => {
      if (!newShowList) {
        searchText.value = ''
      }
    },
)
</script>