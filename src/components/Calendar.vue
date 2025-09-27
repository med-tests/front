<template>
  <div>
    <div
        v-if="label"
        class="mb-1 text-gray-700"
    >
      {{ label }}
    </div>

    <div class="relative">
      <input
          class="border border-color-gray-700 rounded-xs p-1 text-gray-700 text-lg"
          :id="`input-${uniqId}`"
          placeholder="Выберите дату"
          readonly
      />
      <CloseIcon
          class="absolute"
          style="width: 24px; height: 24px; top: 50%; transform: translate(0, -50%); right: 5px;}"
          @click="clearDatepicker"
      />
    </div>
  </div>
</template>

<script setup>
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import {onMounted, toRefs} from "vue";
import moment from "moment";
import CloseIcon from "@/components/icons/CloseIcon.vue";

const props = defineProps({
  uniqId: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: ''
  },
  initDate: {
    type: String,
    default: ''
  },
  selectedDates: {
    type: [String, Date, Array, null],
    default: null
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
    default: () => ([])
  },
  onBeforeSelect: {
    type: [Function, null],
    default: null
  },
})
const refProps = toRefs(props)

const emit = defineEmits(['input'])

let datepickerInstance = null
onMounted(() => {
  const options = {
    dateFormat: "dd.MM.yyyy",
    onBeforeSelect: ({ date }) => {
      if (refProps.onBeforeSelect.value) {
        return refProps.onBeforeSelect.value(date)
      } else {
        return true
      }
    },
    onSelect: ({formattedDate}) => {
      if (!formattedDate) {
        datepickerInstance.selectDate(moment(refProps.selectedDates.value, 'YYYY-MM-DD').toDate())
        return
      }
      emit('input', formattedDate || '')
    },
    onRenderCell({date, cellType}) {
      let dates = refProps.coloredDates.value,
          isDay = cellType === 'day',
          _date = moment(date).format('YYYY-MM-DD'),
          shouldChangeContent = isDay && dates.includes(_date)

      return {
        classes: shouldChangeContent ? 'test-day' : undefined
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
};
</script>

<style>
.test-day {
  background-color: #ffb8ff;
}
</style>
