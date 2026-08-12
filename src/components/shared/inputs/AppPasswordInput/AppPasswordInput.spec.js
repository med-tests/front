import AppPasswordInput from '@/components/shared/inputs/AppPasswordInput'
import { flushPromises, mount } from '@vue/test-utils'
import AppBtn from '@/components/shared/AppBtn'
import { toolTipPlugin } from '@/plugins'
import { input as inputClasses } from '@/assets/vars.js'
import { nextTick } from 'vue'

const defaultPlaceholder = 'Введите пароль'
const {
  defaultBorderClass,
  invalidBorderClass,
  disabledBorderClass,
  disabledBgClass,
} = inputClasses

const inputSelector = 'input[data-test="app-password-input"]'
const toggleStarring = '[data-test="app-password-input__toggle-star"]'
const updateEvt = 'update:modelValue'

describe('общее', () => {
  it('корректно рендерится без пропсов (дефолтное состояние)', () => {
    const wrp = getWrapper({
      global: {
        components: { AppBtn },
        plugins: [toolTipPlugin],
      },
    })
    const inputWrp =  wrp.find(inputSelector)

    expect(wrp.exists()).toBe(true)
    expect(inputWrp.exists()).toBe(true)
    expect(wrp.find(toggleStarring).exists()).toBe(true)
  })
  it('по умолчанию инпут доступен для ввода', async () => {
    const wrp = getWrapper()
    const inputWrp = wrp.find(inputSelector)

    expect(wrp.props('disabled')).toBe(false)
    expect(inputWrp.attributes('disabled')).toBe(undefined)

    const text = 'ситуация'
    await inputWrp.setValue(text)

    expect(inputWrp.element.value).toBe(text)
    expect(wrp.emitted()).toHaveProperty('update:modelValue')
    expect(wrp.emitted('update:modelValue')).toHaveLength(1)
    expect(wrp.emitted('update:modelValue')[0][0]).toBe(text)
  })
  it('выставлены корректные дефолтные значения пропсов', () => {
    const wrp = getWrapper()

    expect(wrp.props()).toMatchObject({
      autocomplete: 'current-password',
      modelValue: '',
      placeholder: defaultPlaceholder,
      disabled: false,
      isInvalid: false,
    })
  })
  it('цвет бордера меняется в зависимости от isInvalid', async () => {
    const wrp = getWrapper({
      props: { isInvalid: false },
    })
    const inputWrp = wrp.find(inputSelector)

    expect(inputWrp.classes()).toContain(defaultBorderClass)
    expect(inputWrp.classes()).not.toContain(invalidBorderClass)

    await wrp.setProps({ isInvalid: true })

    expect(inputWrp.classes()).toContain(invalidBorderClass)
    expect(inputWrp.classes()).not.toContain(defaultBorderClass)
  })
  it('показ/скрытие пароля', async () => {
    const tippyDelay = 150
    vi.useFakeTimers()

    const password = 'password'
    const wrp = getWrapper({
      props: { modalValue: password },
      global: {
        components: {
          AppBtn,
        },
        plugins: [toolTipPlugin],
      },
      attachTo: document.body,
    })
    const inputWrp = wrp.find(inputSelector)
    await vi.dynamicImportSettled()

    const toggleStarringWrp = wrp.find(toggleStarring)

    const starred = {
      icon: '[data-test="app-password-input__eye"]',
      tooltip: 'Показать',
      type: 'password',
    }

    const shown = {
      icon: '[data-test="app-password-input__closed-eye"]',
      tooltip: 'Скрыть',
      type: 'text',
    }

    expect(wrp.find(starred.icon).exists()).toBe(true)
    expect(wrp.find(shown.icon).exists()).toBe(false)
    expect(inputWrp.attributes('type')).toBe(starred.type)
    await toggleStarringWrp.trigger('mouseenter')
    vi.advanceTimersByTime(tippyDelay)
    await flushPromises()
    expect(wrp.find('.tippy-content').exists()).toBe(true)
    expect(wrp.find('.tippy-content').html()).toContain(starred.tooltip)

    await toggleStarringWrp.trigger('click')

    expect(wrp.find(shown.icon).exists()).toBe(true)
    expect(wrp.find(starred.icon).exists()).toBe(false)
    expect(inputWrp.attributes('type')).toBe(shown.type)
    await toggleStarringWrp.trigger('mouseenter')
    vi.advanceTimersByTime(tippyDelay)
    expect(wrp.find('.tippy-content').exists()).toBe(true)
    expect(wrp.find('.tippy-content').html()).toContain(shown.tooltip)

    vi.useRealTimers()
  })
})

describe('обработка значения', () => {
  it('отображает начальное значение modelValue', () => {
    const modelValueText = 'пу-пу-пу'
    const wrp = getWrapper({
      props: { modelValue: modelValueText },
    })
    expect(wrp.find(inputSelector).element.value).toBe(modelValueText)
    expect(wrp.emitted()).not.toHaveProperty(updateEvt)
  })
  it('обновляет отображение при внешнем изменении modelValue', async () => {
    const wrp = getWrapper()
    const inputWrp = wrp.find(inputSelector)

    expect(inputWrp.element.value).toBe('')

    const newText = '123'
    await wrp.setProps({ modelValue: newText })

    expect(inputWrp.element.value).toBe(newText)
  })
  it('эмитит update:modelValue при вводе', async () => {
    const wrp = getWrapper()
    const inputWrp = wrp.find(inputSelector)

    const inputText = 'la-la-la'
    await inputWrp.setValue(inputText)

    expect(wrp.emitted()).toHaveProperty('update:modelValue')
    expect(wrp.emitted('update:modelValue')).toHaveLength(1)
    expect(wrp.emitted('update:modelValue')[0][0]).toBe(inputText)

    const inputTextNext = 'la-la-la-1'
    await inputWrp.setValue(inputTextNext)

    expect(wrp.emitted()).toHaveProperty('update:modelValue')
    expect(wrp.emitted('update:modelValue')).toHaveLength(2)
    expect(wrp.emitted('update:modelValue')[1][0]).toBe(inputTextNext)
  })
})

describe('плейсходер', () => {
  it('корректный по умолчанию', () => {
    const inputWrp = getWrapper().find(inputSelector)

    expect(inputWrp.attributes('placeholder')).toBe(defaultPlaceholder)
    expect(inputWrp.element.placeholder).toBe(defaultPlaceholder)
  })
  it('корректный кастомный', () => {
    const customText = 'кастомный текст'
    const inputWrp = getWrapper({
      props: {
        placeholder: customText,
      },
    }).find(inputSelector)

    expect(inputWrp.attributes('placeholder')).toBe(customText)
    expect(inputWrp.element.placeholder).toBe(customText)
  })
})

describe('disabled', () => {
  it('ввод заблокирован', async () => {
    const wrp = getWrapper({
      props: { disabled: true },
    })
    const inputWrp = wrp.find(inputSelector)

    expect(inputWrp.attributes()).toHaveProperty('disabled')

    const someText = 'abc'
    await inputWrp.setValue(someText)

    expect(wrp.emitted(updateEvt)).toBeUndefined()
  })
  it('нельзя изменить дефолтное значение вводом', async () => {
    const initText = 'some password'
    const wrp = getWrapper({
      props: {
        disabled: true,
        modelValue: initText,
      },
    })
    const inputWrp = wrp.find(inputSelector)

    expect(inputWrp.attributes()).toHaveProperty('disabled')
    expect(inputWrp.element.value).toBe(initText)

    const newText = 'newText'
    await inputWrp.setValue(newText)
    await nextTick()

    expect(wrp.emitted(updateEvt)).toBeUndefined()
  })
  it('инпут имеет корректные стили', () => {
    const inputWrp = getWrapper({
      props: { disabled: true },
    }).find(inputSelector)

    expect(inputWrp.classes()).toContain(disabledBorderClass)
    expect(inputWrp.classes()).toContain(disabledBgClass)
    expect(inputWrp.classes()).not.toContain(defaultBorderClass)
    expect(inputWrp.classes()).not.toContain(invalidBorderClass)
  })
})

function getWrapper (options = {}) {
  return mount(AppPasswordInput, {
    global: {
      stubs: {
        AppBtn: true,
      },
    },
    ...options,
  })
}