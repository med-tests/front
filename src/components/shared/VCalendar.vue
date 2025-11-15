<template>
  <V-Input
    :id="`input-${uniqId}`"
    readonly
    placeholder="Выберите дату"
    :callback-validator="callbackValidator"
    :hide-close-icon="hideCloseIcon"
    :label="label"
    :model-value="dateValue"
    :required="required"
    :touch-id="touchId"
    @on-click-close-icon="emit('clear')"
    @on-validate="emit('onValidate', $event)"
  />
</template>

<script setup>
import AirDatepicker from 'air-datepicker'
import VInput from '@/components/shared/VInput.vue'
import 'air-datepicker/air-datepicker.css'
import { onMounted, ref, toRefs, watch } from 'vue'
import moment from 'moment'

const props = defineProps({
  uniqId: {
    type: String,
    required: true,
  },
  required: { type: Boolean, default: false },
  label: {
    type: String,
    default: '',
  },
  touchId: { type: String, default: '' },
  // Ожидает формат YYYY-MM-DD или пустую строку
  selectedDates: {
    type: String,
    required: true,
  },
  // Ожидает формат YYYY-MM-DD
  minDate: {
    type: [String, Date, null],
    default: null,
  },
  // Ожидает формат YYYY-MM-DD
  maxDate: {
    type: [String, Date, null],
    default: null,
  },
  // Ожидает формат YYYY-MM-DD
  coloredDates: {
    type: Array,
    default: () => ([]),
  },
  onBeforeSelect: {
    type: [Function, null],
    default: null,
  },
  hideCloseIcon: {
    type: Boolean,
    default: false,
  },
  callbackValidator: { type: Function, default: () => true },
})
const refProps = toRefs(props)

const emit = defineEmits(['input', 'onValidate', 'clear'])

const dateValue = ref('')

let datepickerInstance = null
onMounted(() => {
  const options = {
    dateFormat: 'dd.MM.yyyy',
    onBeforeSelect: ({ date }) => {
      // если не проходит проверку, выбранная дата не установится
      if (refProps.onBeforeSelect.value) {
        return refProps.onBeforeSelect.value(date)
      } else {
        return true
      }
    },
    onSelect: ({ date, formattedDate }) => {
      const initFormat = date
       ? moment(date).format('YYYY-MM-DD')
       : ''

      dateValue.value = formattedDate ? formattedDate : ''
      emit('input', initFormat)
    },
    onRenderCell({date, cellType}) {
      let dates = refProps.coloredDates.value,
          isDay = cellType === 'day',
          _date = moment(date).format('YYYY-MM-DD'),
          shouldChangeContent = isDay && dates.includes(_date)

      return {
        classes: shouldChangeContent ? 'test-day' : undefined,
      }
    },
  }

  const arr = ['selectedDates', 'minDate', 'maxDate']
  arr.forEach(field => {
    if (refProps[field]?.value) {
      options[field] = [refProps[field].value]
    }
  })

  datepickerInstance = new AirDatepicker(`#input-${refProps.uniqId.value}`, options)
})

watch(
  () => props.selectedDates,
  (newVal) => {
    if (newVal === '') {
      datepickerInstance.clear()
      return
    }
    datepickerInstance.selectDate(moment(newVal, 'YYYY-MM-DD').toDate())
  },
)
</script>

<style>
.test-day {
  background-color: #ffb8ff;
}
.-selected-.test-day {
  border: 2px solid #ffb8ff;
}
</style>
