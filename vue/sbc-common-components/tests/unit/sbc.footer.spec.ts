import { shallowMount } from '@vue/test-utils';
import SbcFooter from '@/components/SbcFooter.vue';
import vuetify from './setup';

describe('SbcFooter', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(SbcFooter, {
      props: {
        isLoading: true,
      },
      global: {
        plugins: [vuetify],
      },
    });       
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the correct navigation links', () => {
    const wrapper = shallowMount(SbcFooter, {
      props: {
        isLoading: true,
      },
      global: {
        plugins: [vuetify],
      },
    });   
    const links = wrapper.findAll('nav ul li a');

    expect(links.length).toBe(5);
    expect(links[0].attributes('href')).toBe('/');
    expect(links[1].attributes('href')).toBe('https://www2.gov.bc.ca/gov/content/home/disclaimer');
    expect(links[2].attributes('href')).toBe('https://www2.gov.bc.ca/gov/content/home/privacy');
    expect(links[3].attributes('href')).toBe('https://www2.gov.bc.ca/gov/content/home/accessibility');
    expect(links[4].attributes('href')).toBe('https://www2.gov.bc.ca/gov/content/home/copyright');
  });

  it.skip('renders the about tooltip when aboutText prop is provided', async () => {
    const aboutTextProp = 'This is a test';
    const wrapper = shallowMount(SbcFooter, {
      props: {
        aboutText: true,
      },
      global: {
        plugins: [vuetify],
      },
    });    
    const tooltipContent = wrapper.find('v-tooltip span');
    expect(tooltipContent.exists()).toBe(true);
    expect(tooltipContent.text()).toBe(aboutTextProp);
  });

  it('does not display the tooltip when aboutText prop is not provided', () => {
    const wrapper = shallowMount(SbcFooter, {
      props: {
        isLoading: true,
      },
      global: {
        plugins: [vuetify],
      },
    });     
    const tooltipIcon = wrapper.find('v-tooltip v-icon');
    const tooltipContent = wrapper.find('v-tooltip span');
    expect(tooltipIcon.exists()).toBe(false);
    expect(tooltipContent.exists()).toBe(false);
  });
});
