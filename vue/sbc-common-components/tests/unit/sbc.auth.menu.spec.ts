import { mount,VueWrapper } from '@vue/test-utils';
import SbcAuthMenu from '@/components/SbcAuthMenu.vue';
import { createStore } from 'vuex';
import AccountModule from '@/store/modules/account';
import AuthModule from '@/store/modules/auth';

describe('SbcAuthMenu', () => {
    let wrapper: VueWrapper<any>;
    let store: any;

    beforeEach(() => {
        // Create a new Vuex store instance with the required modules
        store = createStore({
          modules: {
            account: AccountModule,
            auth: AuthModule,
          },
        });
    
        wrapper = mount(SbcAuthMenu, {
          global: {
            plugins: [store],
          },
        });
      });
    
 it('is visible', () => {
     expect(wrapper.isVisible()).toBe(true);
    });
    
  it('renders the login options correctly', () => {
    const loginOptions = wrapper.findAll('.items');
    expect(loginOptions).toHaveLength(3); // Assuming there are three login options
  });
});
