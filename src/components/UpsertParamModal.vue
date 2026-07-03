<template>
  <AppModal
    ref="upsert-param-modal"
    :title="computedModalTitle"
    @on-close="onClose"
  >
    <div style="min-width: 480px;">
      <div>
        <!--  Название  -->
        <AppInput
          id="paramTitle"
          v-model="paramTitle"
          hide-close-icon
          required
          label="Название"
          placeholder="Введите название"
          :callback-validator="validation.title.validator"
          :touch-id="touchId"
          @on-validate="validation.title.error = $event"
        />
      </div>

      <div class="mt-4 mb-6 flex justify-between">
        <!--  Нижняя граница нормы  -->
        <AppInput
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
        <AppInput
          id="highEdge"
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
        <div class="text-right">
          Чтобы добавить результаты анализов или измерений показателя,
          <br>
          нажмите на плюс
        </div>
        <AppAddInputs
          title="Результаты анализов или измерений"
          :data="results"
          :fields-settings="resultFieldSettings"
          :touch-id="touchId"
          @delete-row="onDeleteResult"
          @on-change="formResults = $event"
        />
      </div>

      <!-- Управление формой -->
      <div class="mt-3 ml-auto flex justify-end flex-row gap-x-4">
        <AppBtn
          :is-loading="computedIsLoading"
          @click="upsertParamModal.close()"
        >
          <div class="px-2">
            Отменить
          </div>
        </AppBtn>

        <AppBtn
          type="success"
          :is-loading="computedIsLoading"
          @click="saveParam"
        >
          <div class="px-2">
            Сохранить
          </div>
        </AppBtn>
      </div>
    </div>
  </AppModal>
</template>

<script setup>
import AppModal from '@/components/shared/AppModal.vue'
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import { useTestStore } from '@/stores/testStore.js'
import AppInput from '@/components/shared/AppInput'
import { showToast } from '@/components/shared/AppToaster/toast.js'
import { getRandomUid } from '@/helpers/index.js'
import AppAddInputs from '@/components/shared/AppAddInputs.vue'
import moment from 'moment'
import {storeToRefs} from 'pinia'
import {useApiStore} from '@/stores/apiStore.js'

const testStore = useTestStore()

const props = defineProps({
  editingParamId: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['close'])

const upsertParamModal = useTemplateRef('upsert-param-modal')

const paramTitle = ref('')
const initParamName = ref('')
const lowEdge = ref('')
const highEdge = ref('')
const results = ref([])
const formResults = ref([])

defineExpose({ open })

const isCreating = computed(() => {
  return props.editingParamId === 0
})

const computedModalTitle = computed(() => {
  return isCreating.value
      ? 'Создать показатель'
      : `Редактировать "${initParamName.value}"`
})

function open () {
  if (!isCreating.value) {
    initEditing()
  }
  nextTick(() => {
    upsertParamModal.value.show()
  })
}

function initEditing () {
  const editingParam = JSON.parse(JSON.stringify(testStore.getFullParameterById(props.editingParamId)))

  initParamName.value = editingParam.title
  paramTitle.value = editingParam.title
  lowEdge.value = editingParam.normalRange.from
  highEdge.value = editingParam.normalRange.to
  editingParam.results
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
  paramTitle.value = ''
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
        showToast('Слишком длинное название', {type: 'error'})
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
    label: 'Дата',
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

const { loading } = storeToRefs(useApiStore())
const computedIsLoading = computed(() => {
  return loading.addParameter || loading.editParameter || false
})
const saveParam = async () => {
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
      title: paramTitle.value,
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

    testStore.addParameter(sendData)
      .then(() => {
        upsertParamModal.value.close()
      })
  }
  // редактирование анализа - отправляем только изменившиеся поля
  else {
    const initParam = testStore.getFullParameterById(props.editingParamId)
    const sendData = {}
    if (paramTitle.value !== initParam.title) {
      sendData.title = paramTitle.value
    }
    if (lowEdge.value !== initParam.normalRange.from) {
      sendData.normalFrom = lowEdge.value
    }
    if (highEdge.value !== initParam.normalRange.to) {
      sendData.normalTo = highEdge.value
    }

    const changedResults = []
    formResults.value
      .filter(({ date, resValue }) => date.value && (resValue.value || resValue.value === 0))
      .forEach(({ date, resValue, id }) => {
      if (id) {
        const initResult = initParam.results.find(initRes => initRes.id === id)
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
      upsertParamModal.value.close()
      return
    }

    testStore.changeParameter(props.editingParamId, sendData)
      .then(() => {
        upsertParamModal.value.close()
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
</script>
