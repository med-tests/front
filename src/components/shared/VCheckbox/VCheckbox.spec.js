import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import VCheckbox from '@/components/shared/VCheckbox/index.vue'
import {getRandomUid} from '@/helpers/index.js'

const getWrapper = (customProps) => {
  return mount(VCheckbox, {
    props: { id: getRandomUid(), ...customProps },
  })
}

describe('VCheckbox', () => {
  // label
  it('отображает заголовок, когда он передан', () => {
    const labelText = 'Hello, I am a checkbox label.'
    const wrapper = getWrapper({ label: labelText })
    expect(wrapper.find('label').text()).toBe(labelText)
  })
  it('НЕ отображает заголовок, когда он НЕ передан', () => {
    const wrapper = getWrapper()
    expect(wrapper.find('label').exists()).toBeFalsy()
  })

  // значение по умолчанию
  it('анчекнут по умолчанию', async () => {
    const wrapper = getWrapper()

    expect(wrapper.find('input').element.checked).toBeFalsy()
  })
  it('можно чекнуть по умолчанию числовым пропсом', async () => {
    const wrapper = getWrapper({ modelValue: 1})
    expect(wrapper.find('input').element.checked).toBeTruthy()
  })

  // эмит значения
  it ('когда чекнули, происходит эмит modelValue', async () => {
    const wrapper = getWrapper()
    await wrapper.find('input').setValue()
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
  })
  it ('когда анчекнули, происходит эмит modelValue', async () => {
    const wrapper = getWrapper()
    await wrapper.find('input').setValue()
    await wrapper.find('input').setValue(false)
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(2)
  })
  it('эмитит число 1 когда чекнут', async () => {
    const wrapper = getWrapper()
    await wrapper.find('input').setValue()
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe(1)
  })
  it('эмитит число 0 когда анчекнут', async () => {
    const wrapper = getWrapper()
    await wrapper.find('input').setValue()
    await wrapper.find('input').setValue(false)
    expect(wrapper.emitted('update:modelValue')[1][0]).toBe(0)
  })

  // валидация
  it('эмитит событие валидации при изменении пропса touchId', async () => {
    const wrapper = getWrapper({ required: true, touchId: '' })
    // должен измениться touchId, чтобы запустилась валидация
    await wrapper.setProps({ touchId: getRandomUid() })
    expect(wrapper.emitted()).toHaveProperty('onValidate')
  })
  it('эмитит ошибку валидации, когда анчекнут при required', async () => {
    const wrapper = getWrapper({ required: true, touchId: '' })
    // должен измениться touchId, чтобы запустилась валидация
    await wrapper.setProps({ touchId: getRandomUid() })
    expect(wrapper.emitted('onValidate')[0][0]).toBeTruthy()
  })
  it('эмитит ошибку валидации, когда чекнули и анчекнули при required', async () => {
    const wrapper = getWrapper({ required: true, touchId: '' })
    // должен измениться touchId, чтобы запустилась валидация
    const checkbox = wrapper.find('input')
    await checkbox.setValue()
    await checkbox.setValue(false)
    await wrapper.setProps({ touchId: getRandomUid() })
    expect(wrapper.emitted('onValidate')[0][0]).toBeTruthy()
  })
  it('эмитит ошибку валидации, когда НЕ проходит кастомную валидацию', async () => {
    const wrapper = getWrapper({
      callbackValidator: (val) => !!val, // аналог required
    })
    await wrapper.setProps({ touchId: getRandomUid() })
    expect(wrapper.emitted('onValidate')[0][0]).toBeTruthy()
  })
  it('эмитит успех валидации, когда чекнут при required', async () => {
    const wrapper = getWrapper(
      { required: true, touchId: '' },
    )
    const checkbox = wrapper.find('input')
    // нужно для отрабатывания валидации, по умолчанию валидно и вотчер не тригериться
    await checkbox.setValue()
    await checkbox.setValue(false)
    await wrapper.setProps({ touchId: getRandomUid() })
    await checkbox.setValue()
    await wrapper.setProps({ touchId: getRandomUid() })
    expect(wrapper.emitted()).toHaveProperty('onValidate')
    expect(wrapper.emitted('onValidate')[0][1]).toBeFalsy()
  })
  it('эмитит успех валидации, когда проходит кастомную валидацию', async () => {
    const wrapper = getWrapper(
      {
        touchId: '',
        callbackValidator: (val) => !!val, // аналог required
      },
    )
    const checkbox = wrapper.find('input')
    // нужно для отрабатывания валидации, по умолчанию валидно и вотчер не тригериться
    await checkbox.setValue()
    await checkbox.setValue(false)
    await wrapper.setProps({ touchId: getRandomUid() })
    await checkbox.setValue()
    await wrapper.setProps({ touchId: getRandomUid() })
    expect(wrapper.emitted()).toHaveProperty('onValidate')
    expect(wrapper.emitted('onValidate')[0][1]).toBeFalsy()
  })
  it('при изменении значения сбрасывает состояние валидации', async () => {
    const wrapper = getWrapper({ required: true })
    await wrapper.setProps({ touchId: getRandomUid() })
    await wrapper.find('input').setValue()
    await wrapper.setProps({ touchId: getRandomUid() })
    expect(wrapper.emitted('onValidate')[0][0]).toBeTruthy()
    expect(wrapper.emitted('onValidate')[0][1]).toBeFalsy()
  })

  // стили
  it('label имеет класс required когда required', async () => {
    const wrapper = getWrapper({ required: true, label: 'Название обязательного чекбокса' })
    expect(wrapper.find('label').classes()).toContain('required')
  })
  it ('не имеет красной рамки по умолчанию', async () => {
    const wrapper = getWrapper()
    expect(wrapper.get('input').classes('border-red-300')).toBe(false)
  })
  it('имеет красный бордер, когда анчекнут при required', async () => {
    const wrapper = getWrapper({ required: true })
    await wrapper.setProps({ touchId: getRandomUid() })
    expect(wrapper.get('input').classes()).toContain('border-red-300')
  })
  it('имеет красный бордер, когда НЕ проходит кастомную валидацию', async () => {
    const wrapper = getWrapper({
      callbackValidator: (val) => !!val, // аналог required
    })
    await wrapper.setProps({ touchId: getRandomUid() })
    expect(wrapper.get('input').classes()).toContain('border-red-300')
  })
  it('теряет красный бордер, когда меняется значение', async () => {
    const wrapper = getWrapper({ required: true })
    await wrapper.setProps({ touchId: getRandomUid() })
    expect(wrapper.get('input').classes()).toContain('border-red-300')
    await wrapper.find('input').setValue()
    await wrapper.setProps({ touchId: getRandomUid() })
    expect(wrapper.get('input').classes('border-red-300')).toBe(false)
  })
})

