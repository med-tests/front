<template>
  <div
    class="overflow-x-auto"
    style="max-height: calc(100% - 40px);"
  >
    <draggable
      class="pr-3"
      group="test"
      item-key="id"
      :list="testStore.arrListData"
      @change="change"
    >
      <template #item="{element, index}">
        <div
          class="py-2 flex border-emerald-800"
          :class="{
            'border-b-1': index !== testStore.arrListData.length - 1,
            'opacity-60': element.isHidden
          }"
        >
          <a
            class="pr-1 cursor-pointer text-lg text-gray-600 hover:text-gray-900"
            :href="`#test-${element.id}`"
          >
            {{ element.title }}
          </a>

          <div class="ml-auto pl-3 flex gap-x-1">
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
              title="Редактировать анализ"
              @click="showUpsertTestModal(element.id)"
            >
              <PencilIcon
                height="17"
                width="17"
              />
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
  </div>

  <v-modal
    ref="delete-test-modal"
    @on-close="deletingTest = null"
  >
    <div class="mt-3">
      Вы уверены, что хотите удалить {{ deletingTest.title || '' }}?
    </div>

    <div class="mt-3 ml-auto flex justify-end flex-row gap-x-4">
      <v-btn
        :is-loading="isLoading"
        @click="deleteTestModal.close()"
      >
        Отменить
      </v-btn>

      <v-btn
        type="error"
        :is-loading="isLoading"
        @click="deleteTest"
      >
        Удалить
      </v-btn>
    </div>
  </v-modal>
  <upsert-test-modal
    ref="upsert-test-modal"
    :editing-test-id="editingTestId"
  />
</template>

<script setup>
import draggable from 'vuedraggable'
import EyeClosedIcon from '@/components/icons/EyeClosedIcon.vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import {useTestStore} from '@/stores/testStore.js'
import { nextTick, ref, useTemplateRef } from 'vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import VModal from '@/components/shared/VModal.vue'
import PencilIcon from '@/components/icons/PencilIcon.vue'
import UpsertTestModal from '@/components/UpsertTestModal.vue'

const testStore = useTestStore()

const editingTestId = ref(0)
const upsertTestModalRef = useTemplateRef('upsert-test-modal')

async function showUpsertTestModal (id) {
  editingTestId.value = id
  await nextTick()
  upsertTestModalRef.value.open()
}

function change ({ moved }) {
  testStore.updateOrder({
    id: moved.element.id,
    newPosition: moved.newIndex,
    oldPosition: moved.oldIndex,
  })
}

const deletingTest = ref(null)
const deleteTestModal = useTemplateRef('delete-test-modal')
async function showDeleteModal (test) {
  deletingTest.value = test
  await nextTick()
  deleteTestModal.value.show()
}

const isLoading = ref(false)
function deleteTest () {
  isLoading.value = true
  testStore.deleteTest(deletingTest.value.id)
      .then(() => {
        deleteTestModal.value.close()
      })
      .catch((err) => { })
      .finally(() => {
        isLoading.value = false
      })
}
</script>
