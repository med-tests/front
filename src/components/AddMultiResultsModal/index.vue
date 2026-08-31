<template>
  <AppModal
    ref="add-multi-results-modal"
    title="Добавить несколько результатов"
    @on-close="clearData"
  >
    <div
      class="w-full"
      style="min-width: 552px;"
    >
      <div class="flex items-center">
        <span class="pr-3">Выберите показатель:</span>
        <AppSelect
          class="grow"
          :disabled="loading.addMultiResults"
          :list="allowedParams"
          @update:model-value="createForm($event)"
        />
      </div>

      <div
        v-if="forms.length"
        class="mt-3 overflow-y-auto max-h-[450px] "
      >
        <div
          v-for="(form, index) in forms"
          :key="form.param.value"
          class="py-4 px-2 item-hover border-emerald-800"
          :class="{  
            'border-b-1': index !== forms.length - 1,  
          }"
        >
          <div class="flex items-center">
            <span class="pr-2">Показатель:</span>
            <AppSelect
              v-model="form.param.value"
              class="grow"
              :disabled="loading.addMultiResults"
              :list="allowedParams.concat([{ ...form.param }])"
            />

            <AppBtn
              class="ml-3"
              title="Удалить введенные данные"
              type="error"
              :disabled="loading.addMultiResults"
              @click="deleteForm(form.param.value)"
            >
              <CloseIcon
                height="20px"
                width="20px"
              />
            </AppBtn>
          </div>

          <AppAddInputs
            add-new-row-if-empty
            class="mt-4"
            title="Результаты"
            :disabled="loading.addMultiResults"
            :fields-settings="resultFieldSettings"
            :touch-id="touchId"
            @on-change="setResultsForParam(form.param.value, $event)"
          />
        </div>
      </div>
      
      <!-- Управление формой -->
      <div class="mt-3 flex">
        <AppBtn
          class="ml-auto"
          type="success"
          :is-loading="loading.addMultiResults"
          @click="saveData"
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
import AppModal from '@/components/shared/AppModal'
import AppSelect from '@/components/shared/AppSelect'
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import { useTestStore } from '@/stores/testStore.js'
import { storeToRefs } from 'pinia'
import { formatToISODate, getRandomUid } from '@/helpers'
import AppAddInputs from '@/components/shared/AppAddInputs.vue'
import AppBtn from '@/components/shared/AppBtn/index.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import { useApiStore } from '@/stores/apiStore.js'
import { showToast } from '@/components/shared/AppToaster/toast.js'

const addMultiResultsModalRef = useTemplateRef('add-multi-results-modal')

defineExpose({ open })

function open() {
  addMultiResultsModalRef.value.show()
}

const { arrListData } = storeToRefs(useTestStore())
const { addMultiResults } = useTestStore()
const { loading } = storeToRefs(useApiStore())

const forms = ref([])

const allowedParams = computed(() => {
  const formParamIds = forms.value.map(item => item.param.value)

  return arrListData.value
      .map(({ title, id }) => ({ label: title, value: id }))
      .filter(({ value }) => !formParamIds.includes(value))
})

function createForm(paramId) {
  forms.value.unshift({
    param: {
      label: allowedParams.value.find(({ value }) => value === paramId).label,
      value: paramId,
    },
    results: [],
  })
}

function deleteForm (paramId) {
  forms.value = forms.value.filter(item => item.param.value !== paramId)
}

function setResultsForParam (paramId, data) {
  forms.value
      .find(item => item.param.value === paramId)
      .results = data
}

function clearData () {
  forms.value = []
}

const resultFieldSettings = {
  date: {
    label: 'Дата',
    type: 'calendar',
    required: true,
    hideCloseIcon: true,
    hideInputCloseIcon: false,
    placeholder: 'ДД.MM.ГГГГ',
    maxDate: () => {
      return formatToISODate(new Date())
    },
  },
  resValue: {
    label: 'Результат',
    type: 'number',
    required: true,
    hideCloseIcon: true,
  },
}

const touchId = ref('')

const saveData = async () => {
  touchId.value = getRandomUid(7)
  await nextTick()

  const someResultFieldInvalid = forms.value
      .filter(({ results }) => results.length)
      .some((item) => {
        return item.results
            .filter(({ isHidden }) => !isHidden)
            .some(({ date, resValue }) => date.error || resValue.error)
      })

  if (someResultFieldInvalid) {
    console.log('Ошибка при заполнении формы')
    return
  }

  const sendData = forms.value
      .map(item => ({
        id: item.param.value,
        results: item.results
            .filter(({ isHidden }) => !isHidden)
            .map(({ date, resValue }) => ({
              date: date.value,
              value: resValue.value,
            })),
      }))
      .filter(({ results }) => results.length)

  if (!sendData.length) {
    addMultiResultsModalRef.value.close()
    return
  }

  addMultiResults(sendData)
      .then(() => {
        addMultiResultsModalRef.value.close()
      })
}

</script>