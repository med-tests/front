import { defineAsyncComponent } from 'vue'

export const toolTipPlugin = (app) => {
  app.component(
    'ToolTip',
    defineAsyncComponent(() => import('@/plugins/ToolTipPlugin/ToolTip.vue')),
  )
}
