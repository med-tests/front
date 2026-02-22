import 'vue3-select-component/styles'
import './assets/main.css'

import { createApp } from 'vue'
import {createPinia} from 'pinia'
import router from '@/router.js'
import { toolTipPlugin } from '@/plugins'
import VBtn from '@/components/shared/VBtn.vue'

import App from './App.vue'

createApp(App)
  .use(router)
  .use(toolTipPlugin)
  .use(createPinia())
  .component('VBtn', VBtn)
  .mount('#app')
