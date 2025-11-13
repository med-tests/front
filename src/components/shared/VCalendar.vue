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
    @on-click-close-icon="clearDatepicker"
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
  initDate: {
    type: String,
    default: '',
  },
  touchId: { type: String, default: '' },
  selectedDates: {
    type: [String, Date, Array, null],
    default: null,
  },
  minDate: {
    type: [String, Date, null],
    default: null,
  },
  maxDate: {
    type: [String, Date, null],
    default: null,
  },
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

const emit = defineEmits(['input', 'onValidate'])

const dateValue = ref('')

let datepickerInstance = null
onMounted(() => {
  const options = {
    dateFormat: 'dd.MM.yyyy',
    onBeforeSelect: ({ date }) => {
      if (refProps.onBeforeSelect.value) {
        return refProps.onBeforeSelect.value(date)
      } else {
        return true
      }
    },
    onSelect: ({formattedDate}) => {
      if (!formattedDate) {
        dateValue.value = moment(refProps.selectedDates.value, 'YYYY-MM-DD').format('DD.MM.YYYY')
        datepickerInstance.selectDate(moment(refProps.selectedDates.value, 'YYYY-MM-DD').toDate())
        return
      }
      dateValue.value = formattedDate
      emit('input', formattedDate || '')
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
const clearDatepicker = () => {
  if (datepickerInstance) {
    if (refProps.initDate.value) {
      datepickerInstance.selectDate(moment(refProps.initDate.value, 'YYYY-MM-DD').toDate())
    } else {
      datepickerInstance.clear()
    }
  }
}

watch(
  () => props.selectedDates,
  () => {
    if (props.selectedDates === '') {
      datepickerInstance.clear()
      return
    }
    datepickerInstance.selectDate(moment(props.selectedDates, 'DD.MM.YYYY').toDate())
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
