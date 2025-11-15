<template>
  <div>
    <!--  Заголовок и кнопка добавить  -->
    <div class="flex justify-between mb-3">
      <h5 class="text-xl text-gray-700">
        {{ title }}
      </h5>
      <v-btn
        style="height: 24px;"
        title="Добавить результат"
        type="success"
        @click="addFieldForNewResult"
      >
        <div class="flex justify-center items-center h-full">
          <PlusIcon
            height="16px"
            width="16px"
          />
        </div>
      </v-btn>
    </div>

    <!--  Названия колонок  -->
    <div
      class="mb-2 flex justify-between"
      :style="hideDelete ? 'width: 100%;' : 'width: calc(100% - 30px);'"
    >
      <div
        v-for="(field, fieldKey) in fieldsSettings"
        :key="`label-${fieldKey}`"
        class="w-1/2 required"
      >
        {{ field.label }}
      </div>
    </div>

    <!--  Поля ввода  -->
    <div
      v-for="(row, rowIndex) in data"
      :key="`row-${rowIndex}`"
      class="flex justify-between items-center gap-x-4 mb-2"
    >
      <template v-if="!row.isHidden">
        <div
          v-for="(field, fieldKey) in fieldsSettings"
          :key="`row-${rowIndex}-${fieldKey}`"
        >
          <VInput
            v-if="['text', 'number'].includes(field.type)"
            :id="`${fieldKey}-${field.type || 'text'}-row-${rowIndex}`"
            v-model="data[rowIndex][fieldKey].value"
            class="grow"
            :callback-validator="field.validator"
            :hide-close-icon="field.hideCloseIcon"
            :placeholder="field.placeholder"
            :required="field.required"
            :touch-id="touchId"
            :type="field.type || 'text'"
            @on-validate="data[rowIndex][fieldKey].error = !$event"
          />
          <v-calendar
            v-if="field.type === 'calendar'"
            class="grow"
            :callback-validator="field.validator"
            :hide-close-icon="field.hideInputCloseIcon"
            :required="field.required"
            :selected-dates="data[rowIndex][fieldKey].value"
            :touch-id="touchId"
            :uniq-id="`${rowIndex}-${fieldKey}-calendar`"
            @clear="data[rowIndex][fieldKey].value = ''"
            @input="data[rowIndex][fieldKey].value = $event"
            @on-validate="data[rowIndex][fieldKey].error = !$event"
          />
        </div>
        <v-btn
          v-if="!hideDelete"
          not-bordered
          not-filling
          title="Удалить"
          type="error"
          @click="deleteRow(rowIndex)"
        >
          <CloseIcon
            height="20px"
            width="20px"
          />
        </v-btn>
      </template>
    </div>
  </div>
</template>

<script setup>
import VInput from '@/components/shared/VInput.vue'
import { ref, watch } from 'vue'
import PlusIcon from '@/components/icons/PlusIcon.vue'
import VBtn from '@/components/shared/VBtn/index.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import VCalendar from '@/components/shared/VCalendar.vue'

const props = defineProps({
  title: { type: String, default: '' },
  touchId: { type: String, default: '' },
  fieldsSettings: { type: Object, required: true },
  hideDelete: { type: Boolean, default: false },
  data: { type: Array, default: () => ([]) },
})

const data = ref(props.data.map(item => ({ ...item, isHidden: false })))

if (!data.value.length) {
  addFieldForNewResult()
}

const emit = defineEmits(['onChange', 'deleteRow'])

watch(
  data,
  () => {
    emit('onChange', data.value)
  },
  {
    deep: true,
    immediate: true,
  },
)

function addFieldForNewResult () {
  data.value.unshift({})
  Object.entries(props.fieldsSettings)
    .forEach(([fieldKey, fieldValue]) => {
      const item = { error: false, value: '' }

      if (Object.hasOwn(fieldValue, 'defaultValue')) {
        item.value = fieldValue.defaultValue
      }

      data.value[0][fieldKey] = item
    })
}

function deleteRow (index) {
  emit('deleteRow', data.value[index])
  data.value[index].isHidden = true
}

</script>
