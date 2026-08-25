<template>
  <AppModal
    ref="add-multi-results-modal"
    title="Добавить несколько результатов"
  >
    <div style="min-width: 480px;">
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
import { useTemplateRef } from 'vue'

const addMultiResultsModalRef = useTemplateRef('add-multi-results-modal')

defineExpose({ open })

function open() {
  addMultiResultsModalRef.value.show()
}

function saveData () {
  addMultiResultsModalRef.value.close()
}
</script>