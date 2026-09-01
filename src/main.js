import 'vue3-select-component/styles'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router.js'
import { toolTipPlugin } from '@/plugins'
import AppBtn from '@/components/shared/AppBtn'
import { clickOutside, focus } from '@/directives'

import App from './App.vue'

createApp(App)
  .use(router)
  .use(toolTipPlugin)
  .use(clickOutside)
  .use(focus)
  .use(createPinia())
  .component('AppBtn', AppBtn)
  .mount('#app')
