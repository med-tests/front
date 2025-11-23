<template>
  <draggable
    v-model="computedArrListData"
    group="test"
    item-key="id"
  >
    <template #item="{element, index}">
      <div
        class="py-2 flex border-emerald-800"
        :class="{'border-b-1': index !== computedArrListData.length - 1}"
      >
        <a
          class="pr-1 cursor-pointer text-lg"
          :class="[element.isHidden ? 'text-gray-400' : 'text-gray-600 hover:text-gray-900']"
          :href="`#test-${element.id}`"
        >
          {{ element.title }}
        </a>

        <div class="ml-auto pl-3 flex gap-x-2">
          <v-btn
            not-bordered
            not-filling
            :title="element.isHidden ? 'Показать' : 'Скрыть'"
            @click="testStore.changeTest(element.id, { isHidden: element.isHidden ? 0 : 1 })"
          >
            <EyeClosedIcon v-if="element.isHidden" />
            <EyeIcon v-else />
          </v-btn>

          <v-btn
            not-bordered
            not-filling
            title="Удалить анализ"
            type="error"
            @click="showDeleteModal(element)"
          >
            <CloseIcon />
          </v-btn>
        </div>
      </div>
    </template>
  </draggable>

  <v-modal
    ref="delete-test-modal"
    @on-close="deletingTest = null"
  >
    <div class="mt-3">
      Вы уверены, что хотите удалить {{ deletingTest.title || '' }}?
    </div>

    <div class="mt-3 ml-auto flex justify-end flex-row gap-x-4">
      <v-btn
        @click="deleteTestModal.close()"
      >
        Отменить
      </v-btn>

      <v-btn
        type="error"
        @click="deleteTest"
      >
        Удалить
      </v-btn>
    </div>
  </v-modal>
</template>

<script setup>
import draggable from 'vuedraggable'
import EyeClosedIcon from '@/components/icons/EyeClosedIcon.vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import {useTestStore} from '@/store.js'
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import VModal from '@/components/shared/VModal.vue'

const testStore = useTestStore()

const computedArrListData = computed({
  get: () => testStore.arrListData,
  set: (newList) => testStore.updateOrder(newList),
})

const deletingTest = ref(null)
const deleteTestModal = useTemplateRef('delete-test-modal')
async function showDeleteModal (test) {
  deletingTest.value = test
  await nextTick()
  deleteTestModal.value.show()
}
function deleteTest () {
  testStore.deleteTest(deletingTest.value.id)
  deleteTestModal.value.close()
}
</script>
