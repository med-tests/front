import AppNumberInput from '@/components/shared/inputs/AppNumberInput'
import { mount } from '@vue/test-utils'
import AppBtn from '@/components/shared/AppBtn'
import { toolTipPlugin } from '@/plugins'
import { input as inputClass } from '@/assets/vars.js'

const defaultPlaceholder = 'Введите число'

const inputSelector = 'input[data-test="app-number-input"]'
const clearBtnSelector = '[data-test="app-number-input__clear-btn"]'
const inputEvent = 'update:modelValue'

describe('общее', () => {
  it('корректно рендерится без пропсов (дефолтное состояние)', () => {
    const wrp = getWrapper({
      global: {
        components: {
          AppBtn,
        },
        plugins: [toolTipPlugin],
      },
      attachTo: document.body,
    })

    expect(wrp.exists()).toBe(true)
    expect(wrp.find(inputSelector).exists()).toBe(true)
    expect(wrp.find(clearBtnSelector).exists()).toBe(true)
  })
  it('выставлены корректные дефолтные значения пропсов', () => {
    const wrp = getWrapper()

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

    const id = wrp.props('id')

    expect(id).toBeDefined()
    expect(id.length).toBeGreaterThan(0)
  })
  it('инпут имеет autocomplete="off" (для отключения автозаполнения)', () => {
    const inputWrp = getWrapper().find(inputSelector)

    expect(inputWrp.attributes()).toHaveProperty('autocomplete')
    expect(inputWrp.attributes('autocomplete')).toBe('off')
  })
})

// состояния
describe('default', () => {
  it('инпут имеет корректный цвет бордера', () => {
    const inputWrp = getWrapper().find(inputSelector)
    
    expect(inputWrp.classes()).toContain(inputClass.defaultBorderClass)
    expect(inputWrp.classes()).not.toContain(inputClass.disabledBorderClass)
    expect(inputWrp.classes()).not.toContain(inputClass.invalidBorderClass)
  })
  it('доступен для ввода', async () => {
    const inputWrp = getWrapper().find(inputSelector)

    const num = 123
    await inputWrp.setValue(num)

    expect(inputWrp.attributes()).not.toHaveProperty('disabled')
    expect(inputWrp.element.value).toBe(num.toString())
  })

  describe('обработка значения', () => {
    it('эмитит событие update:modelValue с верным значением при вводе', async () => {
      const wrp = getWrapper()
      const inputWrp = wrp.find(inputSelector)

      const num = 123
      await inputWrp.setValue(num)

      expect(wrp.emitted()).toHaveProperty(inputEvent)
      expect(wrp.emitted(inputEvent)).toHaveLength(1)
      expect(wrp.emitted(inputEvent)[0][0]).toBe(num)
    })
    it('позволяет только числа, пустую строку или знак минус', async () => {
      const wrp = getWrapper()
      const inputWrp = wrp.find(inputSelector)

      expect(inputWrp.element.value).toBe('')

      const num = 42
      await inputWrp.setValue(num)
      expect(inputWrp.element.value).toBe(num.toString())
      expect(wrp.emitted(inputEvent)[0][0]).toBe(num)

      const negativeNum = -42
      await inputWrp.setValue(negativeNum)
      expect(inputWrp.element.value).toBe(negativeNum.toString())
      expect(wrp.emitted(inputEvent)[1][0]).toBe(negativeNum)

      const float = 4.2
      await inputWrp.setValue(float)
      expect(inputWrp.element.value).toBe(float.toString())
      expect(wrp.emitted(inputEvent)[2][0]).toBe(float)

      const negativeFloat = -4.2
      await inputWrp.setValue(negativeFloat)
      expect(inputWrp.element.value).toBe(negativeFloat.toString())
      expect(wrp.emitted(inputEvent)[3][0]).toBe(negativeFloat)

      const minus = '-'
      await inputWrp.setValue(minus)
      expect(inputWrp.element.value).toBe(minus)
      expect(wrp.emitted(inputEvent)[4][0]).toBe(minus)

      const empty = ''
      await inputWrp.setValue(empty)
      expect(inputWrp.element.value).toBe(empty)
      expect(wrp.emitted(inputEvent)[5][0]).toBe(empty)

      const text = 'text'
      await inputWrp.setValue(text)
      expect(inputWrp.element.value).toBe(empty)
      expect(wrp.emitted(inputEvent)).toHaveLength(6)
    })
    it('устанавливает начальное значение из modelValue', () => {
      const num = 11
      const wrp = getWrapper({
        props: {
          modelValue: num,
        },
      })

      expect(wrp.find(inputSelector).element.value).toBe(num.toString())
    })
    it('меняет значение при изменении modelValue', async () => {
      const wrp = getWrapper()
      const inputEl = wrp.find(inputSelector).element

      expect(inputEl.value).toBe('')
      expect(wrp.props('modelValue')).toBe('')

      const num = 1
      await wrp.setProps({ modelValue: num })
      expect(inputEl.value).toBe(num.toString())


      const newNum = 2
      await wrp.setProps({ modelValue: newNum })
      expect(inputEl.value).toBe(newNum.toString())
    })
  })

  it('отрисовывается кнопка очистки ввода (hideCloseIcon не установлен в true)', () => {
    const clearBtnWrp = getWrapper({
      global: {
        components: { AppBtn },
        stubs: { ToolTip: true },
      },
    }).find(clearBtnSelector)

    expect(clearBtnWrp.exists()).toBe(true)
  })
})

describe('disabled', () => {
  it('скрывается кнопка очистки ввода и место под нее вне зависимости от hideCloseIcon', async () => {
    const wrp = getWrapper({
      props: {
        disabled: true,
        hideCloseIcon: false,
      },
      global: {
        components: { AppBtn },
      },
    })
    const inputWrp = wrp.find(inputSelector)
    const clearBtnWrp = wrp.find(clearBtnSelector)

    expect(inputWrp.classes()).not.toContain(inputClass.clearBtnOffsetClass)
    expect(clearBtnWrp.exists()).toBe(false)

    await wrp.setProps({ hideCloseIcon: true })

    expect(inputWrp.classes()).not.toContain(inputClass.clearBtnOffsetClass)
    expect(clearBtnWrp.exists()).toBe(false)
  })
  it('корректные стили инпута', () => {
    const inputWrp = getWrapper({
      props: { disabled: true },
    }).find(inputSelector)

    expect(inputWrp.classes()).toContain(inputClass.disabledBorderClass)
    expect(inputWrp.classes()).toContain(inputClass.disabledBgClass)
    expect(inputWrp.classes()).not.toContain(inputClass.defaultBorderClass)
    expect(inputWrp.classes()).not.toContain(inputClass.invalidBorderClass)
  })
  it('приоритет бордеру инвалид, при isInvalid=true и disabled=true', async () => {
    const inputWrp = getWrapper({
      props: {
        disabled: true,
        isInvalid: true,
      },
    }).find(inputSelector)

    expect(inputWrp.classes()).toContain(inputClass.invalidBorderClass)
    expect(inputWrp.classes()).not.toContain(inputClass.disabledBgClass)
    expect(inputWrp.classes()).not.toContain(inputClass.defaultBorderClass)
  })
  it('инпут имеет атрибут disabled', () => {
    const inputWrp = getWrapper({
      props: { disabled: true },
    }).find(inputSelector)

    expect(inputWrp.attributes()).toHaveProperty('disabled')
  })

  describe('обработка значения', () => {
    it('не позволяет менять начальное значение', async () => {
      const initVal = 1
      const wrp = getWrapper({
        props: {
          disabled: true,
          modelValue: initVal,
        },
      })
      const inputWrp = wrp.find(inputSelector)

      expect(inputWrp.element.value).toBe(initVal.toString())

      await inputWrp.setValue(2)

      expect(wrp.emitted()).not.toHaveProperty(inputEvent)
      expect(wrp.props('modelValue')).toBe(initVal)
    })
    it('не позволяет менять установленное ранее значение', async () => {
      const wrp = getWrapper({
        props: {
          disabled: false,
          // так как компонент с v-model не мутирует пропс,
          // а лишь уведомляет родителя о необходимости это сделать
          'onUpdate:modelValue': async e => {
            await wrp.setProps({ modelValue: e })
          },
        },
      })
      const inputWrp = wrp.find(inputSelector)

      const val = 1
      await inputWrp.setValue(val)
      expect(inputWrp.element.value).toBe(val.toString())
      expect(wrp.emitted()).haveOwnProperty(inputEvent)
      expect(wrp.emitted(inputEvent)[0][0]).toBe(val)
      expect(wrp.emitted(inputEvent)).toHaveLength(1)
      expect(wrp.props('modelValue')).toBe(val)

      await wrp.setProps({ disabled: true })

      const newVal = 2
      await inputWrp.setValue(newVal)

      expect(wrp.emitted(inputEvent)).toHaveLength(1)
      expect(wrp.props('modelValue')).toBe(val)
    })
  })
})

describe('invalid', () => {
  it('имеет корректный цвет бордера', () => {
    const inputWrp = getWrapper({
      props: { isInvalid:  true },
    }).find(inputSelector)

    expect(inputWrp.classes()).toContain(inputClass.invalidBorderClass)
    expect(inputWrp.classes()).not.toContain(inputClass.defaultBorderClass)
    expect(inputWrp.classes()).not.toContain(inputClass.disabledBorderClass)
  })
  it('отрисовывается кнопка очистки ввода (hideCloseIcon не установлен в true)', () => {
    const clearBtnWrp = getWrapper({
      global: {
        components: { AppBtn },
        stubs: { ToolTip: true },
      },
      props: { isInvalid: true },
    }).find(clearBtnSelector)

    expect(clearBtnWrp.exists()).toBe(true)
  })
})

// то, что не зависит от состояния самой компоненты
describe('кнопка очистки ввода', () => {
  it('отрисовывается, когда явно передано hideCloseIcon=false', () => {
    const clearBtnWrp = getWrapper({
      props: { hideCloseIcon: false },
      global: {
        components: { AppBtn },
        stubs: { ToolTip: true },
      },
    }).find(clearBtnSelector)

    expect(clearBtnWrp.exists()).toBe(true)
  })
  it('скрывается, когда hideCloseIcon=true', () => {
    const clearBtnWrp = getWrapper({
      props: { hideCloseIcon: true },
      global: {
        components: { AppBtn },
        stubs: { ToolTip: true },
      },
    }).find(clearBtnSelector)

    expect(clearBtnWrp.exists()).toBe(false)
  })
  it('скрывается, когда hideCloseIcon=true и disabled=true одновременно', () => {
    const clearBtnWrp = getWrapper({
      props: {
        hideCloseIcon: true,
        disabled: true,
      },
      global: {
        components: { AppBtn },
        stubs: { ToolTip: true },
      },
    }).find(clearBtnSelector)

    expect(clearBtnWrp.exists()).toBe(false)
  })
  it('имеет корректный дефолтный тултип', async () => {
    vi.useFakeTimers()
    const wrp = getWrapper({
      global: {
        components: {
          AppBtn,
        },
        plugins: [toolTipPlugin],
      },
      attachTo: document.body,
    })
    await vi.dynamicImportSettled()

    const clearBtnWrp = wrp.find(clearBtnSelector)

    await clearBtnWrp.trigger('mouseenter')
    const tippyDelay = 50
    vi.advanceTimersByTime(tippyDelay)

    expect(wrp.find('.tippy-content').exists()).toBe(true)
    expect(wrp.find('.tippy-content').html()).toContain('Очистить')

    vi.useRealTimers()
  })
  it('при клике на кнопку сбрасывается значение инпута', async () => {
    const val = 1
    const wrp = getWrapper({
      attachTo: document.body,
      global: {
        components: { AppBtn },
        stubs: { ToolTip: true },
      },
      props: { 
        modelValue: val,
        'onUpdate:modelValue': async e => {
          await wrp.setProps({ modelValue: e })
        },
      },
    })
    const clearBtnWrp = wrp.find(clearBtnSelector)
    
    expect(wrp.find(inputSelector).element.value).toBe(val.toString())
    await clearBtnWrp.trigger('click')

    expect(wrp.emitted()).haveOwnProperty(inputEvent)
    expect(wrp.emitted(inputEvent)).toHaveLength(1)
    expect(wrp.emitted(inputEvent)[0][0]).toBe('')
    expect(wrp.props('modelValue')).toBe('')
    expect(wrp.find(inputSelector).element.value).toBe('')
  })
  it('фокусируется на инпуте после очистки', async () => {
    const wrp = getWrapper({
      attachTo: document.body,
      global: {
        components: { AppBtn },
        stubs: { ToolTip: true },
      },
    })
    const inputEl = wrp.find(inputSelector).element
    const clearBtnWrp = wrp.find(clearBtnSelector)

    document.body.focus()
    expect(document.activeElement).not.toBe(inputEl)

    await clearBtnWrp.trigger('click')

    expect(document.activeElement).toBe(inputEl)
  })
})

describe('плейсходер', () => {
  it('корректный по умолчанию', () => {
    const inputWrp = getWrapper().find(inputSelector)

    expect(inputWrp.attributes()).toHaveProperty('placeholder')
    expect(inputWrp.attributes('placeholder')).toBe(defaultPlaceholder)
    expect(inputWrp.element.placeholder).toBe(defaultPlaceholder)
  })
  it('корректный кастомный', () => {
    const placeholder = 'custom placeholder'
    const inputWrp = getWrapper({
      props: { placeholder },
    }).find(inputSelector)

    expect(inputWrp.attributes()).toHaveProperty('placeholder')
    expect(inputWrp.attributes('placeholder')).toBe(placeholder)
    expect(inputWrp.element.placeholder).toBe(placeholder)
  })
})

function getWrapper (options = {}) {
  return mount(AppNumberInput, {
    global: {
      stubs: {
        // нет смысл в ToolTip: true, тк он отрисовывается
        // только при наведении на кнопку в рамках текущей реализации компоненты
        AppBtn: true,
      },
    },
    ...options,
  })
}