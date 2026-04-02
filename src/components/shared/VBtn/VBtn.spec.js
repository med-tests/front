import {flushPromises, mount} from '@vue/test-utils'
import VBtn from '@/components/shared/VBtn/index.vue'

describe('VBtn', () => {
  it ('отрисовывает кнопку из слота', async () => {
    const btnId = 'test-btn'
    const btnMarkup = `<div id="${btnId}">Текст кнопки</div>`
    const wrapper = getWrapper({
      slots: {
        default: btnMarkup,
      },
    })

    expect(wrapper.find(`#${btnId}`).exists()).toBeTruthy()
    expect(wrapper.html()).toContain(btnMarkup)
  })
  // вычисление стилей
  describe('корректно вычисляет css-классы для', () => {
    const slot = { default: '<div>Текст кнопки</div>' }
    const generalClasses = ['inline-block', 'rounded-xs', 'select-none', 'text-lg']
    // ✅ notBordered notFilling !disabled
    // ✅ notBordered !notFilling !disabled
    // ✅ !notBordered !notFilling !disabled
    // ✅ !notBordered notFilling !disabled
    // ✅ notBordered notFilling disabled
    // ✅ notBordered !notFilling disabled
    // ✅ !notBordered !notFilling disabled
    // ✅ !notBordered notFilling disabled

    describe('type default с пропсами', () => {
      it('notBordered-notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              notBordered: true,
              notFilling: true,
              disabled: false,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-pointer',
          'text-gray-700',
          'hover:text-gray-900',
          'fill-gray-600',
          'hover:fill-gray-900',
        ]

        // классы могут быть в любом порядке
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('notBordered-!notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              notBordered: true,
              notFilling: false,
              disabled: false,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-pointer',
          'text-gray-700',
          'hover:text-gray-900',
          'fill-gray-600',
          'hover:fill-gray-900',
          'bg-white',
          'hover:bg-black/5',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-!notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              notBordered: false,
              notFilling: false,
              disabled: false,
            },
            slots: slot,
          })
        const approvedClasses = [
          ...generalClasses,
          'cursor-pointer',
          'text-gray-700',
          'hover:text-gray-900',
          'fill-gray-600',
          'hover:fill-gray-900',
          'border',
          'border-gray-400',
          'p-1',
          'bg-white',
          'hover:bg-black/5',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              notBordered: false,
              notFilling: true,
              disabled: false,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-pointer',
          'text-gray-700',
          'hover:text-gray-900',
          'fill-gray-600',
          'hover:fill-gray-900',
          'border',
          'border-gray-400',
          'p-1',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('notBordered-notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              notBordered: true,
              notFilling: true,
              disabled: true,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-not-allowed',
          'text-gray-500',
          'fill-gray-500',
          'hover:fill-gray-500',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('notBordered-!notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              notBordered: true,
              notFilling: false,
              disabled: true,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-not-allowed',
          'text-gray-500',
          'fill-gray-500',
          'hover:fill-gray-500',
          'bg-black/10',
          'hover:bg-black/10',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-!notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              notBordered: false,
              notFilling: false,
              disabled: true,
            },
            slots: slot,
          })
        const approvedClasses = [
          ...generalClasses,
          'cursor-not-allowed',
          'text-gray-500',
          'fill-gray-500',
          'hover:fill-gray-500',
          'border',
          'border-gray-400',
          'p-1',
          'bg-black/10',
          'hover:bg-black/10',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              notBordered: false,
              notFilling: true,
              disabled: true,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-not-allowed',
          'text-gray-500',
          'fill-gray-500',
          'hover:fill-gray-500',
          'border',
          'border-gray-400',
          'p-1',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
    })

    describe('type success с пропсами', () => {
      it('notBordered-notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'success',
              notBordered: true,
              notFilling: true,
              disabled: false,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-pointer',
          'text-emerald-700',
          'hover:text-emerald-800',
          'fill-emerald-900',
          'hover:fill-emerald-600',
        ]

        // классы могут быть в любом порядке
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('notBordered-!notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'success',
              notBordered: true,
              notFilling: false,
              disabled: false,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-pointer',
          'text-white',
          'fill-white',
          'hover:fill-white',
          'bg-emerald-700',
          'hover:bg-emerald-600',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-!notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'success',
              notBordered: false,
              notFilling: false,
              disabled: false,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-pointer',
          'text-white',
          'fill-white',
          'hover:fill-white',
          'border',
          'border-emerald-700',
          'p-1',
          'bg-emerald-700',
          'hover:bg-emerald-600',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'success',
              notBordered: false,
              notFilling: true,
              disabled: false,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-pointer',
          'text-emerald-700',
          'hover:text-emerald-800',
          'fill-emerald-900',
          'hover:fill-emerald-600',
          'border',
          'border-emerald-700',
          'p-1',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('notBordered-notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'success',
              notBordered: true,
              notFilling: true,
              disabled: true,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-not-allowed',
          'text-gray-500',
          'fill-gray-500',
          'hover:fill-gray-500',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('notBordered-!notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'success',
              notBordered: true,
              notFilling: false,
              disabled: true,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-not-allowed',
          'text-gray-200',
          'fill-white',
          'hover:fill-white',
          'hover:bg-emerald-500',
          'bg-emerald-500',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-!notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'success',
              notBordered: false,
              notFilling: false,
              disabled: true,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-not-allowed',
          'text-gray-200',
          'fill-white',
          'hover:fill-white',
          'border',
          'border-emerald-700',
          'p-1',
          'hover:bg-emerald-500',
          'bg-emerald-500',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'success',
              notBordered: false,
              notFilling: true,
              disabled: true,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-not-allowed',
          'text-gray-500',
          'fill-gray-500',
          'hover:fill-gray-500',
          'border',
          'border-emerald-700',
          'p-1',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
    })

    describe('type error с пропсами', () => {
      it('notBordered-notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'error',
              notBordered: true,
              notFilling: true,
              disabled: false,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-pointer',
          'text-gray-700',
          'hover:text-gray-900',
          'fill-red-900',
          'hover:fill-red-600',
        ]

        // классы могут быть в любом порядке
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('notBordered-!notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'error',
              notBordered: true,
              notFilling: false,
              disabled: false,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-pointer',
          'text-white',
          'fill-white',
          'hover:fill-white',
          'bg-red-500',
          'hover:bg-red-600',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-!notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'error',
              notBordered: false,
              notFilling: false,
              disabled: false,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-pointer',
          'text-white',
          'fill-white',
          'hover:fill-white',
          'border',
          'border-red-500',
          'p-1',
          'bg-red-500',
          'hover:bg-red-600',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'error',
              notBordered: false,
              notFilling: true,
              disabled: false,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-pointer',
          'text-gray-700',
          'hover:text-gray-900',
          'fill-red-900',
          'hover:fill-red-600',
          'border',
          'border-red-500',
          'p-1',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('notBordered-notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'error',
              notBordered: true,
              notFilling: true,
              disabled: true,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-not-allowed',
          'text-gray-500',
          'fill-gray-500',
          'hover:fill-gray-500',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('notBordered-!notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'error',
              notBordered: true,
              notFilling: false,
              disabled: true,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-not-allowed',
          'text-gray-200',
          'fill-white',
          'hover:fill-white',
          'hover:bg-red-400',
          'bg-red-400',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-!notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'error',
              notBordered: false,
              notFilling: false,
              disabled: true,
            },
            slots: slot,
          })

        const approvedClasses = [
          ...generalClasses,
          'cursor-not-allowed',
          'text-gray-200',
          'fill-white',
          'hover:fill-white',
          'border',
          'border-red-500',
          'p-1',
          'hover:bg-red-400',
          'bg-red-400',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'error',
              notBordered: false,
              notFilling: true,
              disabled: true,
            },
            slots: slot,
          })
        const approvedClasses = [
          ...generalClasses,
          'cursor-not-allowed',
          'text-gray-500',
          'fill-gray-500',
          'hover:fill-gray-500',
          'border',
          'border-red-500',
          'p-1',
        ]
        expect(wrp.classes().length).toEqual(approvedClasses.length)
        expect(wrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
    })
  })

  // клик
  it('емитит клик по умолчанию', async () => {
    const wrapper = getWrapper()

    await wrapper.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('click')
  })
  it('емитит клик, если не disabled и не в загрузке явно', async () => {
    const wrapper = getWrapper({
      disabled: false,
      isLoading: false,
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('click')
  })
  it('не емитит клик, если disabled', async () => {
    const wrapper = getWrapper({
      props: { disabled: true },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted()).not.toHaveProperty('click')
  })
  it('не емитит клик, если в загрузке', async () => {
    const wrapper = getWrapper({
      props: { isLoading: true },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted()).not.toHaveProperty('click')
  })
  it('не емитит клик, если в загрузке и disabled', async () => {
    const wrapper = getWrapper({
      props: { disabled: true, isLoading: true },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted()).not.toHaveProperty('click')
  })

  // тултип
  it('отображает тултип при наведении, если передан его текст', async () => {
    const title = 'Тестовый тултип'
    const wrapper = getWrapper({
        props: { title },
        slots: {
          default: 'Текст кнопки',
        },
      },
    )

    vi.useFakeTimers()

    await wrapper.trigger('mouseenter')

    const tippyDelay = 50
    vi.advanceTimersByTime(tippyDelay)
    await flushPromises()

    expect(wrapper.find('.tippy-content').exists()).toBeTruthy()
    expect(wrapper.find('.tippy-content').html()).toContain(title)
  })
  it('не отображает тултип при наведении, если его текст не передан', async () => {
    const wrapper = getWrapper({
        slots: {
          default: 'Текст кнопки',
        },
      },
    )

    vi.useFakeTimers()

    await wrapper.trigger('mouseenter')

    const tippyDelay = 50
    vi.advanceTimersByTime(tippyDelay)
    await flushPromises()

    expect(wrapper.find('.tippy-content').exists()).toBeFalsy()
  })
  it('не отображает тултип при наведении во время загрузки', async () => {
    const title = 'Тестовый тултип'
    const wrapper = getWrapper({
        props: {
          title,
        },
        slots: {
          default: 'Текст кнопки',
        },
      },
    )
    vi.useFakeTimers()

    await wrapper.trigger('mouseenter')
    const tippyDelay = 50

    vi.advanceTimersByTime(tippyDelay)
    await flushPromises()
    expect(wrapper.find('.tippy-content').exists()).toBeTruthy()
    expect(wrapper.find('.tippy-content').html()).toContain(title)

    await wrapper.setProps({ isLoading: true })
    await wrapper.trigger('mouseenter')
    vi.advanceTimersByTime(tippyDelay)
    await flushPromises()
    expect(wrapper.find('.tippy-content').exists()).toBeFalsy()
    expect(wrapper.html()).not.toContain(title)

    await wrapper.setProps({ isLoading: false })
    await wrapper.trigger('mouseenter')
    vi.advanceTimersByTime(tippyDelay)
    await flushPromises()
    expect(wrapper.find('.tippy-content').exists()).toBeTruthy()
    expect(wrapper.find('.tippy-content').html()).toContain(title)
  })

  // спиннер загрузки
  it('не показывает спиннер загрузки по дефолту', async () => {
    const wrapper = getWrapper()
    expect(wrapper.find('[data-test="loading-wrapper"]').exists()).toBeFalsy()
  })
  it('показывает спиннер загрузки во время загрузки', async () => {
    const wrapper = getWrapper()
    expect(wrapper.find('[data-test="loading-wrapper"]').exists()).toBeFalsy()

    await wrapper.setProps({ isLoading: true })
    expect(wrapper.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()
    expect(wrapper.find('.v-btn-loading').exists()).toBeTruthy()

    await wrapper.setProps({ isLoading: false })
    expect(wrapper.find('[data-test="loading-wrapper"]').exists()).toBeFalsy()
  })
  describe('корректно вычисляет css-классы спиннера для', () => {
    const slot = { default: '<div>Текст кнопки</div>' }
    const generalClasses = ['absolute', 'v-btn-loading']
    describe('type default с пропсами', () => {
      it('notBordered-notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'default',
              notBordered: true,
              notFilling: true,
              disabled: false,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-gray-700',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('notBordered-!notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'default',
              notBordered: true,
              notFilling: false,
              disabled: false,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-gray-700',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-!notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'default',
              notBordered: false,
              notFilling: false,
              disabled: false,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-gray-700',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'default',
              notBordered: false,
              notFilling: true,
              disabled: false,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-gray-700',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })

      it('notBordered-notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'default',
              notBordered: true,
              notFilling: true,
              disabled: true,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-gray-700',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('notBordered-!notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'default',
              notBordered: true,
              notFilling: false,
              disabled: true,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-gray-700',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-!notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'default',
              notBordered: false,
              notFilling: false,
              disabled: true,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-gray-700',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'default',
              notBordered: false,
              notFilling: true,
              disabled: true,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-gray-700',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
    })
    describe('type success с пропсами', () => {
      it('notBordered-notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'success',
              notBordered: true,
              notFilling: true,
              disabled: false,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-emerald-700',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('notBordered-!notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'success',
              notBordered: true,
              notFilling: false,
              disabled: false,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-white',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-!notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'success',
              notBordered: false,
              notFilling: false,
              disabled: false,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-white',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'success',
              notBordered: false,
              notFilling: true,
              disabled: false,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-emerald-700',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })

      it('notBordered-notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'success',
              notBordered: true,
              notFilling: true,
              disabled: true,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-emerald-700',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('notBordered-!notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'success',
              notBordered: true,
              notFilling: false,
              disabled: true,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-white',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-!notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'success',
              notBordered: false,
              notFilling: false,
              disabled: true,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-white',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'success',
              notBordered: false,
              notFilling: true,
              disabled: true,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-emerald-700',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
    })
    describe('type error с пропсами', () => {
      it('notBordered-notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'error',
              notBordered: true,
              notFilling: true,
              disabled: false,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-red-500',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('notBordered-!notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'error',
              notBordered: true,
              notFilling: false,
              disabled: false,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-white',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-!notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'error',
              notBordered: false,
              notFilling: false,
              disabled: false,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-white',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-notFilling-!disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'error',
              notBordered: false,
              notFilling: true,
              disabled: false,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-red-500',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })

      it('notBordered-notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'error',
              notBordered: true,
              notFilling: true,
              disabled: true,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-red-500',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('notBordered-!notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'error',
              notBordered: true,
              notFilling: false,
              disabled: true,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-white',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-!notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'error',
              notBordered: false,
              notFilling: false,
              disabled: true,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-white',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
      it('!notBordered-notFilling-disabled', () => {
        const wrp = getWrapper(
          {
            props: {
              type: 'error',
              notBordered: false,
              notFilling: true,
              disabled: true,
              isLoading: true,
            },
            slots: slot,
          })

        expect(wrp.find('[data-test="loading-wrapper"]').exists()).toBeTruthy()

        const spinnerWrp = wrp.find('[data-test="spinner"]')

        const approvedClasses = [
          ...generalClasses,
          'text-red-500',
        ]

        // классы могут быть в любом порядке
        expect(spinnerWrp.classes().length).toEqual(approvedClasses.length)
        expect(spinnerWrp.classes()).toEqual(expect.arrayContaining(approvedClasses))
      })
    })
  })
})

function getWrapper (data) {
  return mount(VBtn, {
    // attachTo нужен, чтобы не обвалилось обращение к document у tippy
    attachTo: document.body,
    ...data,
  })
}
