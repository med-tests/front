<template>
  <div v-if="!test.isHidden">
    <div
        class="flex mb-3 items-end justify-between mx-auto"
        style="width: calc(100% - 64px)"
    >
      <Calendar
          class="mr-5 inline-block"
          label="Начало периода"
          :uniq-id="`${code}-start`"
          :selected-dates="test.shownPeriod.start"
          :min-date="test.firstTestDate"
          :max-date="test.lastTestDate"
          :colored-dates="test.testDates"
          :initDate="test.firstTestDate"
          :onBeforeSelect="onBeforeSelectStart"
          @input="changePeriod('start', $event)"
      />
      <div class="text-lg text-gray-700 leading-none font-medium">{{ chartData.datasets[0].label }}</div>
      <Calendar
          class="inline-block"
          label="Конец периода"
          :uniq-id="`${code}-end`"
          :selected-dates="test.shownPeriod.end"
          :min-date="test.firstTestDate"
          :max-date="test.lastTestDate"
          :colored-dates="test.testDates"
          :initDate="test.lastTestDate"
          :onBeforeSelect="onBeforeSelectEnd"
          @input="changePeriod('end', $event)"
      />
    </div>
    <Line
        id="my-chart-id"
        :data="chartData"
        :options="options"
    />
  </div>
</template>

<script setup>
  import { Line } from 'vue-chartjs'
  import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
  import {computed, toRefs } from "vue";
  import {useTestStore} from "@/store.js";
  import Calendar from "@/components/Calendar.vue";
  import moment from "moment";

  ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
  )

  const props = defineProps({
    test: { type: Object, required: true },
    code: { type: String, required: true },
})

  const refProps = toRefs(props)

  const testStore = useTestStore()

  const options = {
    responsive: true,
    elements: {
      point: {
        radius: 8,
        hoverRadius: 10,
      },
      line: {
        borderColor: '#006045',
        borderWidth: 4
      },
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          font: {
            size: 18,
          },
          color: '#000000',
        }
      },
      tooltip: {
        titleFont: {
          size: 18,
          weight: 'bold',
        },
        bodyFont: {
          size: 22,
        },
      },
    },
  }


  function onBeforeSelectStart (value) {
    if (value
        && refProps.test.value.shownPeriod.end
        && moment(value).isAfter(refProps.test.value.shownPeriod.end)
    ) {
      alert('start не может быть позже end')
      return false
    } else {
      return true
    }
  }

  function onBeforeSelectEnd (value) {
    if (value
        && refProps.test.value.shownPeriod.start
        && moment(value).isBefore(refProps.test.value.shownPeriod.start)
    ) {
      alert('end не может быть раньше start')
      return false
    } else {
      return true
    }
  }

  const changePeriod = (period, value) => {
    const newPeriod = {
      start: refProps.test.value.shownPeriod.start,
      end: refProps.test.value.shownPeriod.end,
    }
    newPeriod[period] = value
        ? moment(value, 'DD.MM.YYYY').format('YYYY-MM-DD')
        : ''

    testStore.changeTest(
        refProps.code.value,
        'shownPeriod',
        newPeriod,
    )
  }

  const chartData = computed(() => {
    return  {
      datasets: [
        {
          label: refProps.test.value.title || 'No title',
          backgroundColor: '#006045',
          data: refProps.test.value.results || []
        }
      ],
    }
  })

</script>
