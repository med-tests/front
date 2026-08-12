<template>
  <div class="relative">
    <input
      :id="`calendar-input-${id}`"
      readonly
      autocomplete="new-password"
      class="default-input"
      data-test="app-calendar-input"
      placeholder="Выберите дату"
      type="text"
      :class="{
        [defaultBorderClass]: !isInvalid && !disabled,
        [`${disabledBorderClass} ${disabledBgClass} outline-none`]: disabled && !isInvalid,
        [invalidBorderClass]: isInvalid,
        [clearBtnOffsetClass]: !hideCloseIcon && !disabled
      }"
      :disabled
    >
    
    <AppBtn
      v-if="!hideCloseIcon && !disabled"
      not-bordered
      not-filling
      class="app-input__clear-btn"
      data-test="app-text-input__clear-btn"
      title="Очистить"
      @click="clear"
    >
      <CloseIcon />
    </AppBtn>
  </div>
</template>

<script setup>
import CloseIcon from '@/components/icons/CloseIcon.vue'
import { input as inputClasses } from '@/assets/vars.js'
import { formatToDate, formatToISODate, getRandomUid } from '@/helpers/index.js'
import { onMounted, watch } from 'vue'
import AirDatepicker from 'air-datepicker'

const {
  defaultBorderClass,
  invalidBorderClass,
  disabledBorderClass,
  disabledBgClass,
  clearBtnOffsetClass,
} = inputClasses

const {
  id,
  onBeforeSelect,
  isInvalid,
  coloredDates,
  modelValue,
  minDate,
  maxDate,
} = defineProps({
  id: { type: String, default: () => getRandomUid() },
  disabled: { type: Boolean, default: false },
  hideCloseIcon: { type: Boolean, default: false },
  isInvalid: { type: Boolean, default: false },
  onBeforeSelect: { type: [Function, null], default: null },
  // Ожидает формат YYYY-MM-DD
  coloredDates: { type: Array, default: () => ([]) },
  // Начальное значение. (selectedDates) Ожидает формат YYYY-MM-DD или пустую строку
  modelValue: { type: String, default: '' },
  // Ожидает формат YYYY-MM-DD
  minDate: { type: [String, null], default: null },
  // Ожидает формат YYYY-MM-DD
  maxDate: { type: [String, null], default: null },
})
const emit = defineEmits(['update:modelValue'])

let datepickerInstance = null
onMounted(() => {
  const options = {
    dateFormat: 'dd.MM.yyyy',
    autoClose: true,
    // Если true, то клик на активной ячейке снимет с нее выделение
    // может быть () => Boolean
    toggleSelected: false,
    onBeforeSelect: ({ date }) => {
      // если не проходит проверку, выбранная дата не установится
      return onBeforeSelect ? onBeforeSelect(date) : true
    },
    onSelect: ({ date }) => {
      const initFormat = date
          ? formatToISODate(date)
          : ''
      emit('update:modelValue', initFormat)
    },
    onRenderCell: ({ date, cellType }) => {
      return setClassForColoredCells(coloredDates, cellType, date)
    },
    selectedDates: modelValue,
    ...(minDate && { minDate }),
    ...(maxDate && { maxDate }),
  }

  datepickerInstance = new AirDatepicker(`#calendar-input-${id}`, options)
})

watch(
    () => modelValue,
    (newVal) => {
      if (datepickerInstance) {
        newVal === ''
            ? datepickerInstance.clear()
            : datepickerInstance.selectDate(formatToDate(new Date(newVal)))
      }
    },
)

watch(
    () => minDate,
    (newVal) => {
      if (datepickerInstance) {
        const date = newVal ? formatToDate(new Date(newVal)) : ''
        datepickerInstance.update({ minDate: date })
      }
    },
)

watch(
    () => maxDate,
    (newVal) => {
      if (datepickerInstance) {
        const date = newVal ? formatToDate(new Date(newVal)) : ''
        datepickerInstance.update({ maxDate: date })
      }
    },
)

watch(
    () => coloredDates,
    (newVal, oldVal) => {
      if (datepickerInstance) {
        if (newVal && oldVal && (JSON.stringify(oldVal) === JSON.stringify(newVal))) {
          return
        }

        datepickerInstance.update({
          onRenderCell: ({ date, cellType }) => setClassForColoredCells(newVal, cellType, date),
        })
      }
    },
)

function setClassForColoredCells (coloredDates, cellType, date) {
  let dates = coloredDates,
      isDay = cellType === 'day',
      _date = formatToISODate(date),
      shouldChangeContent = isDay && dates.includes(_date)

  return {
    classes: shouldChangeContent ? 'test-day' : undefined,
  }
}

function clear () {
  if (datepickerInstance) {
    datepickerInstance.clear()
  }
}
</script>

<style scoped>
.test-day {
  background-color: #ffb8ff;
}
.-selected-.test-day {
  border: 2px solid #ffb8ff;
}
</style>