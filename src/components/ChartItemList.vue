<template>
  <div
    class="overflow-x-auto"
    style="max-height: calc(100% - 40px);"
  >
    <draggable
      class="pr-3"
      group="items"
      item-key="id"
      :list="arrListData"
      @change="change"
    >
      <template #item="{element, index}">
        <div
          class="p-2 flex border-emerald-800 hover:bg-emerald-600/15"
          :class="{
            'border-b-1': index !== arrListData.length - 1,
            'opacity-60': element.isHidden
          }"
        >
          <a
            class="pr-1 cursor-pointer text-lg text-gray-600 hover:text-gray-900"
            :href="`#chart-${element.id}`"
          >
            {{ element.title }}
          </a>

          <div class="ml-auto pl-3 flex gap-x-1">
            <AppBtn
              not-bordered
              not-filling
              :disabled="loading.editParameter"
              :title="element.isHidden ? 'Показать' : 'Скрыть'"
              @click="changeParameter(element.id, { isHidden: element.isHidden ? 0 : 1 })"
            >
              <EyeClosedIcon v-if="element.isHidden" />
              <EyeIcon v-else />
            </AppBtn>

            <AppBtn
              not-bordered
              not-filling
              title="Редактировать"
              :disabled="loading.editParameter"
              @click="showUpsertParamModal(element.id)"
            >
              <PencilIcon
                height="17"
                width="17"
              />
            </AppBtn>

            <AppBtn
              not-bordered
              not-filling
              title="Удалить"
              type="error"
              :disabled="loading.editParameter"
              @click="showDeleteModal(element)"
            >
              <CloseIcon />
            </AppBtn>
          </div>
        </div>
      </template>
    </draggable>
  </div>

  <AppModal
    ref="delete-param-modal"
    @on-close="deletingParameter = null"
  >
    <div style="min-width: 380px;">
      <div class="mt-3 text-center my-2 text-lg">
        Вы уверены, что хотите удалить "{{ deletingParameter.title || '' }}"?
      </div>

      <div class="mt-3 ml-auto flex justify-end flex-row gap-x-4">
        <AppBtn
          :is-loading="loading.deleteParameter"
          @click="deleteParamModal.close()"
        >
          <span class="px-3">Отменить</span>
        </AppBtn>

        <AppBtn
          type="error"
          :is-loading="loading.deleteParameter"
          @click="deleteParam"
        >
          <span class="px-2">Удалить</span>
        </AppBtn>
      </div>
    </div>
  </AppModal>
  <UpsertParamModal
    ref="upsert-param-modal"
    :editing-param-id="editingParamId"
  />
</template>

<script setup>
import draggable from 'vuedraggable'
import EyeClosedIcon from '@/components/icons/EyeClosedIcon.vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import { useTestStore } from '@/stores/testStore.js'
import { nextTick, ref, useTemplateRef } from 'vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import AppModal from '@/components/shared/AppModal.vue'
import PencilIcon from '@/components/icons/PencilIcon.vue'
import UpsertParamModal from '@/components/UpsertParamModal.vue'
import { storeToRefs } from 'pinia'
import { useApiStore } from '@/stores/apiStore.js'

const testStore = useTestStore()
const { arrListData } = storeToRefs(testStore)
const { changeParameter, updateOrder, deleteParameter } = testStore

const editingParamId = ref(0)
const upsertParamModalRef = useTemplateRef('upsert-param-modal')

async function showUpsertParamModal (id) {
  editingParamId.value = id
  await nextTick()
  upsertParamModalRef.value.open()
}

function change ({ moved }) {
  updateOrder({
    id: moved.element.id,
    newPosition: moved.newIndex,
    oldPosition: moved.oldIndex,
  })
}

const deletingParameter = ref(null)
const deleteParamModal = useTemplateRef('delete-param-modal')
async function showDeleteModal (param) {
  deletingParameter.value = param
  await nextTick()
  deleteParamModal.value.show()
}

const { loading } = storeToRefs(useApiStore())

function deleteParam () {
  deleteParameter(deletingParameter.value.id, deletingParameter.value.title)
      .then(() => {
        deleteParamModal.value.close()
      })
}
</script>
