import AppTextInput from '@/components/shared/inputs/AppTextInput/index.vue'
import { mount } from '@vue/test-utils'
import AppBtn from '@/components/shared/AppBtn/index.vue'
import { toolTipPlugin } from '@/plugins/index.js'
import { input as inputClasses } from '@/assets/vars.js'

const defaultPlaceholder = 'Введите значение'
const {
  defaultBorderClass,
  invalidBorderClass,
  disabledBorderClass,
  disabledBgClass,
  clearBtnOffsetClass,
} = inputClasses

const inputSelector = 'input[data-test="app-text-input"]'
const clearBtnSelector = '[data-test="app-text-input__clear-btn"]'

describe('общее', () => {
  it('корректно рендерится без пропсов (дефолтное состояние)', () => {
    const wrp = getWrapper()
    const inputWrp =  wrp.find(inputSelector)

    expect(inputWrp.exists()).toBeTruthy()
  })
  it('по умолчанию инпут доступен для ввода', async () => {
    const wrp = getWrapper()
    const inputWrp = wrp.find(inputSelector)

    expect(wrp.props('disabled')).toBe(false)
    expect(inputWrp.attributes('disabled')).toBe(undefined)

    const text = 'ситуация'
    await inputWrp.setValue(text)

    expect(inputWrp.element.value).toBe(text)
  })
  it('выставлены корректные дефолтные значения пропсов', () => {
    const wrp = getWrapper({
      global: {
        stubs: {
          ToolTip: true,
          AppBtn: true,
        },
      },
    })

    expect(wrp.props()).toMatchObject({
      modelValue: '',
      placeholder: defaultPlaceholder,
      disabled: false,
      hideCloseIcon: false,
      isInvalid: false,
    })
  })
  it('инпут компоненты имеет текстовый тип', () => {
    const inputWrp = getWrapper().find(inputSelector)

    expect(inputWrp.attributes('type')).toBe('text')
  })
  it('генерирует уникальный id, если не передан', () => {
    const wrp = getWrapper()
    const wrpId = wrp.props().id

    const anotherWrp = getWrapper()
    const anotherWrpId = anotherWrp.props().id

    expect(wrpId.length).greaterThan(0)
    expect(anotherWrpId.length).greaterThan(0)
    expect(anotherWrpId).not.toBe(wrpId)
  })
  it('имеет autocomplete="off" (для отключения автозаполнения)', () => {
    const inputWrp = getWrapper().find(inputSelector)

    expect(inputWrp.attributes()).toHaveProperty('autocomplete')
    expect(inputWrp.attributes('autocomplete')).toBe('off')
  })
  it('цвет бордера меняется в зависимости от isInvalid', async () => {
    const wrp = getWrapper({
      props: {
        isInvalid: false,
      },
    })
    const inputWrp = wrp.find(inputSelector)

    expect(inputWrp.classes()).toContain(defaultBorderClass)
    expect(inputWrp.classes()).not.toContain(invalidBorderClass)

    await wrp.setProps({
      isInvalid: true,
    })

    expect(inputWrp.classes()).toContain(invalidBorderClass)
    expect(inputWrp.classes()).not.toContain(defaultBorderClass)
  })
})

describe('обработка значения', () => {
  it('отображает начальное значение modelValue', () => {
    const modelValueText = 'пу-пу-пу'
    const wrp = getWrapper({
      props: {
        modelValue: modelValueText,
      },
    })
    expect(wrp.find(inputSelector).element.value).toBe(modelValueText)
  })
  it('обновляет отображение при внешнем изменении modelValue', async () => {
    const wrp = getWrapper()
    const inputWrp = wrp.find(inputSelector)

    expect(inputWrp.element.value).toBe('')

    const newText = '123'
    await wrp.setProps({
      modelValue: newText,
    })

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

describe('кнопка очистки ввода', () => {
  it('не рендерится, если hideCloseIcon=true (и disabled=false)', () => {
    const wrp = getWrapper({
      props: {
        hideCloseIcon: true,
      },
    })

    expect(wrp.find(clearBtnSelector).exists()).toBe(false)
  })
  it('кнопка очистки ввода не рендериться, если hideCloseIcon=true и disabled=true одновременно', () => {
    const wrp = getWrapper({
      props: {
        disabled: true,
        hideCloseIcon: true,
      },
    })

    expect(wrp.find(clearBtnSelector).exists()).toBe(false)
  })
  it('рендерится, если hideCloseIcon=false', () => {
    const wrp = getWrapper({
      props: {
        hideCloseIcon: false,
      },
    })

    expect(wrp.find(clearBtnSelector).exists()).toBe(true)
  })
  it('имеет корректный тултип', async () => {
    const clearBtnText = 'Очистить'
    const wrp = getWrapper({
      props: {
        hideCloseIcon: false,
      },
    })
    const clearBtnWrp = wrp.find(clearBtnSelector)

    await vi.dynamicImportSettled()
    vi.useFakeTimers()
    await clearBtnWrp.trigger('mouseenter')

    const tippyDelay = 50
    vi.advanceTimersByTime(tippyDelay)

    expect(wrp.find('.tippy-content').exists()).toBe(true)
    expect(wrp.find('.tippy-content').html()).toContain(clearBtnText)
  })
  it('инпут имеет отступ под кнопку', () => {
    const inputWrp = getWrapper({
      props: { hideCloseIcon: false },
    }).find(inputSelector)

    expect(inputWrp.classes()).toContain(clearBtnOffsetClass)
  })
  it('при клике на кнопку сбрасывается значение инпута', async () => {
    const wrp = getWrapper({
      props: {
        hideCloseIcon: false,
        modelValue: '123',
      },
    })

    await wrp.find(clearBtnSelector).trigger('click')

    expect(wrp.emitted()).toHaveProperty('update:modelValue')
    expect(wrp.emitted('update:modelValue')).toHaveLength(1)
    expect(wrp.emitted('update:modelValue')[0][0]).toBe('')

    // тк привязка v-model, нужно, чтобы родитель обновил значение
    await wrp.setProps({ modelValue: '' })
    expect(wrp.find(inputSelector).element.value).toBe('')
  })
  it('фокусируется на инпуте после очистки', async () => {
    const wrp = getWrapper()
    const inputEl = wrp.find(inputSelector).element

    document.body.focus()
    expect(document.activeElement).not.toBe(inputEl)

    await wrp.find(clearBtnSelector).trigger('click')

    expect(document.activeElement).toBe(inputEl)
  })
})

// состояния
describe('disabled', () => {
  describe('disabled=true', () => {
    it('корректные стили инпута', () => {
      const inputWrp = getWrapper({
        props: {
          disabled: true,
        },
      }).find(inputSelector)

      expect(inputWrp.classes()).toContain(disabledBgClass)
      expect(inputWrp.classes()).toContain(disabledBorderClass)
      expect(inputWrp.classes()).not.toContain(defaultBorderClass)
      expect(inputWrp.classes()).not.toContain(invalidBorderClass)
    })
    it('инпут имеет атрибут disabled', () => {
      const inputWrp = getWrapper({
        props: { disabled: true },
      }).find(inputSelector)

      expect(inputWrp.attributes()).toHaveProperty('disabled')
    })
    it('не позволяет менять начальное значение', async () => {
      const text = 'initial'
      const wrp = getWrapper({
        props: {
          disabled: true,
          modelValue: text,
        },
      })
      const inputWrp = wrp.find(inputSelector)

      expect(inputWrp.element.value).toBe(text)

      const anotherText = 'new text'
      await inputWrp.setValue(anotherText)

      // проверять inputWrp.element.value бессмысленно, так как value меняется
      // программно и потом не сбрасывается до modelValue в компьютеде
      expect(wrp.emitted()).not.toHaveProperty('update:modelValue')
      expect(wrp.props('modelValue')).toBe(text)
    })
    it('не позволяет менять раннее введенное значение', async () => {
      const wrp = getWrapper()
      const inputWrp = wrp.find(inputSelector)
      const text = 'initial'

      await inputWrp.setValue(text)

      expect(wrp.emitted()).toHaveProperty('update:modelValue')
      expect(wrp.emitted('update:modelValue')).toHaveLength(1)
      expect(wrp.emitted('update:modelValue')[0][0]).toBe(text)

      await wrp.setProps({ disabled: true })
      const newText = 'new text'
      await inputWrp.setValue(newText)

      expect(wrp.emitted()).toHaveProperty('update:modelValue')
      expect(wrp.emitted('update:modelValue')).toHaveLength(1)
    })
    it('не рендерится кнопка очистки ввода и место под нее', () => {
      const wrp = getWrapper({
        props: { disabled: true },
      })

      expect(wrp.find(inputSelector).classes()).not.toContain(clearBtnOffsetClass)
      expect(wrp.find(clearBtnSelector).exists()).toBe(false)
    })
    it('не эмитит update:modelValue', async () => {
      const wrp = getWrapper({
        props: { disabled: true },
      })
      const inputWrp = wrp.find(inputSelector)

      const inputText = 'la-la-la'
      await inputWrp.setValue(inputText)

      expect(wrp.emitted()).not.toHaveProperty('update:modelValue')
    })
  })

  describe('disabled=false (false по умолчанию)', () => {
    it('корректные стили инпута', () => {
      const inputWrp = getWrapper().find(inputSelector)

      expect(inputWrp.classes()).not.toContain(disabledBgClass)
      expect(inputWrp.classes()).toContain(defaultBorderClass)
      expect(inputWrp.classes()).not.toContain(invalidBorderClass)
      expect(inputWrp.classes()).not.toContain(disabledBorderClass)
    })
    it('инпут не имеет атрибут disabled', () => {
      const inputWrp = getWrapper().find(inputSelector)

      expect(inputWrp.attributes()).not.toHaveProperty('disabled')
    })
    it('позволяет менять дефолтное значение', async () => {
      const text = 'init'
      const wrp = getWrapper({
        props: { modelValue: text },
      })
      const inputWrp = wrp.find(inputSelector)

      expect(inputWrp.element.value).toBe(text)

      const anotherText = 'another text'
      await inputWrp.setValue(anotherText)

      expect(inputWrp.element.value).toBe(anotherText)
    })
    it('позволяет менять раннее введенное значение', async () => {

      const wrp = getWrapper()
      const inputWrp = wrp.find(inputSelector)

      const text = 'init'
      await inputWrp.setValue(text)
      expect(inputWrp.element.value).toBe(text)

      const anotherText = 'another text'
      await inputWrp.setValue(anotherText)
      expect(inputWrp.element.value).toBe(anotherText)
    })
  })
})

function getWrapper (options = {}) {
  return mount(AppTextInput, {
    global: {
      components: {
        AppBtn,
      },
      plugins: [toolTipPlugin],
    },
    attachTo: document.body,
    ...options,
  })
}