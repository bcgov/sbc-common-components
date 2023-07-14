import { mount } from '@vue/test-utils';
import SbcHeader from '@/components/SbcHeader.vue';
import vuetify from './setup';
import { createStore } from 'vuex';
import AccountModule from '@/store/modules/account';
import AuthModule from '@/store/modules/auth';
import NotificationModule from '@/store/modules/notification'


describe('SbcHeader', () => {
    let store: any;

    beforeEach(() => {
        // Create a new Vuex store instance with the required modules
        store = createStore({
          modules: {
            account: AccountModule,
            auth: AuthModule,
            notification: NotificationModule
          },
        });
    });
  it('renders the brand title correctly', () => {
    const wrapper = mount(SbcHeader, {
        global: {
            plugins: [store, vuetify]
        }
    });

    expect(wrapper.find('.brand__title').text()).toBe('BC Registries and Online Services');
  });
});
