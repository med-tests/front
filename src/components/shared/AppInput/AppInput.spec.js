import AppInput from '@/components/shared/AppInput'
import {getRandomUid} from '@/helpers'
import {mount} from '@vue/test-utils'

describe('AppInput', () => {
  it('test', () => {
    const wrp = getWrapper()
    expect(wrp.exists()).toBeTruthy()
  })
})

function getWrapper (options = {}) {
  const randomId = getRandomUid()
  return mount(AppInput, {
    props: {
      id: randomId,
    },
    ...options,
  })
}