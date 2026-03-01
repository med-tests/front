<template>
  <VModal
    ref="test-modal"
    :title="isCreating ? 'Добавить анализ' : `Редактировать '${initTestName}'`"
    @on-close="onClose"
  >
    <div style="min-width: 480px;">
      <div>
        <!--  Название  -->
        <VInput
          id="testName"
          v-model="testName"
          hide-close-icon
          required
          label="Название анализа"
          placeholder="Введите название анализа"
          :callback-validator="validation.title.validator"
          :touch-id="touchId"
          @on-validate="validation.title.error = $event"
        />
      </div>

      <div class="mt-4 mb-6 flex justify-between">
        <!--  Нижняя граница нормы  -->
        <VInput
          id="lowEdge"
          v-model="lowEdge"
          hide-close-icon
          label="Нижняя граница нормы"
          placeholder="Введите число"
          type="number"
          :callback-validator="validation.lowEdge.validator"
          :touch-id="touchId"
          @on-validate="validation.lowEdge.error = $event"
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
          :callback-validator="validation.highEdge.validator"
          :touch-id="touchId"
          @on-validate="validation.highEdge.error = $event"
        />
      </div>

      <!--  Результаты  -->
      <div
        class="overflow-y-auto p-1"
        style="max-height: 350px; min-width: 450px;"
      >
        <div>
          Чтобы добавить результаты анализа, нажмите на плюс
        </div>
        <VAddInputs
          title="Результаты"
          :data="results"
          :fields-settings="resultFieldSettings"
          :touch-id="touchId"
          @delete-row="onDeleteResult"
          @on-change="formResults = $event"
        />
      </div>

      <!-- Управление формой -->
      <div class="mt-3 ml-auto flex justify-end flex-row gap-x-4">
        <VBtn
          :is-loading="computedIsLoading"
          @click="testModal.close()"
        >
          <div class="px-2">
            Отменить
          </div>
        </VBtn>

        <VBtn
          type="success"
          :is-loading="computedIsLoading"
          @click="saveTest"
        >
          <div class="px-2">
            Сохранить
          </div>
        </VBtn>
      </div>
    </div>
  </VModal>
</template>

<script setup>
import VModal from '@/components/shared/VModal.vue'
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import { useTestStore } from '@/stores/testStore.js'
import VInput from '@/components/shared/VInput.vue'
import { showToast } from '@/components/shared/toaster/toast.js'
import { getRandomUid } from '@/helpers/index.js'
import VAddInputs from '@/components/shared/VAddInputs.vue'
import moment from 'moment'
import {useLoadingStore} from '@/stores/loadingStore.js'

const testStore = useTestStore()

const props = defineProps({
  editingTestId: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['close'])

const testModal = useTemplateRef('test-modal')

const testName = ref('')
const initTestName = ref('')
const lowEdge = ref('')
const highEdge = ref('')
const results = ref([])
const formResults = ref([])

defineExpose({ open })

const isCreating = computed(() => {
  return props.editingTestId === 0
})

function open () {
  if (!isCreating.value) {
    initEditing()
  }
  nextTick(() => {
    testModal.value.show()
  })
}

function initEditing () {
  const editingTest = JSON.parse(JSON.stringify(testStore.getFullTestById(props.editingTestId)))

  initTestName.value = editingTest.title
  testName.value = editingTest.title
  lowEdge.value = editingTest.normalRange.from
  highEdge.value = editingTest.normalRange.to
  editingTest.results
    .reverse()
    .forEach(({ date, value, id }) => {
      results.value.push({
        id,
        date: {
          value: date,
        },
        resValue: {
          value: value,
        },
      })
  })
}

const deletedResultIds = ref([])
const onClose = () => {
  testName.value = ''
  lowEdge.value = ''
  highEdge.value = ''
  results.value = []
  deletedResultIds.value = []
  emit('close')
}

const touchId = ref('')

const validation = ref({
  title: {
    error: false,
    validator: (value) => {
      if (value.length > 45) {
        showToast('Слишком длинное название анализа', {type: 'error'})
        return false
      }
      return true
    },
  },
  lowEdge: {
    error: false,
    validator: (value) => {
      if (value < 0) {
        showToast('Нижняя граница не может быть отрицательной', {type: 'error'})
        return false
      }
      return true
    },
  },
  highEdge: {
    error: false,
    validator: (value) => {
      if (highEdge.value < lowEdge.value && ((highEdge.value || highEdge.value === 0) && (lowEdge.value || lowEdge.value === 0))) {
        showToast('Максимальное значение не может быть меньше минимального', {type: 'error'})
        return false
      }

      if (value < 0) {
        showToast('Верхняя граница не может быть отрицательной', {type: 'error'})
        return false
      }
      return true
    },
  },
})

const resultFieldSettings = {
  date: {
    label: 'Дата анализа',
    type: 'calendar',
    required: true,
    hideCloseIcon: true,
    hideInputCloseIcon: false,
    placeholder: 'ДД.MM.ГГГГ',
    maxDate: () => {
      return moment().format('YYYY-MM-DD')
    },
  },
  resValue: {
    label: 'Результат',
    type: 'number',
    required: true,
    hideCloseIcon: true,
  },
}

function onDeleteResult (result) {
  if (Object.hasOwn(result, 'id')) {
    deletedResultIds.value.push(result.id)
  }
}

const { loading } = useLoadingStore()
const computedIsLoading = computed(() => {
  return loading.addTest || loading.editTest || false
})
const saveTest = async () => {
  touchId.value = getRandomUid(7)
  await nextTick()

  const someFieldInvalid = Object.keys(validation.value).some(key => validation.value[key].error)
  const someResultFieldInvalid = formResults.value
    .filter(({ isHidden }) => !isHidden)
    .some(({ date, resValue }) => date.error || resValue.error)

  if (someFieldInvalid || someResultFieldInvalid) {
    console.log('Ошибка при заполнении формы')
    return
  }

  // создание анализа - сохраняем все поля
  if (isCreating.value) {
    const sendData = {
      title: testName.value,
      normalFrom: lowEdge.value,
      normalTo: highEdge.value,
      position: testStore.fullData.length + 1,
      results: formResults.value
        .filter(({ date, resValue }) => date.value && (resValue.value || resValue.value === 0))
        .map(({ date, resValue }) => ({
          date: date.value,
          value: resValue.value,
        })),
    }

    testStore.addNewTest(sendData)
      .then(() => {
        testModal.value.close()
      })
      .catch((err) => { })
  }
  // редактирование анализа - отправляем только изменившиеся поля
  else {
    const initTest = testStore.getFullTestById(props.editingTestId)
    const sendData = {}
    if (testName.value !== initTest.title) {
      sendData.title = testName.value
    }
    if (lowEdge.value !== initTest.normalRange.from) {
      sendData.normalFrom = lowEdge.value
    }
    if (highEdge.value !== initTest.normalRange.to) {
      sendData.normalTo = highEdge.value
    }

    const changedResults = []
    formResults.value
      .filter(({ date, resValue }) => date.value && (resValue.value || resValue.value === 0))
      .forEach(({ date, resValue, id }) => {
      if (id) {
        const initResult = initTest.results.find(initRes => initRes.id === id)
        const changedResult = {}
        if (initResult.date !== date.value) {
          changedResult.date =  date.value
        }
        if (initResult.value !== resValue.value) {
          changedResult.value =  resValue.value
        }
        if (deletedResultIds.value.includes(id)) {
          changedResult.status = 0
        }

        if (Object.keys(changedResult).length) {
          changedResult.id = id
          changedResults.push(changedResult)
        }
      }
      else {
        changedResults.push({ date: date.value, value: resValue.value })
      }
    })

    if (changedResults.length) {
      sendData.results = changedResults
    }

    if (!Object.keys(sendData).length) {
      testModal.value.close()
      return
    }

    testStore.changeTest(props.editingTestId, sendData)
      .then(() => {
        testModal.value.close()
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
</script>
