import { flushPromises, mount } from '@vue/test-utils'
import AppContextMenu from '@/components/shared/AppContextMenu/index.vue'
import AppBtn from '@/components/shared/AppBtn/index.vue'
import { toolTipPlugin } from '@/plugins/index.js'
import { clickOutsideDirective } from '@/directives/index.js'

describe('AppContextMenu', () => {
  describe('должен отрисовывать триггер', () => {
    it('из текстового слота', () => {
      const togglerSlotValue = 'Hello, I am context menu toggler'
      const wrp = getWrapper({
        togglerSlot: togglerSlotValue,
      })

      expect(wrp.html()).toContain(togglerSlotValue)
    })
    it('из разметки', () => {
      const togglerText = 'Hello, I am context menu toggler!'
      const togglerClass = 'test-toggler'
      const togglerSlotValue = `<div class="${togglerClass}">${togglerText}</div>`
      const wrp = getWrapper({
        togglerSlot: togglerSlotValue,
      })

      expect(wrp.find(`.${togglerClass}`).exists()).toBeTruthy()
      expect(wrp.html()).toContain(togglerSlotValue)
    })
    it('из компоненты', () => {
      const togglerText = 'Hello, I am toggler button!'
      const wrp = getWrapper({
        togglerSlot: `<AppBtn>${togglerText}</AppBtn>`,
        global: {
          components: {
            AppBtn,
          },
          plugins: [
            toolTipPlugin,
          ],
          directives: {
            'click-outside': clickOutsideDirective,
          },
        },
      })

      const AppBtnSlot = wrp.findComponent(AppBtn)
      expect(AppBtnSlot.exists()).toBe(true)
      expect(AppBtnSlot.text()).toContain(togglerText)
    })
  })

  it('должен открываться по клику на триггер', async () => {
    const wrp = getWrapper()
    const togglerWrp = wrp.find('[data-test="wrp-toggler"]')
    await togglerWrp.trigger('click')

    const wrpItems = wrp.find('[data-test="wrp-items"]')
    expect(wrpItems.exists()).toBeTruthy()
    expect(wrpItems.html()).toContain('Название пункта')
  })

  describe('должен отрисовывать все переданные элементы', () => {
    it('(1)', async () => {
      const item = { title: 'Редактировать', event: 'edit' }
      const wrp = getWrapper({
        props: {
          arrItems: [item],
        },
      })
      const togglerWrp = wrp.find('[data-test="wrp-toggler"]')
      await togglerWrp.trigger('click')

      const wrpItems = wrp.find('[data-test="wrp-items"]')
      expect(wrpItems.exists()).toBeTruthy()

      expect(wrpItems.findAll('[data-test="item"]')).toHaveLength(1)
      expect(wrpItems.html()).toContain(item.title)
    })
    it('(5)', async () => {
      const arrItems = [
        { title: 'Редактировать', event: 'edit' },
        { title: 'Создать', event: 'edit' },
        { title: 'Удалить', event: 'edit' },
        { title: 'Добавить', event: 'edit' },
        { title: 'Переместить', event: 'edit' },
      ]
      const wrp = getWrapper({
        props: {
          arrItems,
        },
      })
      const togglerWrp = wrp.find('[data-test="wrp-toggler"]')
      await togglerWrp.trigger('click')

      const wrpItems = wrp.find('[data-test="wrp-items"]')
      expect(wrpItems.exists()).toBeTruthy()

      const items = wrpItems.findAll('[data-test="item"]')
      expect(items).toHaveLength(arrItems.length)

      // Цикл по каждому элементу
      items.forEach((itemWrapper, index) => {
        expect(itemWrapper.text()).toContain(arrItems[index].title)
      })
    })
    it('(10)', async () => {
      const arrItems = [
        { title: 'Редактировать', event: 'edit' },
        { title: 'Создать', event: 'edit' },
        { title: 'Удалить', event: 'edit' },
        { title: 'Добавить', event: 'edit' },
        { title: 'Переместить', event: 'edit' },
        { title: 'Редактировать', event: 'edit' },
        { title: 'Создать', event: 'edit' },
        { title: 'Удалить', event: 'edit' },
        { title: 'Добавить', event: 'edit' },
        { title: 'Переместить', event: 'edit' },
      ]
      const wrp = getWrapper({
        props: {
          arrItems,
        },
      })
      const togglerWrp = wrp.find('[data-test="wrp-toggler"]')
      await togglerWrp.trigger('click')

      const wrpItems = wrp.find('[data-test="wrp-items"]')
      expect(wrpItems.exists()).toBeTruthy()

      const items = wrpItems.findAll('[data-test="item"]')
      expect(items).toHaveLength(arrItems.length)

      // Цикл по каждому элементу
      items.forEach((itemWrapper, index) => {
        expect(itemWrapper.text()).toContain(arrItems[index].title)
      })
    })
  })

  it('при клике на элемент должен эмитить название события', async () => {
    const arrItems = [
      { title: 'Редактировать', event: 'edit' },
    ]
    const wrp = getWrapper({
      props: {
        arrItems,
      },
    })
    const togglerWrp = wrp.find('[data-test="wrp-toggler"]')
    await togglerWrp.trigger('click')

    const targetItem = wrp
      .findAll('[data-test="item"]')
      .find(item => item.text() === 'Редактировать')
    expect(targetItem).toBeDefined()  // убедиться, что элемент найден

    await targetItem.trigger('click')
    expect(wrp.emitted()).toHaveProperty('click')
    expect(wrp.emitted().click[0]).toEqual(['edit'])
  })

  it('должен закрываться при выборе элемента', async () => {
    const menuItem = { title: 'Редактировать', event: 'edit' }
    const wrp = getWrapper({
      props: {
        arrItems: [menuItem],
      },
    })
    const togglerWrp = wrp.find('[data-test="wrp-toggler"]')
    await togglerWrp.trigger('click')

    const wrpItems = wrp.find('[data-test="wrp-items"]')
    expect(wrpItems.exists()).toBeTruthy()
    expect(wrpItems.html()).toContain(menuItem.title)

    const targetItem = wrp
      .findAll('[data-test="item"]')
      .find(item => item.text() === menuItem.title)

    await targetItem.trigger('click')

    expect(wrp.find('[data-test="wrp-items"]').exists()).toBeFalsy()
  })

  it('должен закрываться при клике вне компонента', async () => {
    const menuItem = { title: 'Редактировать', event: 'edit' }
    const wrp = getWrapper({
      props: {
        arrItems: [menuItem],
      },
      attachTo: document.body,
      global: {
        directives: {
          'click-outside': clickOutsideDirective,
        },
      },
    })
    await wrp.find('[data-test="wrp-toggler"]').trigger('click')
    const wrpItems = wrp.find('[data-test="wrp-items"]')
    expect(wrpItems.exists()).toBeTruthy()
    expect(wrpItems.html()).toContain(menuItem.title)

    document.body.click()
    await flushPromises()

    expect(wrp.find('[data-test="wrp-items"]').exists()).toBe(false)
  })
})

// {
//    props?: { propName: value }
//    togglerSlot?: String | разметка | компонент
//    global?: object // для регистрации переданной в слоте компоненты
//    attachTo?: document.body
//  }
function getWrapper (options = {}) {
  const defaultSlot = '<div>Hello, I am context menu toggler!</div>'
  const defaultArrItems = [
    { title: 'Название пункта', event: 'Название события' },
  ]

  return mount(AppContextMenu, {
    props: {
      arrItems: defaultArrItems,
      ...options?.props,
    },
    slots: {
      toggler: Object.hasOwn(options, 'togglerSlot')
        ? options.togglerSlot
        : defaultSlot,
    },
    global: {
      directives: {
        'click-outside': {},
      },
    },
    ...(Object.hasOwn(options, 'global') && {
      global: options.global,
    }),
    ... (Object.hasOwn(options, 'attachTo') && {
      attachTo: options.attachTo,
    }),
  })
}
