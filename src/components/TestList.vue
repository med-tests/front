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
          class="py-2 flex border-emerald-800 hover:bg-emerald-600/15"
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
            <VBtn
              not-bordered
              not-filling
              :disabled="loading.editTest"
              :title="element.isHidden ? 'Показать' : 'Скрыть'"
              @click="testStore.changeTest(element.id, { isHidden: element.isHidden ? 0 : 1 })"
            >
              <EyeClosedIcon v-if="element.isHidden" />
              <EyeIcon v-else />
            </VBtn>

            <VBtn
              not-bordered
              not-filling
              title="Редактировать"
              :disabled="loading.editTest"
              @click="showUpsertTestModal(element.id)"
            >
              <PencilIcon
                height="17"
                width="17"
              />
            </VBtn>

            <VBtn
              not-bordered
              not-filling
              title="Удалить"
              type="error"
              :disabled="loading.editTest"
              @click="showDeleteModal(element)"
            >
              <CloseIcon />
            </VBtn>
          </div>
        </div>
      </template>
    </draggable>
  </div>

  <VModal
    ref="delete-test-modal"
    @on-close="deletingTest = null"
  >
    <div style="min-width: 380px;">
      <div class="mt-3 text-center my-2 text-lg">
        Вы уверены, что хотите удалить "{{ deletingTest.title || '' }}"?
      </div>

      <div class="mt-3 ml-auto flex justify-end flex-row gap-x-4">
        <VBtn
          :is-loading="loading.deleteTest"
          @click="deleteTestModal.close()"
        >
          <span class="px-3">Отменить</span>
        </VBtn>

        <VBtn
          type="error"
          :is-loading="loading.deleteTest"
          @click="deleteTest"
        >
          <span class="px-2">Удалить</span>
        </VBtn>
      </div>
    </div>
  </VModal>
  <UpsertTestModal
    ref="upsert-test-modal"
    :editing-test-id="editingTestId"
  />
</template>

<script setup>
import draggable from 'vuedraggable'
import EyeClosedIcon from '@/components/icons/EyeClosedIcon.vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import {useTestStore} from '@/stores/testStore.js'
import {nextTick, ref, useTemplateRef} from 'vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import VModal from '@/components/shared/VModal.vue'
import PencilIcon from '@/components/icons/PencilIcon.vue'
import UpsertTestModal from '@/components/UpsertTestModal.vue'
import {useLoadingStore} from '@/stores/loadingStore.js'

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

const { loading } = useLoadingStore()

function deleteTest () {
  testStore.deleteTest(deletingTest.value.id)
      .then(() => {
        deleteTestModal.value.close()
      })
      .catch((err) => { })
}
</script>
