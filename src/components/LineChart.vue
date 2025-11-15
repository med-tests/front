<template>
  <div v-if="!test.isHidden">
    <div
      class="flex mb-3 items-center justify-between mx-auto"
      style="width: calc(100% - 64px)"
    >
      <V-Calendar
        class="mr-5 inline-block"
        label="Начало периода"
        :colored-dates="computedTestDates"
        :max-date="computedLastDate"
        :min-date="computedFirstDate"
        :on-before-select="onBeforeSelectStart"
        :selected-dates="test.shownPeriod.start"
        :uniq-id="`${code}-start`"
        @clear="changePeriod('start', computedFirstDate)"
        @input="changePeriod('start', $event)"
      />
      <div class="text-lg text-gray-700 leading-none font-medium text-center">
        {{ chartData.datasets[0].label }}
        <div
          v-if="test.normalRange.from || test.normalRange.to"
          class="flex items-center mt-2"
          style="column-gap: 6px;"
        >
          ✅
          <div
            v-if="test.normalRange.from"
            class="text-base font-normal"
          >
            от <span class="font-medium">{{ test.normalRange.from }}</span>
          </div>
          <div
            v-if="test.normalRange.to"
            class="text-base font-normal"
          >
            до <span class="font-medium">{{ test.normalRange.to }}</span>
          </div>
        </div>
      </div>
      <V-Calendar
        class="inline-block"
        label="Конец периода"
        :colored-dates="computedTestDates"
        :max-date="computedLastDate"
        :min-date="computedFirstDate"
        :on-before-select="onBeforeSelectEnd"
        :selected-dates="test.shownPeriod.end"
        :uniq-id="`${code}-end`"
        @clear="changePeriod('end', computedLastDate)"
        @input="changePeriod('end', $event)"
      />
    </div>
    <Line
      v-if="chartData.datasets[0].data.length"
      :id="`chart-${test.code}`"
      style="max-height: 400px;"
      :data="chartData"
      :options="options"
    />
    <div
      v-else
      class="pt-7 text-center text-xl"
    >
      <div v-if="!test.results.length">
        Не было сдано ни одного анализа
      </div>
      <div v-else>
        <p class="mb-2">
          Кажется,
          с <span class="font-medium">{{ moment(test.shownPeriod.start).format('DD.MM.YYYY') }}</span>
          по <span class="font-medium">{{ moment(test.shownPeriod.end).format('DD.MM.YYYY') }}</span>
          не было анализов <span class="font-medium">"{{ test.title }}"</span>.
        </p>
        <p>Попробуйте выбрать другой временной период.</p>
      </div>
    </div>
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
  Legend,
} from 'chart.js'
  import {computed, toRefs } from 'vue'
  import {useTestStore} from '@/store.js'
  import VCalendar from '@/components/shared/VCalendar.vue'
  import moment from 'moment'
  import {showToast} from '@/components/shared/toaster/toast.js'

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

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
        backgroundColor: (ctx) => {
          const value = ctx.raw.y
          const range = refProps.test.value.normalRange

          if (!range) {
            return '#006045'
          }

          if (Object.hasOwn(range, 'to') && range.to < value) {
            return '#ff0000'
          }
          if (Object.hasOwn(range, 'from') && range.from > value) {
            return '#0033ff'
          }
          return '#006045'
        },
      },
      line: {
        borderColor: '#006045',
        borderWidth: 4,
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
        },
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            const rawDate = context[0].label
            return moment(new Date(rawDate)).format('DD.MM.YYYY')
          },
          label: function (context) {
            return context.parsed.y
          },
        },
        titleFont: {
          size: 18,
          weight: 'bold',
        },
        bodyFont: {
          size: 22,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function(value) {
            const rawDate = this.getLabelForValue(value)
            return moment(new Date(rawDate)).format('DD.MM.YYYY')
          },
          font: {
            size: 16,
          },
        },
      },
    },
  }

  function onBeforeSelectStart (value) {
    if (value
        && refProps.test.value.shownPeriod.end
        && moment(value).isAfter(refProps.test.value.shownPeriod.end)
    ) {
      showToast('Начало периода не может быть позже конца периода', {  type: 'error' })
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
      showToast('Конец периода не может быть раньше начала периода', {  type: 'error' })
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

    testStore.changeTest(
        refProps.code.value,
        'shownPeriod',
        newPeriod,
    )
  }

  const chartData = computed(() => {
    const data = refProps.test.value.results
        .filter(res => {
          return moment(res.date, 'YYYY-MM-DD')
            .isBetween(refProps.test.value.shownPeriod.start, refProps.test.value.shownPeriod.end, 'day', '[]')
        })
        .map((res) => ({x: res.date, y: res.value })) || []

    return  {
      datasets: [
        {
          label: refProps.test.value.title,
          data,
        },
      ],
    }
  })

  const computedTestDates = computed(() => {
    return refProps.test.value.results.map(({ date }) => date) || []
  })

  const computedFirstDate = computed(() => {
    return refProps.test.value.results[0]?.date || ''
  })

  const computedLastDate = computed(() => {
    return refProps.test.value.results[refProps.test.value.results.length - 1]?.date || ''
  })
</script>
