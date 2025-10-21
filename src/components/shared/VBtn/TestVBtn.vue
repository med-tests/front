<template>
  <div
    class="mx-auto bg-white p-2 mb-4"
    style="width: 1400px;"
  >
    <div class="flex gap-2 mb-3">
      <div>активные текстовые кнопки без заливки</div>
      <v-btn
        title="Показать"
        :filling="false"
        @click="console.log(123)"
      >
        default
      </v-btn>

      <v-btn
        title="Показать"
        type="success"
        :filling="false"
        @click="console.log(123)"
      >
        success
      </v-btn>

      <v-btn
        title="Показать"
        type="error"
        :filling="false"
        @click="console.log(123)"
      >
        error
      </v-btn>
    </div>

    <div class="flex gap-2 mb-3">
      <div>активные кнопки-иконки без заливки</div>
      <v-btn
        title="Показать"
        :filling="false"
        @click="console.log(123)"
      >
        <EyeIcon />
      </v-btn>

      <v-btn
        title="Показать"
        type="success"
        :filling="false"
        @click="console.log(123)"
      >
        <EyeIcon />
      </v-btn>

      <v-btn
        title="Показать"
        type="error"
        :filling="false"
        @click="console.log(123)"
      >
        <EyeIcon />
      </v-btn>
    </div>

    <div class="flex gap-2 mb-3">
      <div>активные текстовые кнопки c заливкой</div>
      <v-btn
        bordered
        filling
        title="Показать"
        @click="console.log(123)"
      >
        default
      </v-btn>

      <v-btn
        bordered
        filling
        title="Показать"
        type="success"
        @click="console.log(123)"
      >
        success
      </v-btn>

      <v-btn
        bordered
        filling
        title="Показать"
        type="error"
        @click="console.log(123)"
      >
        error
      </v-btn>
    </div>

    <div class="flex gap-2 mb-3">
      <div>активные кнопки-иконки c заливкой</div>
      <v-btn
        bordered
        filling
        title="Показать"
        @click="console.log(123)"
      >
        <EyeIcon />
      </v-btn>

      <v-btn
        bordered
        filling
        title="Показать"
        type="success"
        @click="console.log(123)"
      >
        <EyeIcon />
      </v-btn>

      <v-btn
        bordered
        filling
        title="Показать"
        type="error"
        @click="console.log(123)"
      >
        <EyeIcon />
      </v-btn>
    </div>

    <div class="flex gap-2 mb-3">
      <div>disabled текстовые кнопки без заливки</div>
      <v-btn
        disabled
        title="Показать"
        :filling="false"
        @click="console.log(123)"
      >
        default
      </v-btn>

      <v-btn
        disabled
        title="Показать"
        type="success"
        :filling="false"
        @click="console.log(123)"
      >
        success
      </v-btn>

      <v-btn
        disabled
        title="Показать"
        type="error"
        :filling="false"
        @click="console.log(123)"
      >
        error
      </v-btn>
    </div>

    <div class="flex gap-2 mb-3">
      <div>disabled кнопки-иконки без заливки</div>
      <v-btn
        disabled
        title="Показать"
        :filling="false"
        @click="console.log(123)"
      >
        <EyeIcon />
      </v-btn>

      <v-btn
        disabled
        title="Показать"
        type="success"
        :filling="false"
        @click="console.log(123)"
      >
        <EyeIcon />
      </v-btn>

      <v-btn
        disabled
        title="Показать"
        type="error"
        :filling="false"
        @click="console.log(123)"
      >
        <EyeIcon />
      </v-btn>
    </div>

    <div class="flex gap-2 mb-3">
      <div>disabled текстовые кнопки c заливкой</div>
      <v-btn
        disabled
        title="Показать"
        @click="console.log(123)"
      >
        default
      </v-btn>

      <v-btn
        disabled
        title="Показать"
        type="success"
        @click="console.log(123)"
      >
        success
      </v-btn>

      <v-btn
        disabled
        title="Показать"
        type="error"
        @click="console.log(123)"
      >
        error
      </v-btn>
    </div>

    <div class="flex gap-2 mb-3">
      <div>disabled кнопки-иконки с заливкой</div>
      <v-btn
        disabled
        title="Показать"
        @click="console.log(123)"
      >
        <EyeIcon />
      </v-btn>

      <v-btn
        disabled
        title="Показать"
        type="success"
        @click="console.log(123)"
      >
        <EyeIcon />
      </v-btn>

      <v-btn
        disabled
        title="Показать"
        type="error"
        @click="console.log(123)"
      >
        <EyeIcon />
      </v-btn>
    </div>
  </div>
</template>
<script setup>
import VBtn from '@/components/shared/VBtn/VBtn.vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
</script>
