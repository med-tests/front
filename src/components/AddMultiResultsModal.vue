<template>
  <AppModal
    ref="add-multi-results-modal"
    title="Добавить несколько результатов"
    @on-close="clearData"
  >
    <div style="min-width: 480px;">
      <AppFormField
        label="Выберите показатель"
        type="select"
        :model-value="null"
        :select-list="allowedParams"
        @update:model-value="createForm($event)"
      />
      
      <!-- Управление формой -->
      <div class="mt-3 flex">
        <AppBtn
          class="ml-auto"
          type="success"
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
import AppFormField from '@/components/shared/inputs/AppFormField'
import { computed, ref, useTemplateRef } from 'vue'
import { useTestStore } from '@/stores/testStore.js'
import { storeToRefs } from 'pinia'

const addMultiResultsModalRef = useTemplateRef('add-multi-results-modal')

defineExpose({ open })

function open() {
  addMultiResultsModalRef.value.show()
}

function saveData () {
  addMultiResultsModalRef.value.close()
}

const { arrListData } = storeToRefs(useTestStore())
const forms = ref([])
const allowedParams = computed(() => {
  return arrListData.value
      .map(({ title, id }) => ({ label: title, value: id }))
      .filter(({ value }) => !forms.value.includes(value))
})

function createForm(paramId) {
  forms.value.push(paramId)
}

function clearData () {
  forms.value = []
}
</script>