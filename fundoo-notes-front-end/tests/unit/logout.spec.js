import { shallowMount } from '@vue/test-utils'
import Logout from '../../src/components/Logout.vue'
import { createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuelidate from 'vuelidate';

describe('Logout.vue', () => {
  let wrapper

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(Vuetify)
    localVue.use(Vuelidate)
    wrapper = shallowMount(Logout, {
      localVue,
    })
  })

  it('emailId should evaluate to true when it contains value', () => {
    wrapper.setData({ emailId: 'shilpa07udupi@gmail.com' })
    expect(wrapper.vm.emailId).toBe('shilpa07udupi@gmail.com')
  })

  
  it('emailId should evaluate to false when it is empty', () => {
    wrapper.setData({ emailId: '' })
    expect(wrapper.vm.emailId).toBe('')
  })

  it('check if visible', () => {
    expect(wrapper.isVisible()).toBe(true)
  })

  it('Check emitted "logout" event', ()=>{
    wrapper.vm.$emit('logout')
    expect(wrapper.emitted().logout).toBeTruthy()
  })

})
