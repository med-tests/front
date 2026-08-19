import { config } from '@vue/test-utils'

// Перехват Vue warn, чтобы падала ошибка в тестах
config.global.config.warnHandler = (msg) => {
  console.error(msg)
  throw new Error(msg)
}