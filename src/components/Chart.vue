<template>
  <template>
    <div v-if="!isHidden">
      <div
          class="flex mb-3 items-end justify-between mx-auto"
          style="width: calc(100% - 64px)"
      >
        <Calendar
            class="mr-5 inline-block"
            label="Начало периода"
            :colored-dates="computedTestDates"
            :uniq-id="`${code}-start`"
            :selected-dates="period.start"
            @input="changePeriod('start', $event)"
        />
        <div class="text-lg text-gray-700 leading-none font-medium">{{ chartData.datasets[0].label }}</div>
        <Calendar
            class="inline-block"
            label="Конец периода"
            :colored-dates="computedTestDates"
            :uniq-id="`${code}-end`"
            :selected-dates="period.end"
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
    import {computed, ref, toRefs} from "vue";
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
      chartData: { type: Object, required: true },
      period: { type: Object, required: true },
      isHidden: { type: Boolean, default: false },
      code: { type: String, required: true },
    })

    const refProps = toRefs(props)

    const testStore = useTestStore()

    const options = {
      responsive: true,
      elements: {
        point: {
          radius: 6,
          hoverRadius: 8,
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
            size: 22,
            weight: 'bold',
          },
          bodyFont: {
            size: 18,
          },
        },
      },
    }

    const changePeriod = (period, value) => {
      const newPeriod = {
        start: refProps.period.value.start,
        end: refProps.period.value.end,
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

    const computedTestDates = computed(() => {
      return refProps.chartData.value.datasets[0].data.map(({ x }) => x)
    })

  </script>

</template>

<script setup>

</script>