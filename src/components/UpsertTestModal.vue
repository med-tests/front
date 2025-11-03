<template>
  <v-modal
    ref="test-modal"
    :title="editingTestCode ? `Редактировать '${testName}'` : 'Добавить анализ'"
    @on-close="onClose"
  >
    <div>
      <div class="flex">
        <!--  code  -->
        <VInput
          id="testCode"
          v-model="testCode"
          hide-close-icon
          required
          class="mr-4 w-[100px]"
          label="Код анализа"
          placeholder=""
        />

        <!--  Название  -->
        <VInput
          id="testName"
          v-model="testName"
          hide-close-icon
          required
          class="grow-1"
          label="Название анализа"
          placeholder="Введите название анализа"
        />
      </div>

      <div class="mt-4 mb-6 flex">
        <!--  Нижняя граница нормы  -->
        <VInput
          id="lowEdge"
          v-model="lowEdge"
          hide-close-icon
          label="Нижняя граница нормы"
          placeholder="Введите число"
          type="number"
        />

        <!--  Верхняя граница нормы  -->
        <VInput
          id="testName"
          v-model="highEdge"
          hide-close-icon
          class="ml-4"
          label="Верхняя граница нормы"
          placeholder="Введите число"
          type="number"
        />
      </div>

      <!--  Результаты  -->
      <div class="flex justify-between items-center mb-1">
        <h5 class="text-xl text-gray-700">
          Результаты
        </h5>
        <v-btn
          style="height: 26px;"
          title="Добавить результат"
          type="success"
          @click="addFieldForNewResult"
        >
          <div class="flex justify-center items-center h-full">
            <!--  todo поставить иконку  -->
            +
          </div>
        </v-btn>
      </div>

      <!--  Вывод результатов анализа  -->
      <div
        v-if="results.length"
        class="overflow-y-auto p-1"
        style="max-height: 350px;"
      >
        <div class="mb-2 flex justify-between">
          <div class="w-50 required">
            Дата анализа
          </div>
          <div class="w-50 required">
            Результат
          </div>
        </div>
        <div
          v-for="(result, index) in results"
          :key="index"
        >
          <div class="mb-2 flex">
            <!--  Дата анализа  -->
            <VInput
              id="lowEdge"
              v-model="result.date"
              hide-close-icon
              required
              placeholder="ДД.MM.ГГГГ"
            />

            <!--  Результат анализа на дату -->
            <VInput
              id="testName"
              v-model="result.value"
              hide-close-icon
              required
              class="ml-4"
            />
          </div>
        </div>
      </div>

      <!-- Управление формой -->
      <div class="mt-3 ml-auto flex justify-end flex-row gap-x-4">
        <button
          class="cursor-pointer border"
          @click="testModal.close()"
        >
          Отменить
        </button>

        <button
          class="cursor-pointer border"
          @click="saveTest"
        >
          Сохранить
        </button>
      </div>
    </div>
  </v-modal>
</template>

<script setup>
import VModal from '@/components/shared/VModal.vue'
import { nextTick, ref, useTemplateRef } from 'vue'
import { useTestStore } from '@/store.js'
import VInput from '@/components/shared/VInput.vue'
import moment from 'moment/moment.js'
import { showToast } from '@/components/shared/toaster/toast.js'
import VBtn from '@/components/shared/VBtn/index.vue'

const testStore = useTestStore()

const props = defineProps({
  editingTestCode: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close', 'save'])

const testModal = useTemplateRef('test-modal')

const testCode = ref('')
const testName = ref('')
const lowEdge = ref(0)
const highEdge = ref(0)
const results = ref([])

defineExpose({ open })

function open () {
  if (props.editingTestCode) {
    const editingTest = testStore.fullData[props.editingTestCode]

    testName.value = editingTest.title
    lowEdge.value = editingTest.normalRange.from
    highEdge.value = editingTest.normalRange.to

    results.value = editingTest.results.map(({ date, value }) => {
      return {
        date: moment(date).format('DD.MM.YYYY'),
        value,
      }
    })
  }
  else {
    results.value.push({ date: '', value: null })
  }
  nextTick(() => {
    testModal.value.show()
  })
}

const onClose = () => {
  testCode.value = ''
  testName.value = ''
  lowEdge.value = ''
  highEdge.value = ''
  results.value = []
  emit('close')
}

const addFieldForNewResult = () => {
  results.value.push({ date: '', value: null })
}

const saveTest = () => {
  // Валидация формы
  if (testStore.arrListData.some(({ code }) => code === testCode.value)) {
    showToast('Код анализа должен быть уникален', {type: 'error'})
    return
  }
  if (!testCode.value || !testName.value) {
    showToast('Заполните обязательные поля', {type: 'error'})
    return
  }
  if (highEdge.value < lowEdge.value && (highEdge.value && lowEdge.value)) {
    showToast('Максимальное значение не может быть меньше минимального', {type: 'error'})
    return
  }
  if (highEdge.value < 0 || lowEdge.value < 0) {
    showToast('Граничные значения не могут быть отрицательными', {type: 'error'})
    return
  }

  // Валидация результатов анализа
  if (results.value.length
    && results.value.some(({ date, value }) => !date && (value || value === 0))
  ) {
    showToast('У результата анализа не указана дата ', {type: 'error'})
    return
  }

  if (results.value.length
    && results.value.some(({ date, value }) => date && (!value && value !== 0))
  ) {
    showToast('У результата анализа не указана результат', {type: 'error'})
    return
  }

  const existedResults = results.value.filter(({ date, value }) => date && (value || value === 0))

  if (results.value.length
    && existedResults.some(({ date }) => !/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/.test(date))
  ) {
    showToast('Неверный формат даты результата анализа', {type: 'error'})
    return
  }
  if (results.value.length
    && existedResults.some(({ value }) => !/^\d+(\,\d+)?$/.test(value) )
  ) {
    showToast('Результат анализа должен быть числом. Отделение дробной части запятой', {type: 'error'})
    return
  }

  // создание анализа - сохраняем все поля
  if (!props.editingTestCode) {
    emit('save', {
      code: testCode.value,
      title: testName.value,
      normalFrom: lowEdge.value,
      normalTo: highEdge.value,
      results: existedResults.map(res => ({
        date: moment(res.date, 'DD.MM.YYYY').format('YYYY-MM-DD'),
        value: res.value,
      })),
    })
  }


  nextTick(() => {
    testModal.value.close()
  })
}
</script>

<style>
.required::after {
  content: '*';
  color: red;
}
</style>
