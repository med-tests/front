<template>
  <v-modal
    ref="test-modal"
    :title="isCreating ? 'Добавить анализ' : `Редактировать '${testName}'`"
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
          :callback-validator="validation.code.validator"
          :touch-id="touchId"
          @on-validate="validation.code.error = !$event"
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
          :touch-id="touchId"
          @on-validate="validation.title.error = !$event"
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
          @on-validate="validation.lowEdge.error = !$event"
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
          @on-validate="validation.highEdge.error = !$event"
        />
      </div>

      <!--  Результаты  -->
      <div
        class="overflow-y-auto p-1"
        style="max-height: 350px; min-width: 450px;"
      >
        <v-add-inputs
          title="Результаты"
          :data="results"
          :fields-settings="resultFieldSettings"
          :touch-id="touchId"
          @on-change="formResults.value = $event"
        />
      </div>

      <!-- Управление формой -->
      <div class="mt-3 ml-auto flex justify-end flex-row gap-x-4">
        <v-btn
          @click="testModal.close()"
        >
          <div class="px-2">
            Отменить
          </div>
        </v-btn>

        <v-btn
          v-if="isCreating"
          type="success"
          @click="saveTest"
        >
          <div class="px-2">
            Добавить анализ
          </div>
        </v-btn>
      </div>
    </div>
  </v-modal>
</template>

<script setup>
import VModal from '@/components/shared/VModal.vue'
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import { useTestStore } from '@/store.js'
import VInput from '@/components/shared/VInput.vue'
import { showToast } from '@/components/shared/toaster/toast.js'
import VBtn from '@/components/shared/VBtn/index.vue'
import { getRandomUid } from '@/helpers/index.js'
import VAddInputs from '@/components/shared/VAddInputs.vue'

const testStore = useTestStore()

const props = defineProps({
  editingTestCode: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close'])

const testModal = useTemplateRef('test-modal')

const testCode = ref('')
const testName = ref('')
const lowEdge = ref(0)
const highEdge = ref(0)
const results = ref([])
const formResults = ref([])

defineExpose({ open })

const isCreating = computed(() => {
  return props.editingTestCode === ''
})

function open () {
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

const touchId = ref('')

const validation = ref({
  code: {
    error: false,
    validator: (value) => {
      if (testStore.arrListData.some(({ code }) => code === value)) {
        showToast('Код анализа должен быть уникален', {type: 'error'})
        return false
      }
      return true
    },
  },
  title: {
    error: false,
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
      if (highEdge.value < lowEdge.value && (highEdge.value && lowEdge.value)) {
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
  },
  resValue: {
    label: 'Результат',
    type: 'number',
    required: true,
    hideCloseIcon: true,
    validator: (value) => {
      if (!/^\d+(\,\d+)?$/.test(value)) {
        showToast('Результат анализа должен быть числом. Отделение дробной части запятой', {type: 'error'})
        return false
      }
      return true
    },
  },
}

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
      code: testCode.value,
      title: testName.value,
      normalFrom: lowEdge.value,
      normalTo: highEdge.value,
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
  }
}
</script>

<style>
.required::after {
  content: '*';
  color: red;
}
</style>
