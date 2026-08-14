<template>
  <div>
    <div
      :id="`chart-${id}`"
      class="flex mb-3 items-end justify-between mx-auto"
      style="width: calc(100% - 64px)"
    >
      <AppFormField
        class="mr-5 inline-block"
        label="Начало периода"
        type="calendar"
        :colored-dates="computedParamDates"
        :disabled="!item.results.length"
        :max-date="computedLastDate"
        :min-date="computedFirstDate"
        :model-value="item.shownPeriod.start"
        :on-before-select="onBeforeSelectStart"
        @clear="changePeriod('start', computedFirstDate)"
        @update:model-value="changePeriod('start', $event)"
      />
      <div class="text-lg text-gray-700 leading-none font-medium text-center">
        {{ chartData.datasets[0].label }}
        <!-- Норма -->
        <div
          v-if="computedIsNormalFromExist || computedIsNormalToExist"
          :id="`normal-${id}`"
          class="flex items-center justify-center mt-2"
          style="column-gap: 6px;"
        >
          ✅
          <div
            v-if="computedIsNormalFromExist"
            class="text-base font-normal"
          >
            от <span class="font-medium">{{ item.normalRange.from }}</span>
          </div>
          <div
            v-if="computedIsNormalToExist"
            class="text-base font-normal"
          >
            до <span class="font-medium">{{ item.normalRange.to }}</span>
          </div>
          <ToolTip
            text="Норма"
            :append-element-id="`normal-${id}`"
          />
        </div>
        <!-- Среднее значение в выбранном периоде -->
        <div
          v-if="item.isShowAverage && computedAverageInPeriod"
          class="flex justify-center"
        >
          <div :id="`average-${id}`">
            μ
            <span class="text-base">{{ computedAverageInPeriod }}</span>
            <ToolTip
              text="Среднее значение"
              :append-element-id="`average-${id}`"
            />
          </div>
        </div>
      </div>
      <AppFormField
        class="inline-block"
        label="Конец периода"
        type="calendar"
        :colored-dates="computedParamDates"
        :disabled="!item.results.length"
        :max-date="computedLastDate"
        :min-date="computedFirstDate"
        :model-value="item.shownPeriod.end"
        :on-before-select="onBeforeSelectEnd"
        @clear="changePeriod('end', computedLastDate)"
        @update:model-value="changePeriod('end', $event)"
      />
    </div>
    <Line
      v-if="chartData.datasets[0].data.length"
      :id="`chart-${id}`"
      style="max-height: 400px;"
      :data="chartData"
      :options="computedOptions"
      :plugins="[verticalHoverLine]"
    />
    <div
      v-else
      class="pt-7 text-center text-xl"
    >
      <div v-if="!item.results.length">
        Результаты, необходимые для построения графика, не добавлены.
        <p>
          Чтобы добавить их, 
          <AppBtn
            type="success"
            @click="emit('showUpsertModal')"
          >
            <span class="px-2">отредактируйте показатель</span>
          </AppBtn>.
        </p>
      </div>

      <div v-else>
        <p class="mb-2">
          С <span class="font-medium">{{ formatToRussianDate(item.shownPeriod.start) }}</span>
          по <span class="font-medium">{{ formatToRussianDate(item.shownPeriod.end) }}</span>
          нет результатов.
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
  import { computed } from 'vue'
  import { useTestStore } from '@/stores/testStore.js'
  import AppFormField from '@/components/shared/inputs/AppFormField'
  import moment from 'moment'
  import { showToast } from '@/components/shared/AppToaster/toast.js'
  import { colors } from '@/assets/vars.js'
  import { formatToISODate, formatToRussianDate } from '@/helpers/index.js'

  const emit = defineEmits(['showUpsertModal'])

  const verticalHoverLine = {
    id: 'verticalHoverLine',
    beforeDatasetsDraw (chart) {
      const  { ctx, chartArea: { top, bottom } } = chart
      ctx.save()

      chart.getDatasetMeta(0).data.forEach(dataPoint => {
        if (dataPoint.active) {
          ctx.beginPath()
          ctx.strokeStyle = colors.accentGreen
          ctx.lineWidth = 2
          ctx.moveTo(dataPoint.x, top)
          ctx.lineTo(dataPoint.x, bottom)
          ctx.stroke()
        }
      })
    },
  }

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

  const { item, id } = defineProps({
    item: { type: Object, required: true },
    id: { type: Number, required: true },
  })

  const testStore = useTestStore()

  const computedOptions = computed(() => {
    const from = item.normalRange.from
    const to = item.normalRange.to

    return {
      interaction: {
        intersect: false,
      },
      responsive: true,
      elements: {
        point: {
          radius: 8,
          hoverRadius: 10,
          backgroundColor: (ctx) => {
            const value = ctx.raw.y

            if (to && value > to) {
              return '#ff0000'
            }
            if (from && value < from) {
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
              return formatToRussianDate(new Date(rawDate))
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
              return formatToRussianDate(new Date(rawDate))
            },
            font: {
              size: 16,
            },
          },
        },
      },
    }
  })

  function onBeforeSelectStart (value) {
    if (value
        && item.shownPeriod.end
        && moment(formatToISODate(value)).isAfter(item.shownPeriod.end)
    ) {
      showToast('Начало периода не может быть позже конца периода', {  type: 'error' })
      return false
    }
    return true
  }

  function onBeforeSelectEnd (value) {
    if (value
        && item.shownPeriod.start
        && moment(formatToISODate(value)).isBefore(item.shownPeriod.start)
    ) {
      showToast('Конец периода не может быть раньше начала периода', {  type: 'error' })
      return false
    }
    return true
  }

  const changePeriod = (period, value) => {
    if (!item.results.length) {
      return
    }
    const sameStart = period === 'start' && item.shownPeriod.start === value
    const sameEnd = period === 'end' && item.shownPeriod.end === value
    if (sameStart || sameEnd) {
      return
    }

    testStore.changeParameter(id, { [period === 'start' ? 'showFrom' : 'showTo']: value })
  }

  const chartData = computed(() => {
    const data = item.results
        .filter(res => {
          return moment(res.date, 'YYYY-MM-DD')
            .isBetween(item.shownPeriod.start, item.shownPeriod.end, 'day', '[]')
        })
        .map((res) => ({ x: res.date, y: res.value })) || []

    return  {
      datasets: [
        {
          label: item.title,
          data,
        },
      ],
    }
  })

  const computedParamDates = computed(() => {
    return item.results.map(({ date }) => date) || []
  })

  const computedFirstDate = computed(() => {
    return item.results[0]?.date || ''
  })

  const computedLastDate = computed(() => {
    return item.results[item.results.length - 1]?.date || ''
  })

  const computedIsNormalFromExist = computed(() => {
    return item.normalRange.from || item.normalRange.from === 0
  })

  const computedIsNormalToExist = computed(() => {
    return item.normalRange.to || item.normalRange.to === 0
  })

  const computedAverageInPeriod = computed(() => {
    const amount = chartData.value.datasets[0].data.length
    if (!amount) {
      return ''
    }
    const sum = chartData.value.datasets[0].data
        .reduce((a, b) => a + b.y, 0)
    return (sum / amount).toFixed(1)
  })
</script>
