<template>
  <AppContextMenu
    :arr-items="contextMenuList"
    @click="onContextMenuClick"
  >
    <template #toggler>
      <div class="flex">
        <AppBtn
          not-bordered
          not-filling
          type="success"
          :disabled="loading.getParams"
        >
          <PlusIcon
            width="20"
            :line-width="4"
          />
        </AppBtn>
      </div>
    </template>
  </AppContextMenu>
</template>

<script setup>
import AppContextMenu from '@/components/shared/AppContextMenu'
import PlusIcon from '@/components/icons/PlusIcon'
import { storeToRefs } from 'pinia'
import { useApiStore } from '@/stores/apiStore.js'

const emit = defineEmits(['openCreateModal'])

const { loading } = storeToRefs(useApiStore())

const contextMenuList = [
  { title: 'Создать показатель', event: 'createParameter' },
]

function onContextMenuClick (eventName) {
  switch (eventName) {
    case 'createParameter':
      emit('openCreateModal')
      break
    default:
      console.log('Не указан обработчик для действия: ', eventName)
  }
}
</script>