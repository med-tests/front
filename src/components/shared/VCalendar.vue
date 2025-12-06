<template>
  <V-Input
    :id="`input-${uniqId}`"
    readonly
    placeholder="Выберите дату"
    :hide-close-icon="hideCloseIcon"
    :is-invalid-calendar="isInvalid"
    :label="label"
    @on-click-close-icon="emit('clear')"
  />
</template>

<script setup>
import AirDatepicker from 'air-datepicker'
import VInput from '@/components/shared/VInput.vue'
import 'air-datepicker/air-datepicker.css'
import { onMounted, ref, toRefs, watch } from 'vue'
import moment from 'moment'
import { showToast } from '@/components/shared/toaster/toast.js'

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
  forbidToggleSelected: {
    type: Boolean,
    default: false,
  },
  callbackValidator: { type: Function, default: () => true },
})
const refProps = toRefs(props)

const emit = defineEmits(['input', 'onValidate', 'clear'])

const dateValue = ref('') // '' или 'YYYY-MM-DD'

let datepickerInstance = null
onMounted(() => {
  const options = {
    dateFormat: 'dd.MM.yyyy',
    autoClose: true,
    toggleSelected: !refProps.forbidToggleSelected.value,
    onBeforeSelect: ({ date }) => {
      // если не проходит проверку, выбранная дата не установится
      if (refProps.onBeforeSelect.value) {
        return refProps.onBeforeSelect.value(date)
      } else {
        return true
      }
    },
    onSelect: ({ date }) => {
      isInvalid.value = false
      const initFormat = date
       ? moment(date).format('YYYY-MM-DD')
       : ''

      dateValue.value = initFormat
      emit('input', initFormat)
    },
    onRenderCell: ({date, cellType}) => {
      return setClassForColoredCells(refProps.coloredDates.value, cellType, date)
    },
  }

  const arr = ['selectedDates', 'minDate', 'maxDate']
  arr.forEach(field => {
    if (refProps[field]?.value) {
      options[field] = refProps[field].value
    }
  })

  datepickerInstance = new AirDatepicker(`#input-${refProps.uniqId.value}`, options)

  if (props.selectedDates) {
    datepickerInstance.selectDate(moment(props.selectedDates, 'YYYY-MM-DD').toDate())
  }
})

watch(
  () => props.selectedDates,
  (newVal) => {
    if (datepickerInstance) {
      if (props.selectedDates === dateValue.value) {
        return
      }

      newVal === ''
       ? datepickerInstance.clear()
       : datepickerInstance.selectDate(moment(newVal, 'YYYY-MM-DD').toDate())
    }
  },
)

watch(
  () => props.minDate,
  (newVal) => {
    if (!datepickerInstance) {
      return
    }
    datepickerInstance.update({ minDate: moment(newVal, 'YYYY-MM-DD').toDate() })
  }
)

watch(
  () => props.maxDate,
  (newVal) => {
    if (!datepickerInstance) {
      return
    }
    datepickerInstance.update({ maxDate: moment(newVal, 'YYYY-MM-DD').toDate() })
  }
)

watch(
  () => props.coloredDates,
  (newVal, oldVal) => {
    if (!datepickerInstance) {
      return
    }

    if (newVal && oldVal && (JSON.stringify(oldVal) === JSON.stringify(newVal))) {
      return
    }

    datepickerInstance.update({
      onRenderCell: ({date, cellType}) => {
        return setClassForColoredCells(newVal, cellType, date)
      },
    })
  }
)

const isInvalid = ref(false)

watch(
  () => props.touchId,
  () => {
    if (props.required && !dateValue.value) {
      isInvalid.value = true
      showToast('Заполните обязательные поля', {type: 'error'})
      emit('onValidate', false)
      return
    }

    const isCustomValid = props.callbackValidator(dateValue.value)
    if (!isCustomValid) {
      isInvalid.value = true
      emit('onValidate', false)
    }

    emit('onValidate', true)
  },
)

function setClassForColoredCells (coloredDates, cellType, date) {
  let dates = coloredDates,
    isDay = cellType === 'day',
    _date = moment(date).format('YYYY-MM-DD'),
    shouldChangeContent = isDay && dates.includes(_date)

  return {
    classes: shouldChangeContent ? 'test-day' : undefined,
  }
}
</script>

<style>
.test-day {
  background-color: #ffb8ff;
}
.-selected-.test-day {
  border: 2px solid #ffb8ff;
}
</style>
