import AppSelect from '@/components/shared/AppSelect'
import AppBtn from '@/components/shared/AppBtn'
import { toolTipPlugin } from '@/plugins'
import { clickOutsideDirective } from '@/directives'
import { flushPromises, mount } from '@vue/test-utils'
import { expect } from 'vitest'
import { input as inputClasses } from '@/assets/vars.js'

const listData = [
  // не добавляй сюда мандарин, используется с тесте на отсутствие
  { label: 'яблоко', value: 0 },
  { label: 'груша', value: 1 },
  { label: 'апельсин', value: 2 },
  { label: 'ананас', value: 3 },
  { label: 'абрикос', value: 4 },
  { label: 'персик', value: 5 },
  { label: 'вишня', value: 6 },
  { label: 'арбуз', value: 7 },
  { label: 'манго', value: 8 },
]

const {
  invalidBorderClass,
  disabledBorderClass,
  disabledBgClass,
} = inputClasses

const triggerLabelSelector = '[data-test="select-trigger-label"]'
const triggerIconSelector = '[data-test="select-trigger-icon"]'
const listWrapSelector = '[data-test="select-list-wrap"]'
const listSelector = '[data-test="select-list"]'
const nothingFoundSelector = '[data-test="select-nothing-found"]'
const listItemSelector = '[data-test="select-list-item"]'
const notSelectItemSelector = '[data-test="not-select-list-item"]'
const searchSelector = '[data-test="select-search"]'
const updateEvt = 'update:modelValue'

describe('начальное состояние', () => {
  it('компонент рендерится', () => {
    const wrp = getWrp()

    expect(wrp.exists()).toBe(true)
    expect(wrp.find(triggerLabelSelector).exists()).toBe(true)
    expect(wrp.find(triggerIconSelector).exists()).toBe(true)
    expect(wrp.find(listWrapSelector).exists()).toBe(false)
  })
  it('установлены корректные пропсы', () => {
    const wrp = getWrp()

    expect(wrp.props()).toMatchObject({
      modelValue: null,
      list: [],
      disabled: false,
      isInvalid: false,
      isSearch: false,
      isAllowEmpty: false,
      inputSettings: {
        placeholder: 'Найти',
      },
    })
  })
  it('корректный текст в триггере', () => {
    const wrp = getWrp()

    expect(wrp.find(triggerLabelSelector).html()).toContain('Не выбрано')
  })
  it('доступен для выбора значения', async () => {
    const wrp = getWrp({
      props: {
        list: listData,
        'onUpdate:modelValue': async e => {
          await wrp.setProps({ modelValue: e })
        },
      },
    })
    await expectSelectAllowsChoice(wrp)
  })
})

describe('[фича]: список вариантов', () => {
  it('открывается при клике на триггер', async () => {
    const wrp = getWrp()
    expect(wrp.find(listWrapSelector).exists()).toBe(false)

    await wrp.find(triggerLabelSelector).trigger('click')

    expect(wrp.find(listWrapSelector).exists()).toBe(true)
  })
  it('закрывается при повторном клике на триггер', async () => {
    const wrp = getWrp()
    const triggerLabelWrp = wrp.find(triggerLabelSelector)

    // изначально не видим список
    expect(wrp.find(listWrapSelector).exists()).toBe(false)

    await triggerLabelWrp.trigger('click')

    // видим список после первого клика
    expect(wrp.find(listWrapSelector).exists()).toBe(true)

    await triggerLabelWrp.trigger('click')

    // не видим список после второго клика
    expect(wrp.find(listWrapSelector).exists()).toBe(false)
  })
  it('закрывается при клике вне компоненты', async () => {
    const wrp = getWrp({
      attachTo: document.body,
      global: {
        stubs: { AppBtn: true },
        directives: {
          'click-outside': clickOutsideDirective,
        },
      },
    })

    // открыть список
    await wrp.find(triggerLabelSelector).trigger('click')
    expect(wrp.find(listWrapSelector).exists()).toBe(true)

    // кликнуть
    document.body.click()
    await flushPromises()

    // проверить, что скрыт
    expect(wrp.find(listWrapSelector).exists()).toBe(false)
  })
  it('выводит сообщение, когда список вариантов передан пустым', async () => {
    const wrp = getWrp({
      props: { list: [] },
    })

    await wrp.find(triggerLabelSelector).trigger('click')

    expect(wrp.find(listWrapSelector).exists()).toBe(true)
    expect(wrp.find(listSelector).exists()).toBe(false)
    expect(wrp.find(nothingFoundSelector).exists()).toBe(true)
  })
  it('выводит лейблы переданных элементов', async () => {
    const wrp = getWrp({
      props: { list: listData },
    })

    await wrp.find(triggerLabelSelector).trigger('click')

    expect(wrp.find(listWrapSelector).exists()).toBe(true)
    expect(wrp.find(listSelector).exists()).toBe(true)
    expect(wrp.find(listItemSelector).exists()).toBe(true)

    const items = wrp.findAll(listItemSelector)
    expect(items).toHaveLength(listData.length)
    const actualLabels = items.map(item => item.text())
    expect(actualLabels).toEqual(listData.map(item => item.label))
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)
  })
  it('закрывается при выборе значения', async () => {
    const wrp = getWrp({
      props: { list: listData },
    })

    await wrp.find(triggerLabelSelector).trigger('click')
    expect(wrp.find(listWrapSelector).exists()).toBe(true)
    expect(wrp.find(listSelector).exists()).toBe(true)

    await wrp.findAll(listItemSelector)[0].trigger('click')

    expect(wrp.find(listWrapSelector).exists()).toBe(false)
    expect(wrp.find(listSelector).exists()).toBe(false)
  })
})

describe('[фича]: поиск по списку вариантов (isSearch=true)', () => {
  let wrp
  beforeEach(() => {
    wrp = getWrp({
      props: {
        isSearch: true,
        list: listData,
      },
      attachedTo: document.body,
      global: {
        components: { AppBtn },
        plugins: [toolTipPlugin],
        directives: {
          'click-outside': clickOutsideDirective,
        },
      },
    })
  })
  it('поле ввода отрисовывается в списке вариантов', async () => {
    expect(wrp.find(listWrapSelector).exists()).toBe(false)
    expect(wrp.find(searchSelector).exists()).toBe(false)

    await wrp.find(triggerLabelSelector).trigger('click')

    expect(wrp.find(listWrapSelector).exists()).toBe(true)
    expect(wrp.find(searchSelector).exists()).toBe(true)
  })
  it('варианты фильтруются согласно вводу', async () => {
    await wrp.find(triggerLabelSelector).trigger('click')

    expect(wrp.find(listSelector).exists()).toBe(true)
    expect(wrp.findAll(listItemSelector)).toHaveLength(listData.length)
    const initItemsText = wrp.findAll(listItemSelector).map(item  => item.text())
    expect(initItemsText).toEqual(listData.map(item => item.label))
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)

    const searchText = 'ан'
    await wrp
      .find(searchSelector)
      .find('[data-test="app-text-input"]')
      .setValue(searchText)


    const itemsText = wrp.findAll(listItemSelector).map(item => item.text())
    expect(itemsText).toHaveLength(2)
    expect(itemsText).toEqual(
      listData
        .filter(({ label }) => label.includes(searchText))
        .map(({ label }) => label))
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)
  })
  it('если нет подходящих вариантов, выводится сообщение', async () => {
    await wrp.find(triggerLabelSelector).trigger('click')

    expect(wrp.find(listSelector).exists()).toBe(true)
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)
    expect(wrp.findAll(listItemSelector)).toHaveLength(listData.length)
    const initItemsText = wrp.findAll(listItemSelector).map(item => item.text())
    expect(initItemsText).toEqual(listData.map(item => item.label))

    const searchText = 'мандарин'
    await wrp
      .find(searchSelector)
      .find('[data-test="app-text-input"]')
      .setValue(searchText)

    expect(wrp.find(listSelector).exists()).toBe(false)
    expect(wrp.find(nothingFoundSelector).exists()).toBe(true)
  })
  it('при ручной очитке поля ввода показаны все варианты', async () => {
    await wrp.find(triggerLabelSelector).trigger('click')

    // проверить, что список отрисовался
    expect(wrp.find(listSelector).exists()).toBe(true)
    expect(wrp.findAll(listItemSelector)).toHaveLength(listData.length)
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)
    expect(wrp.findAll(listItemSelector).map(item  => item.text()))
      .toEqual(listData.map(item => item.label))

    // поиск, чтобы убрать часть элементов
    const searchText = 'ябл'
    await wrp
      .find(searchSelector)
      .find('[data-test="app-text-input"]')
      .setValue(searchText)

    // проверить, что удалось убрать часть элементов
    const itemsText = wrp.findAll(listItemSelector).map(item => item.text())
    expect(itemsText).toHaveLength(1)
    expect(itemsText).toEqual(
      listData
        .filter(({ label }) => label.includes(searchText))
        .map(({ label }) => label))
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)

    // сбросить поисковой запрос
    await wrp
      .find(searchSelector)
      .find('[data-test="app-text-input"]')
      .setValue('')

    // проверить, что все варианты отрисованы
    expect(wrp.findAll(listItemSelector)).toHaveLength(listData.length)
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)
    expect(wrp.findAll(listItemSelector).map(item  => item.text()))
      .toEqual(listData.map(item => item.label))
  })
  it('при программной очистке поля ввода показаны все варианты', async () => {
    await wrp.find(triggerLabelSelector).trigger('click')

    // проверить, что список отрисовался
    expect(wrp.find(listSelector).exists()).toBe(true)
    expect(wrp.findAll(listItemSelector)).toHaveLength(listData.length)
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)
    expect(wrp.findAll(listItemSelector).map(item  => item.text()))
      .toEqual(listData.map(item => item.label))

    // поиск, чтобы убрать часть элементов
    const searchText = 'ябл'
    await wrp
      .find(searchSelector)
      .find('[data-test="app-text-input"]')
      .setValue(searchText)

    // проверить, что удалось убрать часть элементов
    const itemsText = wrp.findAll(listItemSelector).map(item => item.text())
    expect(itemsText).toHaveLength(1)
    expect(itemsText).toEqual(
      listData
        .filter(({ label }) => label.includes(searchText))
        .map(({ label }) => label))
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)

    // сбросить поисковой запрос
    await wrp
      .find(searchSelector)
      .find('[data-test="app-text-input__clear-btn"]')
      .trigger('click')

    // проверить, что все варианты отрисованы
    expect(wrp.findAll(listItemSelector)).toHaveLength(listData.length)
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)
    expect(wrp.findAll(listItemSelector).map(item  => item.text()))
      .toEqual(listData.map(item => item.label))
  })
  it('поле ввода и фильтрация сбрасываются после закрытия списка на триггер', async () => {
    await wrp.find(triggerLabelSelector).trigger('click')

    // проверить, что список отрисовался
    expect(wrp.find(listSelector).exists()).toBe(true)
    expect(wrp.findAll(listItemSelector)).toHaveLength(listData.length)
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)
    expect(wrp.findAll(listItemSelector).map(item => item.text()))
      .toEqual(listData.map(item => item.label))

    // поиск, чтобы убрать часть элементов
    const searchText = 'ябл'
    await wrp
      .find(searchSelector)
      .find('[data-test="app-text-input"]')
      .setValue(searchText)

    // проверить, что удалось убрать часть элементов
    const itemsText = wrp.findAll(listItemSelector).map(item => item.text())
    expect(itemsText).toHaveLength(1)
    expect(itemsText).toEqual(
      listData
        .filter(({ label }) => label.includes(searchText))
        .map(({ label }) => label))
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)

    // свернуть список
    await wrp.find(triggerLabelSelector).trigger('click')
    expect(wrp.find(listWrapSelector).exists()).toBe(false)
    expect(wrp.find(listSelector).exists()).toBe(false)

    // развернуть список
    await wrp.find(triggerLabelSelector).trigger('click')
    expect(wrp.find(listWrapSelector).exists()).toBe(true)
    expect(wrp.find(listSelector).exists()).toBe(true)

    // проверить, что все варианты отрисованы и поиск пустой
    expect(wrp.findAll(listItemSelector)).toHaveLength(listData.length)
    expect(wrp.findAll(listItemSelector).map(item => item.text()))
      .toEqual(listData.map(item => item.label))
    expect(wrp.find(searchSelector).find('[data-test="app-text-input"]').element.value).toBe('')
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)
  })
  it('поле ввода и фильтрация сбрасываются после закрытия списка при выборе варианта', async () => {
    await wrp.find(triggerLabelSelector).trigger('click')

    // проверить, что список отрисовался
    expect(wrp.find(listSelector).exists()).toBe(true)
    expect(wrp.findAll(listItemSelector)).toHaveLength(listData.length)
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)
    expect(wrp.findAll(listItemSelector).map(item => item.text()))
      .toEqual(listData.map(item => item.label))

    // поиск, чтобы убрать часть элементов
    const searchText = 'груш'
    await wrp
      .find(searchSelector)
      .find('[data-test="app-text-input"]')
      .setValue(searchText)

    // проверить, что удалось убрать часть элементов
    const itemsText = wrp.findAll(listItemSelector).map(item => item.text())
    expect(itemsText).toHaveLength(1)
    expect(itemsText).toEqual(
      listData
        .filter(({ label }) => label.includes(searchText))
        .map(({ label }) => label))
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)

    // выбрать вариант (свернуть список)
    await wrp.findAll(listItemSelector)[0].trigger('click')

    // развернуть список
    await wrp.find(triggerLabelSelector).trigger('click')

    expect(wrp.find(listWrapSelector).exists()).toBe(true)
    expect(wrp.find(listSelector).exists()).toBe(true)

    // проверить, что все варианты отрисованы и поиск пустой
    expect(wrp.findAll(listItemSelector)).toHaveLength(listData.length)
    expect(wrp.findAll(listItemSelector).map(item => item.text()))
      .toEqual(listData.map(item => item.label))
    expect(wrp.find(searchSelector).find('[data-test="app-text-input"]').element.value).toBe('')
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)
  })
  it('поле ввода и фильтрация сбрасываются после закрытия списка при клике вне компоненты', async () => {
    await wrp.find(triggerLabelSelector).trigger('click')

    // проверить, что список отрисовался
    expect(wrp.find(listSelector).exists()).toBe(true)
    expect(wrp.findAll(listItemSelector)).toHaveLength(listData.length)
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)
    expect(wrp.findAll(listItemSelector).map(item => item.text()))
      .toEqual(listData.map(item => item.label))

    // поиск, чтобы убрать часть элементов
    const searchText = 'ябл'
    await wrp
      .find(searchSelector)
      .find('[data-test="app-text-input"]')
      .setValue(searchText)

    // проверить, что удалось убрать часть элементов
    const itemsText = wrp.findAll(listItemSelector).map(item => item.text())
    expect(itemsText).toHaveLength(1)
    expect(itemsText).toEqual(
      listData
        .filter(({ label }) => label.includes(searchText))
        .map(({ label }) => label))
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)

    // свернуть список кликом вне компоненты
    document.body.click()
    await flushPromises()

    // развернуть список
    await wrp.find(triggerLabelSelector).trigger('click')
    expect(wrp.find(listWrapSelector).exists()).toBe(true)
    expect(wrp.find(listSelector).exists()).toBe(true)

    // проверить, что все варианты отрисованы и поиск пустой
    expect(wrp.findAll(listItemSelector)).toHaveLength(listData.length)
    expect(wrp.findAll(listItemSelector).map(item => item.text()))
      .toEqual(listData.map(item => item.label))
    expect(wrp.find(searchSelector).find('[data-test="app-text-input"]').element.value).toBe('')
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)
  })
  it('поле ввода имеет корректный дефолтный плейсхолдер', async () => {
    await wrp.find(triggerLabelSelector).trigger('click')
    
    expect(wrp
      .find(searchSelector)
      .find('[data-test="app-text-input"]')
      .attributes('placeholder'),
    ).toBe('Найти')
  })
  it('поле ввода имеет корректный кастомный плейсхолдер', async () => {
    const placeholder = 'my placeholder'
    await wrp.setProps({ inputSettings: { placeholder } })
    await wrp.find(triggerLabelSelector).trigger('click')

    expect(wrp
      .find(searchSelector)
      .find('[data-test="app-text-input"]')
      .attributes('placeholder'),
    ).toBe(placeholder)
  })
})

describe('[фича]: установка значения с isAllowEmpty', () => {
  it('включение isAllowEmpty не ломает установку обычных значений', async () => {
    const wrp = getWrp({
      props: {
        isAllowEmpty: true,
        list: listData,
        'onUpdate:modelValue': async e => {
          await wrp.setProps({ modelValue: e })
        },
      },
    })

    await expectSelectAllowsChoice(wrp)
  })
  it('доступен вариант "Не выбрано", когда list имеет варианты', async () => {
    const wrp = getWrp({
      props: {
        isAllowEmpty: true,
        list: listData,
      },
    })

    await wrp.find(triggerLabelSelector).trigger('click')

    expect(wrp.find(listSelector).exists()).toBe(true)
    expect(wrp.find(notSelectItemSelector).exists()).toBe(true)
    expect(wrp.find(nothingFoundSelector).exists()).toBe(false)
  })
  it('НЕ доступен вариант "Не выбрано", когда list=[]', async () => {
    const wrp = getWrp({
      props: {
        isAllowEmpty: true,
      },
    })

    await wrp.find(triggerLabelSelector).trigger('click')

    expect(wrp.find(listSelector).exists()).toBe(false)
    expect(wrp.find(notSelectItemSelector).exists()).toBe(false)
    expect(wrp.find(nothingFoundSelector).exists()).toBe(true)
  })
  it('при установке "Не выбрано" в триггере корректный текст', async () => {
    const wrp = getWrp({
      props: {
        isAllowEmpty: true,
        list: listData,
        modelValue: 0,
        'onUpdate:modelValue': async e => {
          await wrp.setProps({ modelValue: e })
        },
      },
    })

    const triggerLabelWrp = wrp.find(triggerLabelSelector)

    // проверяем, что исходно выставлено значение из списка
    expect(triggerLabelWrp.text()).toBe(listData[0].label)

    await triggerLabelWrp.trigger('click')
    expect(wrp.find(notSelectItemSelector).exists()).toBe(true)

    // выбираем "Не выбрано"
    await wrp.find(notSelectItemSelector).trigger('click')

    expect(triggerLabelWrp.text()).toBe('Не выбрано')
  })
  it('эмитит null, если значение не выбрано', async () => {
    const wrp = getWrp({
      props: {
        isAllowEmpty: true,
        list: listData,
        modelValue: 0,
        'onUpdate:modelValue': async e => {
          await wrp.setProps({ modelValue: e })
        },
      },
    })

    const triggerLabelWrp = wrp.find(triggerLabelSelector)

    // проверяем, что исходно выставлено значение из списка
    expect(triggerLabelWrp.text()).toBe(listData[0].label)

    await triggerLabelWrp.trigger('click')
    expect(wrp.find(notSelectItemSelector).exists()).toBe(true)

    // выбираем "Не выбрано"
    await wrp.find(notSelectItemSelector).trigger('click')

    expect(wrp.emitted()).toHaveProperty(updateEvt)
    expect(wrp.emitted(updateEvt)).toHaveLength(1)
    expect(wrp.emitted(updateEvt)[0][0]).toBeNull()
  })
})

describe('[состояние]: active', () => {
  it('корректный цвет бордера триггера в свернутом виде', () => {
    const triggerWrp = getWrp().find(triggerLabelSelector)

    expect(triggerWrp.classes()).toContain('border-emerald-800')
    expect(triggerWrp.classes()).toContain('cursor-pointer')
    expect(triggerWrp.classes()).not.toContain(disabledBorderClass)
    expect(triggerWrp.classes()).not.toContain(disabledBgClass)
    expect(triggerWrp.classes()).not.toContain(invalidBorderClass)
  })
  it('корректный цвет бордера триггера и списка в развернутом виде', async () => {
    const wrp = getWrp()
    const triggerWrp = wrp.find(triggerLabelSelector)

    await triggerWrp.trigger('click')

    expect(triggerWrp.classes()).toContain('border-emerald-800')
    expect(triggerWrp.classes()).toContain('cursor-pointer')
    expect(triggerWrp.classes()).not.toContain(disabledBorderClass)
    expect(triggerWrp.classes()).not.toContain(disabledBgClass)
    expect(triggerWrp.classes()).not.toContain(invalidBorderClass)

    expect(wrp.find(listWrapSelector).classes()).toContain('border-emerald-800')
    expect(wrp.find(listWrapSelector).classes()).not.toContain(invalidBorderClass)
  })
  it('показан шеврон', () => {
    expect(getWrp().find(triggerIconSelector).exists()).toBe(true)
  })
  it('доступен для выбора значения', async () => {
    const wrp = getWrp({
      props: {
        list: listData,
        'onUpdate:modelValue': async e => {
          await wrp.setProps({ modelValue: e })
        },
      },
    })
    await expectSelectAllowsChoice(wrp)
  })
})

describe('[состояние]: disabled', () => {
  it('корректные стили триггера в свернутом виде', () => {
    const triggerWrp = getWrp({
      props: { disabled: true },
    }).find(triggerLabelSelector)

    expect(triggerWrp.classes()).toContain(disabledBgClass)
    expect(triggerWrp.classes()).toContain(disabledBorderClass)
    expect(triggerWrp.classes()).not.toContain('cursor-pointer')
    expect(triggerWrp.classes()).not.toContain('border-emerald-800')

  })
  it('шеврон скрыт', () => {
    const wrp = getWrp({
      props: { disabled: true },
    })

    expect(wrp.find(triggerIconSelector).exists()).toBe(false)
  })
  it('при клике на плашку не открывается список вариантов', async () => {
    const wrp = getWrp({
      props: { disabled: true },
    })

    await wrp.find(triggerLabelSelector).trigger('click')

    expect(wrp.find(listWrapSelector).exists()).toBe(false)
  })
  it('при установке из-вне список вариантов скрывается', async () => {
    const wrp = getWrp({
      props: { list: listData },
    })

    await wrp.find(triggerLabelSelector).trigger('click')

    expect(wrp.find(listWrapSelector).exists()).toBe(true)
    expect(wrp.find(listSelector).exists()).toBe(true)

    await wrp.setProps({ disabled: true })

    expect(wrp.find(listWrapSelector).exists()).toBe(false)
    expect(wrp.find(listSelector).exists()).toBe(false)
  })
})

describe('[состояние]: invalid', () => {
  let wrp
  beforeEach(() => {
    wrp = getWrp({
      props: {
        isInvalid: true,
        list: listData,
        'onUpdate:modelValue': async e => {
          await wrp.setProps({ modelValue: e })
        },
      },
    })
  })
  it('показан шеврон', () => {
    expect(wrp.find(triggerIconSelector).exists()).toBe(true)
  })
  it('корректный цвет бордера триггера в свернутом виде', () => {
    const triggerLabelWrp = wrp.find(triggerLabelSelector)
    expect(triggerLabelWrp.classes()).toContain(invalidBorderClass)
    expect(triggerLabelWrp.classes()).not.toContain('border-emerald-800')
    expect(triggerLabelWrp.classes()).not.toContain(disabledBorderClass)
  })
  it('корректный цвет бордера триггера и списка в развернутом виде', async () => {
    const triggerLabelWrp = wrp.find(triggerLabelSelector)

    await triggerLabelWrp.trigger('click')

    expect(wrp.find(triggerLabelSelector).classes()).toContain(invalidBorderClass)
    expect(wrp.find(triggerLabelSelector).classes()).not.toContain('border-emerald-800')
    expect(wrp.find(triggerLabelSelector).classes()).not.toContain(disabledBorderClass)

    expect(wrp.find(listWrapSelector).classes()).toContain(invalidBorderClass)
    expect(wrp.find(listWrapSelector).classes()).not.toContain('border-emerald-800')
  })
  it('доступен для выбора значения', async () => {
    await expectSelectAllowsChoice(wrp)
  })
  it('бордер invalid должен быть приоритетнее, чем бордер disabled', async () => {
    // только в развернутом виде, у disabled не может быть выведен список
    await wrp.setProps({ disabled: true })

    const triggerEl = wrp.find(triggerLabelSelector)
    expect(triggerEl.classes()).toContain(disabledBgClass)
    expect(triggerEl.classes()).toContain(invalidBorderClass)
    expect(triggerEl.classes()).not.toContain('border-emerald-800')
    expect(triggerEl.classes()).not.toContain(disabledBorderClass)
  })
})

async function expectSelectAllowsChoice(wrp){
  expect(wrp.find(listWrapSelector).exists()).toBe(false)

  await wrp.find(triggerLabelSelector).trigger('click')

  expect(wrp.find(listSelector).exists()).toBe(true)

  const selectedIndex = 0
  await wrp.findAll(listItemSelector)[selectedIndex].trigger('click')

  expect(wrp.emitted()).toHaveProperty(updateEvt)
  expect(wrp.emitted(updateEvt).length).toBe(1)
  expect(wrp.emitted(updateEvt)[0][0]).toBe(listData[selectedIndex].value)
  expect(wrp.find(triggerLabelSelector).text()).toBe(listData[selectedIndex].label)
}

function getWrp (options = {}) {
  return mount(AppSelect, {
    global: {
      stubs: { AppBtn: true },
      directives: {
        'click-outside': {},
      },
    },
    ...options,
  })
}