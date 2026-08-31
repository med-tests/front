<template>
  <div>
    <!--  Заголовок и кнопка добавить  -->
    <div class="flex justify-between mb-2">
      <h5 class="text-lg text-gray-700">
        {{ title }}
      </h5>
      <AppBtn
        style="height: 24px;"
        title="Добавить результат"
        type="success"
        @click="addFieldForNewResult"
      >
        <div class="flex justify-center items-center h-full">
          <PlusIcon width="16" />
        </div>
      </AppBtn>
    </div>

    <!--  Названия колонок  -->
    <div
      v-if="!data.every(({ isHidden }) => isHidden)"
      class="mb-2 flex justify-between"
      :style="hideDelete ? 'width: 100%;' : 'width: calc(100% - 30px);'"
    >
      <div
        v-for="(field, fieldKey) in fieldsSettings"
        :key="`label-${fieldKey}`"
        class="w-1/2"
        :class="{
          'required': field.required
        }"
      >
        {{ field.label }}
      </div>
    </div>

    <!--  Поля ввода  -->
    <template
      v-for="(row, rowIndex) in data"
      :key="`row-${rowIndex}`"
    >
      <div
        v-if="!row.isHidden"
        class="flex justify-between items-center gap-x-4 mb-2 item-hover rounded"
      >
        <AppFormField
          v-for="(field, fieldKey) in fieldsSettings"
          :id="`${fieldKey}-${field.type || 'text'}-row-${rowIndex}`"
          :key="`row-${rowIndex}-${fieldKey}`"
          v-model="data[rowIndex][fieldKey].value"
          class="grow"
          :callback-validator="field.validator"
          :disabled
          :hide-close-icon="field.hideCloseIcon"
          :max-date="field.maxDate ? field.maxDate() : null"
          :min-date="field.minDate ? field.minDate() : null"
          :placeholder="field.placeholder"
          :required="field.required"
          :selected-dates="data[rowIndex][fieldKey].value"
          :touch-id="touchId"
          :type="field.type"
          @on-validate="data[rowIndex][fieldKey].error = !$event"
        />
        <AppBtn
          v-if="!hideDelete"
          not-bordered
          not-filling
          title="Удалить"
          type="error"
          :disabled
          @click="deleteRow(rowIndex)"
        >
          <CloseIcon
            height="20px"
            width="20px"
          />
        </AppBtn>
      </div>
    </template>
  </div>
</template>

<script setup>
import AppFormField from '@/components/shared/inputs/AppFormField'
import { ref, watch } from 'vue'
import PlusIcon from '@/components/icons/PlusIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'

const props = defineProps({
  title: { type: String, default: '' },
  touchId: { type: String, default: '' },
  fieldsSettings: { type: Object, required: true },
  hideDelete: { type: Boolean, default: false },
  data: { type: Array, default: () => ([]) },
  addNewRowIfEmpty: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const data = ref(props.data.map(item => ({ ...item, isHidden: false })))

if (props.addNewRowIfEmpty && !data.value.length) {
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

<style>
.required::after {
  content: '*';
  color: red;
}
</style>
