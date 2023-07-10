import { flushPromises, shallowMount } from '@vue/test-utils';
import SbcFooter from '@/components/SbcFooter.vue';


describe('SbcFooter', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(SbcFooter);
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the correct navigation links', () => {
    const wrapper = shallowMount(SbcFooter);
    const links = wrapper.findAll('nav ul li a');

    expect(links.length).toBe(5);
    expect(links[0].attributes('href')).toBe('/');
    expect(links[1].attributes('href')).toBe('https://www2.gov.bc.ca/gov/content/home/disclaimer');
    expect(links[2].attributes('href')).toBe('https://www2.gov.bc.ca/gov/content/home/privacy');
    expect(links[3].attributes('href')).toBe('https://www2.gov.bc.ca/gov/content/home/accessibility');
    expect(links[4].attributes('href')).toBe('https://www2.gov.bc.ca/gov/content/home/copyright');
  });

  it('renders the about tooltip when aboutText prop is provided', async () => {
    const aboutTextProp = 'This is a test';
    const wrapper = shallowMount(SbcFooter);
    await wrapper.setProps({ aboutText: aboutTextProp });
    await flushPromises()

    const tooltip = wrapper.findComponent({ name: 'v-tooltip' });
    expect(tooltip.exists()).toBe(true);
    expect(tooltip.find('span').text()).toBe(aboutTextProp);
  });
});
