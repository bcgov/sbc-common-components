import { mount } from '@vue/test-utils';
import LoadingScreen from '../../src/components/LoadingScreen.vue';

describe('loading screen component', () => {
  it('renders v progress circular when isLoading is true', () => {
    const wrapper = mount(LoadingScreen, {
      props: {
        isLoading: true,
      },
    });

    const progressCircular = wrapper.find('.v-loader');
    expect(progressCircular.exists()).toBe(true);
  });

  it('does not render v progress circular when isLoading is false', () => {
    const wrapper = mount(LoadingScreen, {
      props: {
        isLoading: false,
      },
    });

    const progressCircular = wrapper.find('.v-loader');
    expect(progressCircular.exists()).toBe(false);
  });
});
